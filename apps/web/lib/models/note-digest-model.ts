import { Sym } from '@prisma/client'
// import { NoteDigest as GQLNoteDigest } from 'graphql-let/__generated__/__types__'
// import { NodeBody, NodeChange, TreeNode, TreeService } from '@conote/docdiff'
// import { Bullet } from '../../components/bullet/bullet'
// import prisma from '../prisma'
// import { NoteMeta, NoteModel } from './note-model'
// import { NoteStateModel } from './note-state-model'
// import { PrismaNoteState, PrismaCommit } from './commit-model'

// type NoteDigest = {
//   noteId: string
//   noteMeta: NoteMeta
//   commitId: string
//   fromNoteId?: string
//   picks: string[]
//   sym: Sym
//   updatedAt: Date
// }

// export const NoteDigestModel = {
//   // fromNote(note: NotePrarsed, subs: GQLNoteDigest[]): GQLNoteDigest {
//   //   if (subs.length === 0) {
//   //     throw 'Require 1 or more sub-digests to create a null-state-note digest'
//   //   }
//   //   const { id: noteId, sym, meta: noteMeta } = note
//   //   return {
//   //     commitId: subs[0].commitId, // TODO: temp fill
//   //     noteId,
//   //     noteMeta,
//   //     sym,
//   //     title: sym.symbol,
//   //     picks: [],
//   //     subs,
//   //     updatedAt: subs[0].updatedAt, // TODO:  temp fill
//   //   }
//   // },

//   fromNoteState(state: PrismaNoteState): Omit<NoteDigest, 'children'> {
//     const { meta: noteMeta, sym } = NoteModel.parse(state.note)
//     const { body, noteId, commitId, createdAt, updatedAt } = NoteStateModel.parse(state)
//     return {
//       commitId,
//       noteId,
//       noteMeta,
//       fromNoteId: body.fromNoteId,
//       sym,
//       picks: body.changes
//         .filter((e): e is NodeChange<Bullet> & { data: Bullet } => e.data !== undefined && e.type === 'insert')
//         .map(e => e.data.head),
//       updatedAt,
//     }
//   },

//   fromCommit(commit: PrismaCommit): TreeNode<NoteDigest>[] {
//     const nodes = TreeService.fromList(commit.noteStates.map(e => this.toNodeBody(this.fromNoteState(e))))
//     return nodes
//   },

//   async _getLatest(afterCommitId?: string): Promise<TreeNode<NoteDigest>[]> {
//     // const maxDate = dayjs().startOf('d').subtract(7, 'd')
//     const commits = await prisma.commit.findMany({
//       // where: { createdAt: { gte: maxDate.toDate() } },
//       orderBy: { updatedAt: 'desc' },
//       cursor: afterCommitId ? { id: afterCommitId } : undefined,
//       take: 20,
//       skip: afterCommitId ? 1 : 0,
//       include: { noteStates: { include: { note: { include: { sym: true, link: true } } } } },
//     })
//     const digests = commits
//       .map(e => this.fromCommit(e))
//       .reduce((acc, cur) => {
//         const filtered = cur.filter(e => acc.find(f => f.data?.sym.id === e.data?.sym.id) === undefined) // only keep the latest digest for the same symbol
//         return [...acc, ...filtered] // flatten
//       }, [])
//     return digests
//   },

//   async getLatest(afterCommitId?: string): Promise<GQLNoteDigest[]> {
//     const nodes = await this._getLatest(afterCommitId)
//     return nodes.map(e => this.toGQLNoteDigest(e))
//   },

//   toGQLNoteDigest(node: TreeNode<NoteDigest>): GQLNoteDigest {
//     if (node.data === undefined) {
//       throw 'node.data === undefined'
//     }
//     const children = TreeService.toList(node.children)
//     return {
//       ...node.data,
//       subSyms: children.map(e => e.data?.sym).filter<Sym>((e): e is Sym => e !== undefined),
//     }
//   },

//   toNodeBody(digest: NoteDigest): NodeBody<NoteDigest> {
//     const { noteId, fromNoteId, updatedAt } = digest
//     return {
//       cid: noteId, // since parent-cid is bind with note-id
//       data: digest,
//       parentCid: fromNoteId ?? TreeService.tempRootCid,
//       index: updatedAt.getTime(),
//     }
//   },
// }
