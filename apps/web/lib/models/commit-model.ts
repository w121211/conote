import { Commit, NoteState, PrismaPromise, Sym } from '@prisma/client'
import cuid from 'cuid'
import {
  NoteInput as GQLNoteInput,
  NoteMetaInput as GQLNoteMetaInput,
  NoteStateInput as GQLNoteStateInput,
  CommitInput as GQLCommitInput,
} from 'graphql-let/__generated__/__types__'
import { inspect } from 'util'
import { NodeChange, TreeNode, TreeService } from '@conote/docdiff'
import { Bullet } from '../../components/bullet/bullet'
import prisma from '../prisma'
import { PrismaNote } from './note-model'
import { NoteStateBody, NoteStateModel, NoteStateParsed } from './note-state-model'
import { SymbolParsed, SymModel } from './sym-model'

type BulletInsert = {
  gid: string // pre-generated bullet id
}

type NoteInsert = {
  gid: string
  symbolParsed: SymbolParsed
  meta?: GQLNoteMetaInput
}

type NoteUpdate = {
  // symbol: string
  meta: GQLNoteMetaInput
}

type NoteStateInsert = {
  gid: string // pre-generated note-state id
  body: NoteStateBody // store in json
  bulletInserts: BulletInsert[]
  noteId?: string // existed note
  noteInsert?: NoteInsert // create a new note
  noteUpdate?: NoteUpdate // update note-meta
}

// export type NoteState = {
//   main: {
//     noteId: string
//     state?: RowNoteState
//   }
//   subs: RowNoteState[]
// }

export type CommitParsed = Commit & { noteStates: NoteStateParsed[] }

export type PrismaNoteState = NoteState & { note: PrismaNote }

export type PrismaCommit = Commit & { noteStates: PrismaNoteState[] }

/**
 * cid: client-id
 * gid: generated-id
 */

export const CommitModel = {
  _checkNoteInput(noteInput: GQLNoteInput): void {
    // Note should not be existed
    // Note should be symbol-note, not webpage
  },

  // async _checkDocInput(doc: DBDocInput): Promise<void> {
  //   // prev-doc 是 note 當前的 head
  //   const note = await prisma.note.findUnique({ where: { symbol: doc.symbol } })
  //   if (note) {
  //     assert(note.headDocId === doc.prevDocId, 'Prev-doc not match to head-doc of note')
  //   } else {
  //     assert(doc.noteInput !== undefined, 'Doc should get note input')
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
  //     if (e.noteInput) {
  //       assert(e.noteInput.symbol === e.symbol, 'Symbol should equal')
  //       this._checkNoteInput(e.noteInput)
  //     }
  //   }
  //   for (const [symbol, noteInput, doc] of zip(noteInputs, docs)) {
  //     if (doc === undefined) {
  //       throw '創卡需要搭配 doc'
  //     }
  //     if (noteInput) {
  //       checkSymbol(symbol)
  //       checkNoteInput(noteInput)
  //     }
  //     checkDoc(doc, allDocsDict)
  //   }
  // },

  _toInserts(inputs: GQLNoteStateInput[]): [
    NoteStateInsert[],
    {
      cidToNoteIdOrGid: Record<string, string>
      cidToStateGid: Record<string, string>
      stateGidToCid: Record<string, string>
    },
  ] {
    // console.log(inspect(inputs, { depth: null }))
    const cids = [...new Set(inputs.map(e => e.cid))] // doc-cids
    if (cids.length !== inputs.length) {
      throw 'cids.length !== inputs.length, input cids have duplicates'
    }
    const cidToNoteIdOrGid: Record<string, string> = {}
    const cidToStateGid: Record<string, string> = {}
    for (const e of inputs) {
      const { cid, noteId, noteInput } = e
      if (noteId) {
        cidToNoteIdOrGid[cid] = noteId
      } else if (noteInput) {
        cidToNoteIdOrGid[cid] = cuid()
      } else {
        throw 'noteId === null && noteInput === null'
      }
      cidToStateGid[cid] = cuid()
    }
    const stateGidToCid = Object.fromEntries(Object.entries(cidToStateGid).map(([k, v]) => [v, k]))

    const inserts = inputs.map<NoteStateInsert>(input => {
      const { cid, fromDocCid, noteInput, noteId, prevStateId, changes, value } = input
      // console.log({ cid, prevStateId, noteId, sourceNoteId, noteInput, changes, value })

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

      let noteInsert: NoteInsert | undefined
      let noteUpdate: NoteUpdate | undefined
      if (noteId) {
        if (noteInput?.meta) {
          noteUpdate = {
            meta: noteInput.meta,
          }
        }
      } else if (noteInput) {
        noteInsert = {
          gid: cidToNoteIdOrGid[cid],
          symbolParsed: SymModel.parse(noteInput.symbol),
          meta: noteInput.meta ?? undefined,
        }
      }

      const insert: NoteStateInsert = {
        gid: cidToStateGid[cid],
        body: {
          prevStateId: prevStateId ?? null,
          changes: changes as unknown as NodeChange<Bullet>[],
          value: finalValue,
          fromNoteId: fromDocCid ? cidToNoteIdOrGid[fromDocCid] : undefined,
        },
        bulletInserts,
        noteId: noteId ?? undefined,
        noteInsert,
        noteUpdate,
      }
      return insert
    })
    return [inserts, { cidToNoteIdOrGid, cidToStateGid, stateGidToCid }]
  },

  async create(
    { noteStateInputs }: GQLCommitInput,
    userId: string,
  ): Promise<{
    commit: CommitParsed
    stateGidToCid: Record<string, string>
    symsCommitted: Sym[] // syms committed
  }> {
    // console.log(inspect(noteStateInputs, { depth: null }))
    if (noteStateInputs.length === 0) {
      throw 'Commit requires at least 1 note-state'
    }
    // const checked = this.check(this._generateIds(input))
    const [inserts, { stateGidToCid }] = this._toInserts(noteStateInputs)
    // console.log(inspect(inserts, { depth: null }))

    const commitId = cuid()
    const promises: PrismaPromise<any>[] = []
    for (const e of inserts) {
      const { gid, body, noteId, noteInsert, noteUpdate, bulletInserts } = e
      if ((noteId && noteInsert) || (noteInsert && noteUpdate)) {
        throw '(noteId && noteInsert) || (noteInsert && noteUpdate), note-id existed not allow to insert a new note, use note-update instead'
      }
      if (noteInsert) {
        const { symbolParsed } = noteInsert
        promises.push(
          prisma.noteState.create({
            data: {
              id: gid,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.gid })),
                },
              },
              body,
              note: {
                create: {
                  id: noteInsert.gid,
                  sym: {
                    connectOrCreate: {
                      create: { symbol: symbolParsed.symbol, type: symbolParsed.type },
                      where: { symbol: symbolParsed.symbol },
                    },
                  },
                  meta: noteInsert.meta,
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
      if (noteId) {
        if (noteUpdate) {
          promises.push(
            prisma.note.update({
              data: { meta: noteUpdate.meta },
              where: { id: noteId },
            }),
          )
        }
        promises.push(
          prisma.noteState.create({
            data: {
              id: gid,
              bullets: {
                createMany: {
                  data: bulletInserts.map(e => ({ id: e.gid })),
                },
              },
              body,
              note: { connect: { id: noteId } },
              commit: { connect: { id: commitId } },
              prev: e.body.prevStateId ? { connect: { id: e.body.prevStateId } } : undefined,
              user: { connect: { id: userId } },
            },
          }),
        )
        continue
      }
      console.error(inspect(e, { depth: null }))
      throw 'Require either noteInsert or noteId'
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
      include: { noteStates: { include: { note: { include: { sym: true } } } } },
    })
    if (commit === null) {
      throw 'commit === null, unexpected database error'
    }

    const { noteStates, ...rest } = commit

    return {
      commit: {
        ...rest,
        noteStates: noteStates.map(e => NoteStateModel.parse(e)),
      },
      stateGidToCid,
      symsCommitted: noteStates.map(e => e.note.sym),
    }
  },
}
