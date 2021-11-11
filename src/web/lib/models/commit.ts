import { assert } from 'console'
import cuid from 'cuid'
import { Commit } from '.prisma/client'
import {
  CardInput as GQLCardInput,
  CommitInput as GQLCommitInput,
  CardStateInput as GQLCardStateInput,
} from '../../apollo/type-defs.graphqls'
import prisma from '../prisma'
import { NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Bullet } from '../bullet/types'
import { ParsedSymbol, SymbolModel } from './symbol'

export type CardStateBody = {
  prevStateId: string | null
  subStateIds: string[]
  changes: NodeChange<Bullet>[]
  value: TreeNode<Bullet>[]
}

type InsertBullet = {
  id: string
}

type InsertCard = {
  id: string
  symbol: string
  // meta?: Record<string, string>
}

type InsertCardState = {
  id: string
  symbol: ParsedSymbol
  cardId?: string // 用此替代 symbol
  body: CardStateBody
  insertCard?: InsertCard
  insertBullets: InsertBullet[]
}

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

  _toInserts(inputs: GQLCardStateInput[]): InsertCardState[] {
    // Initialize symbol-cuid dicts
    const stateSymbols = [...new Set(inputs.map(e => e.symbol))]
    const stateIdDict: Record<string, string> = Object.fromEntries(stateSymbols.map(e => [e, cuid()]))
    const cardSymbols = [...new Set(inputs.map(e => e.cardInput?.symbol))]
    const cardIdDict: Record<string, string> = Object.fromEntries(cardSymbols.map(e => [e, cuid()]))

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

    const inserts = inputs.map<InsertCardState>(state => {
      const { prevStateId, cardId, symbol, subSymbols, changes, finalValue, cardInput } = state

      for (const e of subSymbols) {
        if (!stateSymbols.includes(e)) {
          console.error(stateSymbols, inputs)
          throw '[conote-web] each subsymbol should have a corresponding card-state-input'
        }
      }

      // 直接置換 value 中每個 bullet 的 id (硬幹) -> 正常應該是要從 updates 著手
      const value: TreeNode<Bullet>[] = finalValue
      const insertBullets: InsertBullet[] = []
      const nodes = TreeService.toList(value).map(e => {
        if (e.data) {
          if (e.data.cid) {
            e.data.id = cuid() // in-place
            delete e.data.cid
            insertBullets.push({ id: e.data.id })
          }
        }
        return e
      })
      const bulletModifiedValue = TreeService.fromList(nodes)

      const insertCardState: InsertCardState = {
        id: stateIdDict[symbol],
        symbol: SymbolModel.parse(symbol),
        cardId: cardId ?? undefined,
        body: {
          prevStateId: prevStateId ?? null,
          subStateIds: subSymbols.map(e => stateIdDict[e]),
          changes,
          value: bulletModifiedValue,
        },
        insertCard: cardInput
          ? {
              ...cardInput,
              id: cardIdDict[cardInput.symbol],
            }
          : undefined,
        insertBullets,
      }
      return insertCardState
    })

    return inserts
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

  async create({ cardStateInputs }: GQLCommitInput, userId: string): Promise<Commit> {
    // const checked = this.check(this._generateIds(input))
    const inserts = this._toInserts(cardStateInputs)
    const commitId = cuid()

    // Create
    const [commit] = await prisma.$transaction([
      prisma.commit.create({
        data: {
          id: commitId,
          userId,
        },
        include: {
          cardStates: true,
        },
      }),

      ...inserts.map(e => {
        const { id, symbol, cardId, body, insertCard, insertBullets } = e
        if (insertCard) {
          return prisma.cardState.create({
            data: {
              id,
              bullets: {
                createMany: {
                  data: insertBullets.map(e => ({ id: e.id })),
                },
              },
              body,
              card: {
                create: {
                  id: insertCard.id,
                  symbol: {
                    connectOrCreate: {
                      create: { name: symbol.name, type: symbol.type },
                      where: { name: symbol.name },
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
                  data: insertBullets.map(e => ({ id: e.id })),
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
    return commit
  },
}
