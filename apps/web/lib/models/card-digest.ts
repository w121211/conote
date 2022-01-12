import { Sym } from '@prisma/client'
import { CardDigest as GQLCardDigest } from 'graphql-let/__generated__/__types__'
import { NodeBody, NodeChange, TreeNode, TreeService } from '@conote/docdiff'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'
import { CardMeta, CardModel } from './card'
import { CardStateModel } from './card-state'
import { RowCardState, RowCommit } from './commit'

type CardDigest = {
  cardId: string
  cardMeta: CardMeta
  commitId: string
  fromCardId?: string
  picks: string[]
  sym: Sym
  updatedAt: Date
}

export const CardDigestModel = {
  // fromCard(card: CardPrarsed, subs: GQLCardDigest[]): GQLCardDigest {
  //   if (subs.length === 0) {
  //     throw 'Require 1 or more sub-digests to create a null-state-card digest'
  //   }
  //   const { id: cardId, sym, meta: cardMeta } = card
  //   return {
  //     commitId: subs[0].commitId, // TODO: temp fill
  //     cardId,
  //     cardMeta,
  //     sym,
  //     title: sym.symbol,
  //     picks: [],
  //     subs,
  //     updatedAt: subs[0].updatedAt, // TODO:  temp fill
  //   }
  // },

  fromCardState(state: RowCardState): Omit<CardDigest, 'children'> {
    const { meta: cardMeta, sym } = CardModel.parse(state.card)
    const { body, cardId, commitId, createdAt, updatedAt } = CardStateModel.parse(state)
    return {
      commitId,
      cardId,
      cardMeta,
      fromCardId: body.fromCardId,
      sym,
      picks: body.changes
        .filter((e): e is NodeChange<Bullet> & { data: Bullet } => e.data !== undefined && e.type === 'insert')
        .map(e => e.data.head),
      updatedAt,
    }
  },

  fromCommit(commit: RowCommit): TreeNode<CardDigest>[] {
    const nodes = TreeService.fromList(commit.cardStates.map(e => this.toNodeBody(this.fromCardState(e))))
    return nodes
  },

  async _getLatest(afterCommitId?: string): Promise<TreeNode<CardDigest>[]> {
    // const maxDate = dayjs().startOf('d').subtract(7, 'd')
    const commits = await prisma.commit.findMany({
      // where: { createdAt: { gte: maxDate.toDate() } },
      orderBy: { updatedAt: 'desc' },
      cursor: afterCommitId ? { id: afterCommitId } : undefined,
      take: 20,
      skip: afterCommitId ? 1 : 0,
      include: { cardStates: { include: { card: { include: { sym: true, link: true } } } } },
    })
    const digests = commits
      .map(e => this.fromCommit(e))
      .reduce((acc, cur) => {
        const filtered = cur.filter(e => acc.find(f => f.data?.sym.id === e.data?.sym.id) === undefined) // only keep the latest digest for the same symbol
        return [...acc, ...filtered] // flatten
      }, [])
    return digests
  },

  async getLatest(afterCommitId?: string): Promise<GQLCardDigest[]> {
    const nodes = await this._getLatest(afterCommitId)
    return nodes.map(e => this.toGQLCardDigest(e))
  },

  toGQLCardDigest(node: TreeNode<CardDigest>): GQLCardDigest {
    if (node.data === undefined) {
      throw 'node.data === undefined'
    }
    const children = TreeService.toList(node.children)
    return {
      ...node.data,
      subSyms: children.map(e => e.data?.sym).filter<Sym>((e): e is Sym => e !== undefined),
    }
  },

  toNodeBody(digest: CardDigest): NodeBody<CardDigest> {
    const { cardId, fromCardId, updatedAt } = digest
    return {
      cid: cardId, // since parent-cid is bind with card-id
      data: digest,
      parentCid: fromCardId ?? TreeService.tempRootCid,
      index: updatedAt.getTime(),
    }
  },
}
