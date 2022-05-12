import {
  Commit,
  Discuss,
  Note,
  NoteDoc,
  NoteDraft,
  PrismaPromise,
  Sym,
} from '@prisma/client'
import cuid from 'cuid'
import { isNumber } from 'lodash'
import { NoteDocContent, NoteDocMeta } from '../interfaces'
import prisma from '../prisma'
import { getContentDiff, metaDiff } from './change-model'
import { noteDocModel } from './note-doc-model'
import { noteDraftModel } from './note-draft-model'
import { symModel } from './sym-model'

/**
 *
 */
async function validateDraft(id: string, userId: string) {
  const draft = await prisma.noteDraft.findUnique({
      where: { id },
    }),
    sym =
      draft &&
      (await prisma.sym.findUnique({
        where: { symbol: draft.symbol },
      })),
    curDoc =
      sym &&
      // TODO: noteDocModel.getCurrentNoteDoc(branchId, symId)
      (await prisma.noteDoc.findFirst({
        where: {
          branchId: draft.branchId,
          symId: sym.id,
          status: 'MERGE',
        },
        orderBy: { updatedAt: 'desc' },
      })),
    note =
      draft &&
      sym &&
      (await prisma.note.findUnique({
        where: {
          branchId_symId: {
            branchId: draft.branchId,
            symId: sym.id,
          },
        },
      })),
    draftParsed = draft && noteDraftModel.parse(draft),
    newJoinedDiscussIds =
      draftParsed &&
      draftParsed.content.discussIds.filter(e => e.commitId === undefined),
    newJoinedDiscusses =
      newJoinedDiscussIds &&
      (await prisma.$transaction(
        newJoinedDiscussIds.map(e =>
          prisma.discuss.findUnique({
            where: { id: e.discussId },
          }),
        ),
      ))

  // console.log(`existing discuss ${existingDiscusses?.length}`)

  if (draft === null) {
    throw new Error('Some draftId does not exist.')
  }
  if (draftParsed === null) {
    throw new Error('Some draftId does not exist.')
  }
  if (draft.fromDocId && (curDoc === null || draft.fromDocId !== curDoc.id)) {
    throw new Error('FromDoc is not the latest doc of this note.')
  }
  if (draft.fromDocId === null && curDoc !== null) {
    throw new Error('FromDoc is not the latest doc of this note.')
  }
  if (sym && note === null) {
    throw new Error('Unexpected error: found sym but not found note')
  }
  if (draft.userId !== userId) {
    throw new Error('User is not the owner of the draft')
  }
  // TODO: check if the draft is the same as curDoc
  // if(draft.fromDocId) {
  //   const domainChanged = draft.domain === curDoc!.domain
  //   const metaChanged = metaDiff(curDoc!.meta as unknown as NoteDocMeta, draftParsed.meta)
  //   const contentChanged = getContentDiff(curDoc!.content as unknown as NoteDocContent, draftParsed.content)
  //   if (!domainChanged && !metaChange && !contentChange)
  // }

  return {
    draft,
    draftParsed,
    fromDoc: curDoc,
    sym,
    note,
    newJoinedDiscusses,
  }
}

/**
 *
 */
export async function commitNoteDrafts(
  draftIds: string[],
  userId: string,
): Promise<{
  symbol_symId: Record<string, string>
  commit: Commit
  notes: (Note & {
    discusses: Discuss[]
    sym: Sym
  })[]
  noteDocs: NoteDoc[]
}> {
  const drafts: NoteDraft[] = [],
    symbol_symId: Record<string, string> = {},
    symbol_noteId: Record<string, string> = {},
    promises: PrismaPromise<any>[] = [],
    commitId = cuid()

  // Loop first run
  for (const id of draftIds) {
    const { draft, draftParsed, fromDoc, sym, note, newJoinedDiscusses } =
        await validateDraft(id, userId),
      { branchId, linkId, symbol } = draft,
      symId = sym ? sym.id : cuid(),
      noteId = note ? note.id : cuid()

    drafts.push(draft)
    symbol_symId[symbol] = symId
    symbol_noteId[symbol] = noteId

    // Create Sym and Note if not found
    if (sym === null) {
      const { type } = symModel.parse(symbol)
      promises.push(
        prisma.sym.create({
          data: {
            id: symId,
            type,
            symbol,
            notes: {
              create: {
                id: noteId,
                branch: { connect: { id: branchId } },
                link: linkId ? { connect: { id: linkId } } : undefined,
              },
            },
          },
        }),
      )
    }

    // Connect each new-joined-discuss && whose status is "DRAFT" to Note
    // and update its status to "ACITVE"
    if (newJoinedDiscusses) {
      newJoinedDiscusses.forEach(e => {
        if (e?.status === 'DRAFT') {
          promises.push(
            prisma.discuss.update({
              data: {
                notes: { connect: { branchId_symId: { branchId, symId } } },
                status: 'ACTIVE',
              },
              where: { id: e.id },
            }),
          )
        } else {
          promises.push(
            prisma.discuss.update({
              data: {
                notes: { connect: { branchId_symId: { branchId, symId } } },
              },
              where: { id: e?.id },
            }),
          )
        }
      })
    }
  }

  // Loop second run: for each draft, create doc and connect to the note
  for (const e of drafts) {
    const draftParsed = noteDraftModel.parse(e),
      symId = symbol_symId[e.symbol]

    if (symId === null) throw new Error('Unexpected error: symId === null')

    promises.push(
      // Also update symbol_symId in this function
      noteDocModel.createDoc(
        draftParsed,
        commitId,
        symId,
        userId,
        symbol_symId,
      ),
    )

    // For each draft, connect draft to commit and update its status to commit
    promises.push(
      prisma.noteDraft.update({
        where: { id: e.id },
        data: { commit: { connect: { id: commitId } }, status: 'COMMIT' },
      }),
    )
  }

  // Create Commit and get or create Sym, Note and NoteDoc
  const [commit] = await prisma.$transaction([
    prisma.commit.create({
      data: { id: commitId, user: { connect: { id: userId } } },
    }),
    ...promises,
  ])

  const noteDocs = await prisma.noteDoc.findMany({
    where: { commitId: commit.id },
  })

  const notes = (
    await prisma.$transaction(
      drafts.map(e =>
        prisma.note.findUnique({
          where: {
            branchId_symId: {
              branchId: e.branchId,
              symId: symbol_symId[e.symbol],
            },
          },
          include: {
            discusses: true,
            sym: true,
          },
        }),
      ),
    )
  ).filter(
    (
      e,
    ): e is Note & {
      discusses: Discuss[]
      sym: Sym
    } => e !== null,
  )

  return { symbol_symId, commit, notes, noteDocs }
}
