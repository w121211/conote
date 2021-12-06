import { CardState, Commit } from '.prisma/client'
import cuid from 'cuid'
import {
  CardInput as GQLCardInput,
  CommitInput as GQLCommitInput,
  CardStateInput as GQLCardStateInput,
} from 'graphql-let/__generated__/__types__'
import { NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/types'
import prisma from '../prisma'
import { RowCard } from './card'
import { CardStateBody, CardStateModel, CardStateParsed } from './card-state'
import { SymbolParsed, SymModel } from './sym'

type BulletInsert = {
  id: string
}

type CardInsert = {
  id: string
  // symbol: string
  // meta?: Record<string, string>
  symbolParsed: SymbolParsed
}

type CardStateInsert = {
  id: string
  cardId?: string // 用此替代 symbol
  body: CardStateBody
  cardInsert?: CardInsert
  bulletInserts: BulletInsert[]
}

export type CardStatePack = {
  main: {
    cardId: string
    state?: RowCardState
  }
  subs: RowCardState[]
}

export type CommitParsed = Commit & { cardStates: CardStateParsed[] }

export type RowCardState = CardState & { card: RowCard }

export type RowCommit = Commit & { cardStates: RowCardState[] }

export const CommitModel = {
  _checkCardInput(cardInput: GQLCardInput): void {
    // Card should not be existed
    // Card should be symbol-card, not webpage
  },

  // async _checkDocInput(doc: DBDocInput): Promise<void> {
  //   // prev-doc 是 card 當前的 head
  //   const card = await prisma.card.findUnique({ where: { symbol: doc.symbol } })
  //   if (card) {
  //     assert(card.headDocId === doc.prevDocId, 'Prev-doc not match to head-doc of card')
  //   } else {
  //     assert(doc.cardInput !== undefined, 'Doc should get card input')
  //   }

  //   // check sub-symbols
  //   // const mirrors = getMirrors(applied)
  //   // for (const e of mirrors) {
  //   //   if (!subDocSymbols.includes(e)) {
  //   //     throw ''
  //   //   }
  //   // }

  //   // check changes (using cid)
  //   // assert(applied, doc.finalValue)   // apply changes 需一致
  // },

  // toDBChangeInputs(inputs: GQLChangeInput[]): ChangeInput[] {
  // }

  _toInserts(
    inputs: GQLCardStateInput[],
  ): [CardStateInsert[], { genCardId: Record<string, string>; genStateId: Record<string, string> }] {
    // initialize symbol-cuid dicts
    const cardInputSymbols = [...new Set(inputs.map(e => e.cardInput?.symbol))]
    const stateCids = [...new Set(inputs.map(e => e.cid))]
    const genCardId: Record<string, string> = Object.fromEntries(cardInputSymbols.map(e => [e, cuid()]))
    const genStateId: Record<string, string> = Object.fromEntries(stateCids.map(e => [e, cuid()]))

    // const queriedCards = await prisma.$transaction(
    //   stateSymbols.map(e => {
    //     return prisma.card.findUnique({ where: { symbol: e } })
    //   }),
    // )
    // const queriedCardDict: Record<string, Card | null> = Object.fromEntries(
    //   stateSymbols.map((e, i) => {
    //     return [e, queriedCards[i]]
    //   }),
    // )

    const inserts = inputs.map<CardStateInsert>(input => {
      const { cid, prevStateId, cardId, sourceCardId, cardInput, changes, value } = input

      // 直接置換 value 中每個 bullet 的 id (硬幹) -> 正常應該是要從 updates 著手
      const bulletInserts: BulletInsert[] = []
      const nodes = TreeService.toList(value as unknown as TreeNode<Bullet>[]).map(e => {
        if (e.data && e.data.id === e.data.cid) {
          // a new bullet
          const gid = cuid()
          e.data.id = gid // in-place
          delete e.data.cid // cid should not store in backend
          bulletInserts.push({ id: gid })
        }
        return e
      })
      const finalValue = TreeService.fromList(nodes)
      // e.cid = gid // node cid aligns with bullet id for later retreival

      const insert: CardStateInsert = {
        id: genStateId[cid],
        cardId: cardId ?? undefined,
        body: {
          prevStateId: prevStateId ?? null,
          sourceCardId: sourceCardId ?? null,
          changes: changes as unknown as NodeChange<Bullet>[],
          value: finalValue,
        },
        cardInsert: cardInput
          ? {
              // ...cardInput,
              id: genCardId[cardInput.symbol],
              symbolParsed: SymModel.parse(cardInput.symbol),
            }
          : undefined,
        bulletInserts,
      }
      return insert
    })
    return [inserts, { genCardId, genStateId }]
  },

  // check(changeInputs: ChangeInsert[]): ChangeInsert[] {
  //   const docDict: Record<string, GQLDocInput> = Object.fromEntries(docs.map(e => [e.symbol, e]))
  //   for (const e of docs) {
  //     // checkSymbol(e.symbol)
  //     this._checkDocInput(e)
  //     if (e.cardInput) {
  //       assert(e.cardInput.symbol === e.symbol, 'Symbol should equal')
  //       this._checkCardInput(e.cardInput)
  //     }
  //   }
  //   for (const [symbol, cardInput, doc] of zip(cardInputs, docs)) {
  //     if (doc === undefined) {
  //       throw '創卡需要搭配 doc'
  //     }
  //     if (cardInput) {
  //       checkSymbol(symbol)
  //       checkCardInput(cardInput)
  //     }
  //     checkDoc(doc, allDocsDict)
  //   }
  // },

  async create({ cardStateInputs }: GQLCommitInput, userId: string): Promise<CommitParsed> {
    if (cardStateInputs.length === 0) {
      throw 'Commit requires at least 1 card-state'
    }
    // const checked = this.check(this._generateIds(input))
    const [inserts, { genCardId, genStateId }] = this._toInserts(cardStateInputs)
    const commitId = cuid()

    // Create
    const [commitInserted] = await prisma.$transaction([
      prisma.commit.create({
        data: {
          id: commitId,
          userId,
        },
      }),
      ...inserts.map(e => {
        const { id, cardId, body, cardInsert, bulletInserts } = e
        if (cardInsert) {
          const { symbolParsed } = cardInsert
          return prisma.cardState.create({
            data: {
              id,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.id })),
                },
              },
              body,
              card: {
                create: {
                  id: cardInsert.id,
                  sym: {
                    connectOrCreate: {
                      create: { symbol: symbolParsed.symbol, type: symbolParsed.type },
                      where: { symbol: symbolParsed.symbol },
                    },
                  },
                },
              },
              commit: { connect: { id: commitId } },
              prev: e.body.prevStateId ? { connect: { id: e.body.prevStateId } } : undefined,
              user: { connect: { id: userId } },
            },
          })
        } else if (cardId) {
          return prisma.cardState.create({
            data: {
              id,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.id })),
                },
              },
              body,
              card: { connect: { id: cardId } },
              commit: { connect: { id: commitId } },
              prev: e.body.prevStateId ? { connect: { id: e.body.prevStateId } } : undefined,
              user: { connect: { id: userId } },
            },
          })
        }
        throw 'Require either insertCard or cardId'
      }),
    ])

    const commit = await prisma.commit.findUnique({
      where: { id: commitInserted.id },
      include: { cardStates: { include: { card: { include: { sym: true } } } } },
    })
    if (commit === null) {
      throw 'Unexpected database error'
    }

    const { cardStates, ...rest } = commit
    const genStateCid = Object.fromEntries(Object.entries(genStateId).map(([k, v]) => [v, k]))
    return {
      ...rest,
      cardStates: cardStates.map(e => {
        const cid = genStateCid[e.id]
        if (cid === undefined) {
          throw 'state-id key not in genStateCid , unexpected error'
        }
        return {
          ...CardStateModel.parse(e),
          cid,
        }
      }),
    }
  },

  toCardPacks(commit: RowCommit): CardStatePack[] {
    const dict: Record<string, CardStatePack> = {}

    const { cardStates } = commit
    for (const e of cardStates) {
      const body = e.body as unknown as CardStateBody
      const { sourceCardId } = body
      if (sourceCardId) {
        if (sourceCardId in dict) {
          dict[sourceCardId].subs.push(e)
        } else {
          dict[sourceCardId] = {
            main: { cardId: sourceCardId },
            subs: [e],
          }
        }
      } else {
        const { cardId } = e
        dict[cardId] =
          cardId in dict
            ? {
                ...dict[cardId],
                main: { cardId, state: e },
              }
            : {
                main: { cardId, state: e },
                subs: [],
              }
      }
    }

    return Object.entries(dict).map(([, v]) => v)
  },
}
