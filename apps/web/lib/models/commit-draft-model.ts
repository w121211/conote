import {
  Note,
  NoteDraft,
  NoteDoc,
  Commit,
  Discuss,
  PrismaPromise,
} from '@prisma/client'
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
  const drafts: NoteDraft[] = []
  for (const id of draftIds) {
    const draft: NoteDraft | null = await prisma.noteDraft.findUnique({
      where: { id },
    })

    if (draft === null) {
      throw new Error('Some draftId does not exist.')
    }
    drafts.push(draft)
  }

  //   // Create Commit after ensuring this commit able to be accomplished (creating before creating NoteDoc)
  //   const commit = await prisma.commit.create({
  //     data: { user: { connect: { id: userId } } },
  //   })

  // For each draft, check note, sym and doc (create one if there is none)
  // At the same time, link DiscussId to Note and change Discuss status to Active
  const notes: (Note & {
    discusses: Discuss[]
  })[] = []
  const noteDocs: NoteDoc[] = []
  const symbolIdDict: SymbolIdDict = {}
  //   const promises: PrismaPromise<any>[] = []

  for (const e of drafts) {
    const { type } = SymModel.parse(e.symbol)
    const discussIds: string[] = noteDocModel.getDiscussIdsFromDraft(e)

    const symFromPrisma = await prisma.sym.findUnique({
      where: { symbol: e.symbol },
    })

    const noteDocFromPrisma =
      symFromPrisma &&
      (await prisma.noteDoc.findFirst({
        where: {
          branchId: e.branchId,
          symId: symFromPrisma.id,
          status: 'MERGE',
        },
        orderBy: { updatedAt: 'desc' },
      }))
    if (
      noteDocFromPrisma &&
      (!e.fromDocId || e.fromDocId !== noteDocFromPrisma.id)
    ) {
      //   await prisma.commit.delete({ where: { id: commit.id } })
      throw new Error('FromDoc is not the latest doc of this note.')
    }

    // NOTE: draft will not be updated with new created symId or be connected
    // await prisma.$transaction(async (prisma) => {
    const sym = symFromPrisma
      ? symFromPrisma
      : await prisma.sym.create({
          data: {
            type,
            symbol: e.symbol,
            notes: {
              create: {
                branch: { connect: { id: e.branchId } },
                link: e.linkId ? { connect: { id: e.linkId } } : undefined,
                // discusses: discussIds.length
                //   ? { connect: discussIds.map(e => ({ id: e })) }
                //   : undefined,
              },
            },
          },
        })
    const note = await prisma.note.update({
      where: {
        branchId_symId: {
          branchId: e.branchId,
          symId: sym.id,
        },
      },
      data: {
        discusses: discussIds.length
          ? { connect: discussIds.map(e => ({ id: e })) }
          : undefined,
      },
      include: { discusses: true },
    })

    // const note = symFromPrisma
    //   ? await prisma.note.update({
    //       where: {
    //         branchId_symId: {
    //           branchId: e.branchId,
    //           symId: sym.id,
    //         },
    //       },
    //       data: {
    //         discusses: discussIds.length
    //           ? { connect: discussIds.map(e => ({ id: e })) }
    //           : undefined,
    //       },
    //       include: { discusses: true },
    //     })
    //   : await prisma.note.create({
    //       data: {
    //         branch: { connect: { id: e.branchId } },
    //         sym: { connect: { id: sym.id } },
    //         link: e.linkId ? { connect: { id: e.linkId } } : undefined,
    //         discusses: discussIds.length
    //           ? { connect: discussIds.map(e => ({ id: e })) }
    //           : undefined,
    //       },
    //       include: { discusses: true },
    //     })
    // })
    if (note) {
      notes.push(note)
      //   move this operation after finishing note, sym, and doc
      symbolIdDict[sym.symbol] = sym.id
    }
  }
  // const sym = symFromPrisma
  //   ? symFromPrisma
  //   : await prisma.sym.create({
  //       data: {
  //         type,
  //         symbol: e.symbol,
  //       },
  //     })

  // const note = symFromPrisma
  //   ? await prisma.note.update({
  //       where: {
  //         branchId_symId: {
  //           branchId: e.branchId,
  //           symId: sym.id,
  //         },
  //       },
  //       data: {
  //         discusses: discussIds.length
  //           ? { connect: discussIds.map(e => ({ id: e })) }
  //           : undefined,
  //       },
  //       include: { discusses: true },
  //     })
  //   : await prisma.note.create({
  //       data: {
  //         branch: { connect: { id: e.branchId } },
  //         sym: { connect: { id: sym.id } },
  //         link: e.linkId ? { connect: { id: e.linkId } } : undefined,
  //         discusses: discussIds.length
  //           ? { connect: discussIds.map(e => ({ id: e })) }
  //           : undefined,
  //       },
  //       include: { discusses: true },
  //     })
  // notes.push(note)
  // console.log(`discuss part ${note.discusses.length}`)

  // Create Commit after ensuring this commit able to be accomplished (creating before creating NoteDoc)
  if (notes.length !== draftIds.length) {
    throw new Error("Some notes and syms didn't created.")
  }
  const commit = await prisma.commit.create({
    data: { user: { connect: { id: userId } } },
  })
  for (const e of drafts) {
    const noteDoc = await prisma.noteDoc.create({
      data: {
        branch: { connect: { id: e.branchId } },
        sym: { connect: { id: symbolIdDict[e.symbol] } },
        commit: { connect: { id: commit.id } },
        fromDoc: e.fromDocId ? { connect: { id: e.fromDocId } } : undefined,
        user: { connect: { id: e.userId } },
        note: {
          connect: {
            branchId_symId: {
              branchId: e.branchId,
              symId: symbolIdDict[e.symbol],
            },
          },
        },
        domain: e.domain,
        meta: e.meta ?? undefined,
        content: e.content ?? {},
      },
    })
    noteDocs.push(noteDoc)
    // symbolIdDict[sym.symbol] = sym.id
  }

  // Update symIdMap for each draft with connections to drafts in this commit
  for (const doc of noteDocs) {
    noteDocModel.updateSymbolIdDict(doc, symbolIdDict)
  }

  // Update status of all discusses
  for (const note of notes) {
    await prisma.discuss.updateMany({
      where: { notes: { every: { id: note.id } } },
      data: { status: 'ACTIVE' },
    })
  }

  // Connect draft to commit and update its status to commit
  for (const id of draftIds) {
    await prisma.noteDraft.update({
      where: { id: id },
      data: { commit: { connect: { id: commit.id } }, status: 'COMMIT' },
    })
  }
  return { symbolIdDict, commit, notes, noteDocs }
}
