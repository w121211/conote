import { Branch, Link, Note, NoteDoc, Sym } from '@prisma/client'
import { NoteDocParsed } from '../interfaces'
import prisma from '../prisma'
import { noteDocModel } from './note-doc-model'

class NoteModel {
  /**
   * @returns [note, head-doc of note]
   */
  async getByBranchSymbol(
    branchName: string,
    symbol: string,
  ): Promise<
    | [
        Note & { branch: Branch; sym: Sym; link: Link | null },
        NoteDocParsed<NoteDoc & { branch: Branch; sym: Sym }>,
      ]
    | null
  > {
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
      const doc = await noteDocModel.getHeadDoc(note.branchId, note.symId)
      return [note, doc]
    }
    return null
  }

  /**
   * @returns [note, head-doc of note]
   */
  async getById(
    id: string,
  ): Promise<
    [
      Note & { branch: Branch; sym: Sym; link: Link | null },
      NoteDocParsed<NoteDoc & { branch: Branch; sym: Sym }>,
    ]
  > {
    const note = await prisma.note.findUnique({
      where: { id },
      include: { branch: true, sym: true, link: true },
    })
    if (note) {
      const doc = await noteDocModel.getHeadDoc(note.branchId, note.symId)
      return [note, doc]
    }
    throw new Error('Note not found.')
  }
}

export const noteModel = new NoteModel()
