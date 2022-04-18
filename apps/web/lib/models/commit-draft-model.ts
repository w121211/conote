import { Note, NoteDraft, NoteDoc, Commit, Discuss } from '@prisma/client'
import { type } from 'os'
import prisma from '../prisma'
import { noteDocModel, SymbolIdDict } from './note-doc-model'
import { SymModel } from './sym-model'

export async function commitNoteDrafts(
  draftIds: string[],
  userId: string,
): Promise<{
  symbolIdDict: SymbolIdDict
  commit: Commit
  notes: (Note & {
    discusses: Discuss[]
  })[]
  noteDocs: NoteDoc[]
}> {
  //   const { userId } = await isAuthenticated(req)
  const drafts: NoteDraft[] = []
  for (const id of draftIds) {
    const draft: NoteDraft | null = await prisma.noteDraft.findUnique({ where: { id } })
    if (draft) {
      drafts.push(draft)
    }
  }
  if (drafts.length !== draftIds.length) {
    throw new Error('Some draftId does not exist.')
  }
  // Create Commit
  const commit = await prisma.commit.create({
    data: { user: { connect: { id: userId } } },
  })

  // For each draft, check note, sym and doc (create one if there is none)
  // At the same time, link DiscussId to Note and change Discuss status to Active or Lock
  const notes: (Note & {
    discusses: Discuss[]
  })[] = []
  const noteDocs: NoteDoc[] = []
  const symbolIdDict: SymbolIdDict = {}
  for (const e of drafts) {
    const { type } = SymModel.parse(e.symbol)
    // TODO: extract discussId from the meta from the draft
    const discussIds: string[] = noteDocModel.getDiscussIdsFromDraft(e)
    // console.log(`discussIds return ${discussIds.length}`)

    const symFromPrisma = await prisma.sym.findUnique({ where: { symbol: e.symbol } })
    // TODO: update existing sym with this draft id
    const sym = symFromPrisma
      ? symFromPrisma
      : await prisma.sym.create({
          data: {
            type,
            symbol: e.symbol,
            // drafts: { connect: { id: e.id } },
          },
        })
    const noteDocFromPrisma =
      sym &&
      (await prisma.noteDoc.findFirst({
        where: { branchId: e.branchId, symId: sym.id, domain: e.domain },
        include: { note: true },
      }))

    const note = noteDocFromPrisma
      ? await prisma.note.update({
          where: { branchId_symId: { branchId: noteDocFromPrisma.branchId, symId: sym.id } },
          data: { discusses: discussIds.length ? { connect: discussIds.map(e => ({ id: e })) } : undefined },
          include: { discusses: true },
        })
      : await prisma.note.create({
          data: {
            branch: { connect: { id: e.branchId } },
            sym: { connect: { id: sym.id } },
            link: e.linkId ? { connect: { id: e.linkId } } : undefined,
            discusses: discussIds.length ? { connect: discussIds.map(e => ({ id: e })) } : undefined,
          },
          include: { discusses: true },
        })
    notes.push(note)
    // console.log(`discuss part ${note.discusses.length}`)
    const noteDoc = await prisma.noteDoc.create({
      data: {
        branch: { connect: { id: e.branchId } },
        sym: { connect: { id: sym.id } },
        commit: { connect: { id: commit.id } },
        fromDoc: e.fromDocId ? { connect: { id: e.fromDocId } } : undefined,
        user: { connect: { id: e.userId } },
        note: { connect: { id: note.id } },
        domain: e.domain,
        meta: e.meta ?? undefined,
        content: e.content ?? {},
      },
    })
    noteDocs.push(noteDoc)
    symbolIdDict[sym.symbol] = sym.id
    // Connect draft to commit
    await prisma.noteDraft.update({ where: { id: e.id }, data: { commit: { connect: { id: commit.id } } } })
    // Update status of all discusses
    await prisma.discuss.updateMany({ where: { notes: { every: { id: note.id } } }, data: { status: 'ACTIVE' } })
  }
  // Update symIdMap for each draft with connections to drafts in this commit
  // TODO
  for (const doc of noteDocs) {
    noteDocModel.updateSymbolIdDict(doc, symbolIdDict)
  }
  return { symbolIdDict, commit, notes, noteDocs }
}
