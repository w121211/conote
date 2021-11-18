import { assert } from 'console'
import cuid from 'cuid'
import { NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import {
  CardInput as GQLCardInput,
  CommitInput as GQLCommitInput,
  CardStateInput as GQLCardStateInput,
  Commit as GQLCommit,
} from '../../apollo/type-defs.graphqls'
import { Bullet } from '../../components/bullet/types'
import prisma from '../prisma'
import { CardStateBody, CardStateModel } from './card-state'
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

  _toInserts(inputs: GQLCardStateInput[]): CardStateInsert[] {
    // Initialize symbol-cuid dicts
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
        if (e.data && e.data.cid) {
          e.data.id = cuid() // in-place
          delete e.data.cid // cid should not store in backend
          bulletInserts.push({ id: e.data.id })
        }
        return e
      })
      const finalValue = TreeService.fromList(nodes)

      const insert: CardStateInsert = {
        id: genStateId[cid],
        cardId: cardId ?? undefined,
        body: {
          prevStateId: prevStateId ?? null,
          sourceCardId: sourceCardId ?? null,
          changes,
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

    const { cardStates, ...restCommit } = commit
    return {
      cardStates: cardStates.map(e => CardStateModel.toParsed(e)),
      ...restCommit,
    }
  },
}
