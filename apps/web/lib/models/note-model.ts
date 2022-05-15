import { Note as GQLNote } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { noteDocModel } from './note-doc-model'

class NoteModel {
  async getByBranchSymbol(
    branchName: string,
    symbol: string,
  ): Promise<GQLNote | null> {
    const branch = await prisma.branch.findUnique({
        where: { name: branchName },
      }),
      sym = await prisma.sym.findUnique({ where: { symbol } })

    if (branch === null || sym === null) return null

    const note = await prisma.note.findUnique({
      where: { branchId_symId: { branchId: branch.id, symId: sym.id } },
      include: { sym: true, link: true },
    })
    if (note) {
      const doc = await noteDocModel.getLatestMergedNoteDoc(note)
      return {
        ...note,
        branch: branch.name,
        noteDoc: doc,
      }
    }
    return null
  }

  async getById(id: string): Promise<GQLNote> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { sym: true, link: true, branch: true },
    })
    if (note) {
      const doc = await noteDocModel.getLatestMergedNoteDoc(note)
      return {
        ...note,
        branch: note.branch.name,
        noteDoc: doc,
      }
    }
    throw new Error('Note not found.')
  }
}

export const noteModel = new NoteModel()
