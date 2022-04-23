import {
  Note,
  NoteDraft,
  NoteDoc,
  Commit,
  Discuss,
  PrismaPromise,
} from '@prisma/client'
import cuid from 'cuid'
import { type } from 'os'
import prisma from '../prisma'
import { noteDocModel, SymbolIdDict } from './note-doc-model'
import { SymModel } from './sym-model'

export async function commitNoteDrafts(
  draftIds: string[],
  userId: string,
): Promise<{
  symbolToSymIdDicts: SymbolIdDict
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

    const symFromPrisma = await prisma.sym.findUnique({
      where: { symbol: draft.symbol },
    })
    const noteDocFromPrisma =
      symFromPrisma &&
      (await prisma.noteDoc.findFirst({
        where: {
          branchId: draft.branchId,
          symId: symFromPrisma.id,
          status: 'MERGE',
        },
        orderBy: { updatedAt: 'desc' },
      }))

    if (
      noteDocFromPrisma &&
      (!draft.fromDocId || draft.fromDocId !== noteDocFromPrisma.id)
    ) {
      throw new Error('FromDoc is not the latest doc of this note.')
    }

    drafts.push(draft)
  }

  const notes: (Note & {
    discusses: Discuss[]
  })[] = []
  const symbolToSymIdDicts: SymbolIdDict = {}
  const symbolToNoteIdDicts: Record<string, string> = {}
  const promises: PrismaPromise<any>[] = []
  const promises2: PrismaPromise<any>[] = []
  const commitId = cuid()

  for (const e of drafts) {
    // Get discussIds
    const blockId_discussIds: Record<string, string[]> | null =
      noteDocModel.getDiscussIdsFromDraft(e)
    const discussIds: string[] = []

    if (blockId_discussIds) {
      for (const blockId in blockId_discussIds) {
        const values = blockId_discussIds[blockId]
        discussIds.push(...values)
      }
    }

    // Get or create Sym and Note, and link DiscussId to Note
    const { type } = SymModel.parse(e.symbol)
    const symFromPrisma = await prisma.sym.findUnique({
      where: { symbol: e.symbol },
    })

    if (symFromPrisma) {
      symbolToSymIdDicts[e.symbol] = symFromPrisma.id
      const note = await prisma.note.findUnique({
        where: {
          branchId_symId: {
            branchId: e.branchId,
            symId: symFromPrisma.id,
          },
        },
      })
      symbolToNoteIdDicts[e.symbol] = note!.id
      promises.push(
        prisma.note.update({
          where: {
            branchId_symId: {
              branchId: e.branchId,
              symId: symFromPrisma.id,
            },
          },
          data: {
            discusses:
              discussIds.length > 0
                ? { connect: discussIds.map(e => ({ id: e })) }
                : undefined,
          },
          include: { discusses: true },
        }),
      )
    } else {
      const symId = cuid()
      const noteId = cuid()
      symbolToSymIdDicts[e.symbol] = symId
      symbolToNoteIdDicts[e.symbol] = noteId

      promises.push(
        prisma.sym.create({
          data: {
            id: symId,
            type,
            symbol: e.symbol,
            notes: {
              create: {
                id: noteId,
                branch: { connect: { id: e.branchId } },
                link: e.linkId ? { connect: { id: e.linkId } } : undefined,
                discusses:
                  discussIds.length > 0
                    ? { connect: discussIds.map(e => ({ id: e })) }
                    : undefined,
              },
            },
          },
        }),
      )
    }

    // Update status of all discusses to ACITVE

    if (discussIds.length > 0) {
      promises.push(
        prisma.discuss.updateMany({
          where: { notes: { every: { id: symbolToNoteIdDicts[e.symbol] } } },
          data: { status: 'ACTIVE' },
        }),
      )
    }
  }

  // For each draft, create one doc and link it to the note
  for (const e of drafts) {
    promises.push(
      prisma.noteDoc.create({
        data: {
          branch: { connect: { id: e.branchId } },
          sym: { connect: { id: symbolToSymIdDicts[e.symbol]! } },
          commit: { connect: { id: commitId } },
          fromDoc: e.fromDocId ? { connect: { id: e.fromDocId } } : undefined,
          user: { connect: { id: e.userId } },
          note: {
            connect: {
              branchId_symId: {
                branchId: e.branchId,
                symId: symbolToSymIdDicts[e.symbol]!,
              },
            },
          },
          domain: e.domain,
          meta: e.meta ?? undefined,
          content: e.content ?? {},
        },
      }),
    )
  }

  // Create Commit and get or create sym, note and noteDoc
  const [commit] = await prisma.$transaction([
    prisma.commit.create({
      data: { id: commitId, user: { connect: { id: userId } } },
    }),
    ...promises,
  ])

  const noteDocs = await prisma.noteDoc.findMany({
    where: { commitId: commit.id },
  })

  if (noteDocs.length === 0) {
    throw new Error('One or more drafts are not commited successfully.')
  }

  // For each draft, connect draft to commit and update its status to commit
  for (const id of draftIds) {
    promises2.push(
      prisma.noteDraft.update({
        where: { id: id },
        data: { commit: { connect: { id: commitId } }, status: 'COMMIT' },
      }),
    )
  }
  await prisma.$transaction(promises2)

  // Update symIdMap for each draft with connections to drafts in this commit
  for (const doc of noteDocs) {
    noteDocModel.updateSymbolIdDict(doc, symbolToSymIdDicts)
    const note = await prisma.note.findUnique({
      where: { branchId_symId: { branchId: doc.branchId, symId: doc.symId } },
      include: {
        discusses: true,
      },
    })
    // if (note === null) {
    //   throw new Error('One or more Notes do not exist.')
    // }
    notes.push(note!)
  }

  return { symbolToSymIdDicts, commit, notes, noteDocs }
}
