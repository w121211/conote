import type {
  Branch,
  Commit,
  Discuss,
  Note,
  NoteDoc,
  NoteDraft,
  PrismaPromise,
  Sym,
} from '@prisma/client'
import cuid from 'cuid'
import { differenceWith, intersectionWith } from 'lodash'
import {
  differenceContentBody,
  validateContentBlocks,
} from '../../share/common'
import type { CommitInputErrorItem } from '../interfaces'
import prisma from '../prisma'
import { noteDocMergeModel } from './note-doc-merge-model'
import { noteDocModel } from './note-doc-model'
import { noteDraftModel } from './note-draft-model'
import { symModel } from './sym-model'

class InputError extends Error {
  constructor(msg: string) {
    super(msg)
    // this.name = 'MergeError'

    // Set the prototype explicitly.
    // See https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-2.html#example
    // Object.setPrototypeOf(this, InputError.prototype)
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export class CommitInputError extends Error {
  items: CommitInputErrorItem[]

  constructor(items: CommitInputErrorItem[]) {
    const msg = items.map(e => `(${e.draftId}) ${e.msg}`).join(', ')

    super(msg)
    Object.setPrototypeOf(this, new.target.prototype)
    this.items = items
  }
}

/**
 *
 */
async function validateInput(draft: NoteDraft, userId: string) {
  const sym = await prisma.sym.findUnique({
      where: { symbol: draft.symbol },
    }),
    headDoc = sym && (await noteDocModel.getHeadDoc(draft.branchId, sym.id)),
    note =
      headDoc &&
      (await prisma.note.findUnique({
        where: {
          branchId_symId: { branchId: headDoc.branchId, symId: headDoc.symId },
        },
      })),
    draftParsed = noteDraftModel.parseReal(draft),
    discussesCreated = await prisma.discuss.findMany({
      where: { draftId: draft.id },
    }),
    discussesCreated_foundInBlocks = intersectionWith(
      discussesCreated,
      draftParsed.contentBody.discussIds,
      (a, b) => a.id === b.discussId,
    ),
    discussesCreated_unfoundInBlocks = differenceWith(
      discussesCreated,
      discussesCreated_foundInBlocks,
      (a, b) => a.id === b.id,
    )

  // discussesCreated.filter(
  //   e => !discussIdsInBlocks.includes(e.id),
  // )

  // discussesInConcentBlocks =

  // newJoinedDiscussIds = draftParsed.contentBody.discussIds.filter(
  //   e => e.commitId === undefined,
  // ),
  // newJoinedDiscusses =
  //   newJoinedDiscussIds &&
  //   (await prisma.$transaction(
  //     newJoinedDiscussIds.map(e =>
  //       prisma.discuss.findUnique({
  //         where: { id: e.discussId },
  //       }),
  //     ),
  //   ))

  // console.log(`existing discuss ${existingDiscusses?.length}`)
  if (sym && headDoc === null) {
    throw new Error('Unexpected error: found sym but not found headDoc')
  }
  if (sym && note === null) {
    throw new Error('Unexpected error: found sym but not found note')
  }
  if (note && headDoc === null) {
    throw new Error('Unexpected error: found note but not found head-doc')
  }

  if (draft.userId !== userId) {
    throw new InputError('User is not the owner of the draft')
  }
  if (draft.symId !== null && draft.symId !== sym?.id) {
    throw new InputError("Draft's symbol does not match its sym-id")
  }
  if (draft.fromDocId) {
    if (headDoc === null)
      throw new InputError("Draft's from-doc does not match current head-doc")
    if (headDoc && headDoc.id !== draft.fromDocId)
      throw new InputError("Draft's from-doc does not match current head-doc")
  }
  if (draft.fromDocId === null && headDoc !== null) {
    throw new InputError(
      'Draft does not have a from-doc, but a head-doc is exist',
    )
  }
  if (draft.fromDocId !== null && headDoc) {
    // const domainChanged = draft.domain === curDoc!.domain
    // const metaChanged = metaDiff(curDoc!.meta as unknown as NoteDocMeta, draftParsed.meta)
    // const contentChanged = getContentDiff(curDoc!.content as unknown as NoteDocContent, draftParsed.content)

    const diffBody = differenceContentBody(
      draftParsed.contentBody,
      headDoc.contentBody,
    )
    if (diffBody.blockChanges.length === 0)
      throw new InputError("Draft's content-body do not change from from-doc")
  }

  const { isContentEmpty } = validateContentBlocks(
    draftParsed.contentBody.blocks,
  )

  if (isContentEmpty) throw new InputError("Draft's content is empty")

  return {
    draft,
    draftParsed,
    fromDoc: headDoc,
    sym,
    note,
    // newJoinedDiscusses,
    discussesCreated_foundInBlocks,
    discussesCreated_unfoundInBlocks,
  }
}

/**
 *
 * After commit, how to known the note-doc's corresponding note-draft?
 * - If draft has sym, use sym.id (both exist on draft and doc)
 * - If draft has symbol, use symbol to match doc.sym.symbol
 *
 * TODO:
 * - [ ] For each commit, input note-draft should have unique symbol/sym
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
  noteDocs: (NoteDoc & {
    sym: Sym
    branch: Branch
  })[]
  newSyms: Sym[]
}> {
  const symbol_symId: Record<string, string> = {},
    symbol_noteId: Record<string, string> = {},
    promises: PrismaPromise<any>[] = [],
    commitId = cuid(),
    newSymbolIds: string[] = []

  // Validate drafts before commit
  const inputs: Awaited<ReturnType<typeof validateInput>>[] = [],
    errItems: CommitInputError['items'] = []

  for (const id of draftIds) {
    const draft = await prisma.noteDraft.findUnique({ where: { id } })
    if (draft === null) {
      throw new Error('Draft not found by given id')
    }

    try {
      inputs.push(await validateInput(draft, userId))
    } catch (err) {
      if (err instanceof InputError) {
        errItems.push({ draftId: id, msg: err.message })
      } else {
        throw err
      }
    }
  }

  if (errItems.length > 0) {
    // console.debug(rejects)
    throw new CommitInputError(errItems)
  }

  // Loop first run: create syms, connect discusses
  inputs.forEach(e => {
    const {
        draft,
        // draftParsed,
        // fromDoc,
        sym,
        note,
        discussesCreated_foundInBlocks,
        discussesCreated_unfoundInBlocks,
      } = e,
      { branchId, linkId, symbol } = draft,
      symId = sym ? sym.id : cuid(),
      noteId = note ? note.id : cuid()

    // drafts.push(draft)
    symbol_symId[symbol] = symId
    symbol_noteId[symbol] = noteId

    // Create Sym and Note if not found
    if (sym === null) {
      const { type } = symModel.parse(symbol)

      newSymbolIds.push(symId)
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

    // Delete discusses that are not found in the blocks.
    // These are discusses created by the draft but get removed from blocks.
    discussesCreated_unfoundInBlocks.forEach(e => {
      promises.push(
        prisma.discuss.delete({
          where: { id: e.id },
        }),
      )
    })

    // Connect discusses to the note and update their status to "ACITVE" if possible
    discussesCreated_foundInBlocks.forEach(e => {
      if (e.status === 'DRAFT') {
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
            where: { id: e.id },
          }),
        )
      }
    })
  })

  // Loop second run: for each draft, create doc and connect to the note
  inputs.forEach(e => {
    const { draft, draftParsed } = e,
      symId = symbol_symId[draft.symbol]

    if (symId === null) throw new Error('Unexpected error: symId === null')

    promises.push(
      noteDocModel.create(draftParsed, commitId, symId, userId, symbol_symId),
    )

    // For each draft, connect draft to commit and update its status to commit
    promises.push(
      prisma.noteDraft.update({
        where: { id: draft.id },
        data: { commit: { connect: { id: commitId } }, status: 'COMMIT' },
      }),
    )
  })

  // Create Commit and get or create Sym, Note and NoteDoc
  const [commit] = await prisma.$transaction([
    prisma.commit.create({
      data: { id: commitId, user: { connect: { id: userId } } },
    }),
    ...promises,
  ])

  const noteDocs = await prisma.noteDoc.findMany({
    where: { commitId: commit.id },
    include: {
      sym: true,
      branch: true,
      fromDoc: true,
      mergePoll: true,
    },
  })

  const notes = (
    await prisma.$transaction(
      inputs.map(({ draft }) =>
        prisma.note.findUnique({
          where: {
            branchId_symId: {
              branchId: draft.branchId,
              symId: symbol_symId[draft.symbol],
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

  const newSyms = (
    await prisma.$transaction(
      newSymbolIds.map(e =>
        prisma.sym.findUnique({
          where: { id: e },
        }),
      ),
    )
  ).filter((e): e is Sym => e !== null)

  // For each note-doc, try auto merge or create a merge-poll
  const noteDocs_ = await Promise.all(
    noteDocs.map(e => noteDocMergeModel.mergeOnCreate(e)),
  )

  return { symbol_symId, commit, notes, noteDocs: noteDocs_, newSyms }
}
