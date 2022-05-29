import { Branch, Link, Note, Sym } from '@prisma/client'
import { Note as GQLNote } from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'
import { noteDocModel } from './note-doc-model'

class NoteModel {
  async _attachHeadDoc<
    T extends Note & { branch: Branch; sym: Sym; link: Link | null },
  >(note: T): Promise<GQLNote> {
    const doc = await noteDocModel.getHeadDoc(note.branchId, note.symId),
      note_: GQLNote = {
        ...note,
        branch: note.branch.name,
        noteDoc: {
          ...doc,
          branch: doc.branch.name,
        },
      }
    return note_
  }

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
      include: { branch: true, sym: true, link: true },
    })
    if (note) {
      return this._attachHeadDoc(note)
    }
    return null
  }

  async getById(id: string): Promise<GQLNote> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { branch: true, sym: true, link: true },
    })
    if (note) {
      return this._attachHeadDoc(note)
    }
    throw new Error('Note not found.')
  }
}

export const noteModel = new NoteModel()
