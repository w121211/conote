import { assert } from 'console'
import cuid from 'cuid'
import {
  CardInput as GQLCardInput,
  CommitInput as GQLCommitInput,
  CardStateInput as GQLCardStateInput,
  Commit as GQLCommit,
} from '../../apollo/type-defs.graphqls'
import prisma from '../prisma'
import { NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/types'
import { SymbolParsed, SymModel } from './sym'
import { CardStateBody, CardStateModel } from './card-state'

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
  symbolParsed: SymbolParsed
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
      const { prevStateId, cardId, sourceCardId, symbol, changes, finalValue, cardInput } = state

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

      const insert: InsertCardState = {
        id: stateIdDict[symbol],
        symbolParsed: SymModel.parse(symbol),
        cardId: cardId ?? undefined,
        body: {
          prevStateId: prevStateId ?? null,
          sourceCardId: sourceCardId ?? null,
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
      return insert
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

  async create({ cardStateInputs }: GQLCommitInput, userId: string): Promise<GQLCommit> {
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
        const { id, symbolParsed, cardId, body, insertCard, insertBullets } = e
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

    const { cardStates, ...restCommit } = commit
    return {
      cardStates: cardStates.map(e => CardStateModel.toParsed(e)),
      ...restCommit,
    }
  },
}
