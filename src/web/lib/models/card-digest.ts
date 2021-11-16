import dayjs from 'dayjs'
import { Card, CardState, Commit, Link, Sym } from '.prisma/client'
import { CardDigest as GQLCardDigest, CardMeta } from '../../apollo/type-defs.graphqls'
import prisma from '../prisma'
import { CardStateBody } from './card-state'

type CardDigest = Omit<GQLCardDigest, 'body'> & {
  body: CardDigestBody
  subDigests: CardDigest[]
}

export type CardDigestBody = {
  inserts: string[]
  mirrors: string[]
  shots: string[]
}

export const CardDigestModel = {
  stateToDigest(state: CardState & { card: Card & { sym: Sym; link: Link | null } }): CardDigest {
    const { updatedAt } = state
    const { id, meta, sym, link } = state.card
    return {
      id,
      meta: meta as unknown as CardMeta,
      sym,
      link,
      updatedAt,
      body: {
        inserts: [],
        mirrors: [],
        shots: [],
      },
      subDigests: [],
    }
  },

  commitToDigests(
    commit: Commit & { cardStates: (CardState & { card: Card & { sym: Sym; link: Link | null } })[] },
  ): CardDigest[] {
    throw 'Not implemented'
    const { cardStates } = commit

    const dict: Record<string, CardDigest> = Object.fromEntries(cardStates.map(e => [e.id, this.stateToDigest(e)]))
    const subs: CardDigest[] = []

    for (const state of cardStates) {
      if (state.body) {
        const { sourceCardId } = state.body as unknown as CardStateBody
        if (sourceCardId) {
          const sub = dict[state.id]
          if (sub === undefined) {
            throw 'getDocEntries() unexpected error'
          }

          subs.push(sub)
          // const { symbol: parentSymbol } = sourceCardCopy.sym
          // if (parentSymbol in dict) {
          //   dict[parentSymbol].subDigests.push(sub)
          // } else {
          //   dict[parentSymbol] = {
          //     symbol: parentSymbol,
          //     title: sourceCardCopy.meta.title ?? parentSymbol,
          //     cardId: sourceCardCopy.id,
          //     subEntries: [subEntry],
          //     updatedAt: subEntry.updatedAt,
          //   }
          // }
        }
      }
    }

    // for (const e of subs) {
    //   delete dict[e] // remove entry from dict
    // }

    // const entries: DocEntry[] = Object.values(dict)

    // sort entries
    // for (const entry of entries) {
    //   entry.subEntries.sort(e => -e.updatedAt)
    //   if (entry.subEntries.length > 0 && entry.updatedAt < entry.subEntries[0].updatedAt) {
    //     entry.updatedAt = entry.subEntries[0].updatedAt // align entry's updated with subEntries latest update
    //   }
    // }
    // entries.sort(e => -e.updatedAt)
  },

  async getLatest(afterId?: string): Promise<CardDigest[]> {
    const maxDate = dayjs().startOf('d').subtract(7, 'd')
    const commits = await prisma.commit.findMany({
      // where: { createdAt: { gte: maxDate.toDate() } },
      orderBy: { updatedAt: 'desc' },
      cursor: afterId ? { id: afterId } : undefined,
      take: 20,
      skip: afterId ? 1 : 0,
      include: { cardStates: { include: { card: { include: { sym: true, link: true } } } } },
    })

    // const digest: CardDigest = {
    //   id: ID!
    //   meta: CardMeta!
    //   sym: Sym!
    //   link: Link
    //   # headDoc: CardDoc # 可能為 null
    //   updatedAt: DateTime!
    //   digest: JSON!
    // }

    throw 'Not implemented'
    // const maxDate = dayjs().startOf('d').subtract(7, 'd')
    // const cards = await prisma.card.findMany({
    //   // where: { createdAt: { gte: maxDate.toDate() } },
    //   orderBy: { updatedAt: 'desc' },
    //   cursor: afterId ? { id: afterId } : undefined,
    //   take: 10,
    //   skip: afterId ? 1 : 0,
    // })
    // return cards
  },
}
