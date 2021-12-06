import { CardDigest as GQLCardDigest } from 'graphql-let/__generated__/__types__'
import { NodeChange } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/types'
import prisma from '../prisma'
import { CardModel, CardPrarsed } from './card'
import { CardStateModel } from './card-state'
import { CommitModel, RowCardState, RowCommit } from './commit'

export const CardDigestModel = {
  fromCard(card: CardPrarsed, subs: GQLCardDigest[]): GQLCardDigest {
    if (subs.length === 0) {
      throw 'Require 1 or more sub-digests to create a null-state-card digest'
    }
    const { id: cardId, sym, meta: cardMeta } = card
    return {
      commitId: subs[0].commitId, // TODO: temp fill
      cardId,
      cardMeta,
      sym,
      title: sym.symbol,
      picks: [],
      subs,
      updatedAt: subs[0].updatedAt, // TODO:  temp fill
    }
  },

  fromCardState(state: RowCardState, subs: GQLCardDigest[] = []): GQLCardDigest {
    const { body, updatedAt } = CardStateModel.parse(state)
    const { id: cardId, meta: cardMeta, sym } = CardModel.parse(state.card)
    return {
      commitId: state.commitId,
      cardId,
      cardMeta,
      sym,
      title: sym.symbol,
      picks: body.changes
        .filter((e): e is NodeChange<Bullet> & { data: Bullet } => e.data !== undefined && e.type === 'insert')
        .map(e => e.data.head),
      subs,
      updatedAt,
    }
  },

  async commitToDigests(commit: RowCommit): Promise<GQLCardDigest[]> {
    const packs = CommitModel.toCardPacks(commit)
    // console.log(packs)

    const promises = packs.map(async e => {
      const subs = e.subs.map(e => this.fromCardState(e))
      if (e.main.state === undefined) {
        const card = await CardModel.get(e.main.cardId)
        if (card === null) {
          throw 'commitToDigests() error'
        }
        return this.fromCard(card, subs)
      }
      return this.fromCardState(e.main.state, subs)
    })
    return await Promise.all(promises)
  },

  async getLatest(afterCommitId?: string): Promise<GQLCardDigest[]> {
    // const maxDate = dayjs().startOf('d').subtract(7, 'd')
    const commits = await prisma.commit.findMany({
      // where: { createdAt: { gte: maxDate.toDate() } },
      orderBy: { updatedAt: 'desc' },
      cursor: afterCommitId ? { id: afterCommitId } : undefined,
      take: 20,
      skip: afterCommitId ? 1 : 0,
      include: { cardStates: { include: { card: { include: { sym: true, link: true } } } } },
    })
    const commitDigests = await Promise.all(commits.map(async e => this.commitToDigests(e)))
    return commitDigests.reduce((acc, cur) => {
      // only keep the latest digest for the same symbol
      const digests = cur.filter(d => acc.find(e => e.sym.id === d.sym.id) === undefined)
      return [...acc, ...digests]
    }, [])
  },
}
