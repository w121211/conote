import { CardState, Commit, PrismaPromise } from '.prisma/client'
import cuid from 'cuid'
import {
  CardInput as GQLCardInput,
  CardMetaInput as GQLCardMetaInput,
  CardStateInput as GQLCardStateInput,
  CommitInput as GQLCommitInput,
} from 'graphql-let/__generated__/__types__'
import { inspect } from 'util'
import { NodeChange, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'
import { RowCard } from './card'
import { CardStateBody, CardStateModel, CardStateParsed } from './card-state'
import { SymbolParsed, SymModel } from './sym'

type BulletInsert = {
  gid: string // pre-generated bullet id
}

type CardInsert = {
  gid: string
  symbolParsed: SymbolParsed
  meta?: GQLCardMetaInput
}

type CardUpdate = {
  // symbol: string
  meta: GQLCardMetaInput
}

type CardStateInsert = {
  gid: string // pre-generated card-state id
  body: CardStateBody // store in json
  bulletInserts: BulletInsert[]
  cardId?: string // existed card
  cardInsert?: CardInsert // create a new card
  cardUpdate?: CardUpdate // update card-meta
}

// export type CardState = {
//   main: {
//     cardId: string
//     state?: RowCardState
//   }
//   subs: RowCardState[]
// }

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

  _toInserts(inputs: GQLCardStateInput[]): [
    CardStateInsert[],
    {
      cidToCardIdOrGid: Record<string, string>
      cidToStateGid: Record<string, string>
      stateGidToCid: Record<string, string>
    },
  ] {
    // console.log(inspect(inputs, { depth: null }))
    const cids = [...new Set(inputs.map(e => e.cid))] // doc-cids
    if (cids.length !== inputs.length) {
      throw 'cids.length !== inputs.length, input cids have duplicates'
    }
    const cidToCardIdOrGid: Record<string, string> = {}
    const cidToStateGid: Record<string, string> = {}
    for (const e of inputs) {
      const { cid, cardId, cardInput } = e
      if (cardId) {
        cidToCardIdOrGid[cid] = cardId
      } else if (cardInput) {
        cidToCardIdOrGid[cid] = cuid()
      } else {
        throw 'cardId === null && cardInput === null'
      }
      cidToStateGid[cid] = cuid()
    }
    const stateGidToCid = Object.fromEntries(Object.entries(cidToStateGid).map(([k, v]) => [v, k]))

    const inserts = inputs.map<CardStateInsert>(input => {
      const { cid, fromDocCid, cardInput, cardId, prevStateId, changes, value } = input
      // console.log({ cid, prevStateId, cardId, sourceCardId, cardInput, changes, value })

      // 直接置換 value 中每個 bullet 的 id (硬幹) -> TODO: 要用 doc update
      const bulletInserts: BulletInsert[] = []
      const nodes = TreeService.toList(value as unknown as TreeNode<Bullet>[]).map(e => {
        if (e.data && e.data.id === e.data.cid) {
          // a new bullet
          const gid = cuid()
          e.data.id = gid // in-place
          delete e.data.cid // cid should not store in backend
          bulletInserts.push({ gid })
        }
        return e
      })
      // console.log('bulletInserts', bulletInserts)

      const finalValue = TreeService.fromList(nodes)

      let cardInsert: CardInsert | undefined
      let cardUpdate: CardUpdate | undefined
      if (cardId) {
        if (cardInput?.meta) {
          cardUpdate = {
            meta: cardInput.meta,
          }
        }
      } else if (cardInput) {
        cardInsert = {
          gid: cidToCardIdOrGid[cid],
          symbolParsed: SymModel.parse(cardInput.symbol),
          meta: cardInput.meta ?? undefined,
        }
      }

      const insert: CardStateInsert = {
        gid: cidToStateGid[cid],
        body: {
          prevStateId: prevStateId ?? null,
          changes: changes as unknown as NodeChange<Bullet>[],
          value: finalValue,
          fromCardId: fromDocCid ? cidToCardIdOrGid[fromDocCid] : undefined,
        },
        bulletInserts,
        cardId: cardId ?? undefined,
        cardInsert,
        cardUpdate,
      }
      return insert
    })
    return [inserts, { cidToCardIdOrGid, cidToStateGid, stateGidToCid }]
  },

  async create(
    { cardStateInputs }: GQLCommitInput,
    userId: string,
  ): Promise<{
    commit: CommitParsed
    stateGidToCid: Record<string, string>
  }> {
    // console.log(inspect(cardStateInputs, { depth: null }))
    if (cardStateInputs.length === 0) {
      throw 'Commit requires at least 1 card-state'
    }
    // const checked = this.check(this._generateIds(input))
    const [inserts, { stateGidToCid }] = this._toInserts(cardStateInputs)
    // console.log(inspect(inserts, { depth: null }))

    const commitId = cuid()
    const promises: PrismaPromise<any>[] = []
    for (const e of inserts) {
      const { gid, body, cardId, cardInsert, cardUpdate, bulletInserts } = e
      if ((cardId && cardInsert) || (cardInsert && cardUpdate)) {
        throw '(cardId && cardInsert) || (cardInsert && cardUpdate), card-id existed not allow to insert a new card, use card-update instead'
      }
      if (cardInsert) {
        const { symbolParsed } = cardInsert
        promises.push(
          prisma.cardState.create({
            data: {
              id: gid,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.gid })),
                },
              },
              body,
              card: {
                create: {
                  id: cardInsert.gid,
                  sym: {
                    connectOrCreate: {
                      create: { symbol: symbolParsed.symbol, type: symbolParsed.type },
                      where: { symbol: symbolParsed.symbol },
                    },
                  },
                  meta: cardInsert.meta,
                },
              },
              commit: { connect: { id: commitId } },
              prev: e.body.prevStateId ? { connect: { id: e.body.prevStateId } } : undefined,
              user: { connect: { id: userId } },
            },
          }),
        )
        continue
      }
      if (cardId) {
        if (cardUpdate) {
          promises.push(
            prisma.card.update({
              data: { meta: cardUpdate.meta },
              where: { id: cardId },
            }),
          )
        }
        promises.push(
          prisma.cardState.create({
            data: {
              id: gid,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.gid })),
                },
              },
              body,
              card: { connect: { id: cardId } },
              commit: { connect: { id: commitId } },
              prev: e.body.prevStateId ? { connect: { id: e.body.prevStateId } } : undefined,
              user: { connect: { id: userId } },
            },
          }),
        )
        continue
      }
      console.error(inspect(e, { depth: null }))
      throw 'Require either cardInsert or cardId'
    }

    const [commitInserted] = await prisma.$transaction([
      prisma.commit.create({
        data: {
          id: commitId,
          userId,
        },
      }),
      ...promises,
    ])

    const commit = await prisma.commit.findUnique({
      where: { id: commitInserted.id },
      include: { cardStates: { include: { card: { include: { sym: true } } } } },
    })
    if (commit === null) {
      throw 'commit === null, unexpected database error'
    }

    const { cardStates, ...rest } = commit

    return {
      commit: {
        ...rest,
        cardStates: cardStates.map(e => CardStateModel.parse(e)),
      },
      stateGidToCid,
    }
  },
}
