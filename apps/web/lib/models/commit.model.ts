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
import { CommitInputErrorCode } from '../../share/constants'
import { differenceContentBody, validateContentBlocks } from '../../share/utils'
import type { CommitInputErrorItem } from '../interfaces'
import prisma from '../prisma'
import { noteDocMergeModel } from './note-doc-merge.model'
import { noteDocModel } from './note-doc.model'
import { noteDraftModel } from './note-draft.model'
import { symModel } from './sym.model'

/**
 * Error cause by the user, not system
 * Use it to show error message to the user
 *
 */
export class CommitInputError extends Error {
  items: CommitInputErrorItem[]

  constructor(items: CommitInputErrorItem[]) {
    const msg = items
      .map(({ draftId, code }) => `${code}::#${draftId}`)
      .join(', ')
    super(msg)

    // Set the prototype explicitly. See https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, new.target.prototype)

    this.items = items
  }
}

/**
 * @throws
 * - [x] If user is not the owner of draft
 * - [x] If draftId cannot be found
 * - [x] If fromDoc is empty but there is a latest doc
 * - [x] If fromDoc does not match
 * - [] If the draft content is the same as from-doc
 * - [x] If discuss(es) not created
 * - [] If found orphan discusses
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
    { draftParsed, inlineDiscusses } = noteDraftModel.parseDeep(draft),
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

  const errCodes: CommitInputErrorCode[] = []

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
    throw new Error('User is not the owner of the draft')
  }
  if (draft.symId !== null && draft.symId !== sym?.id) {
    throw new Error("Draft's symbol does not match its sym-id")
  }
  if (draft.fromDocId) {
    if (headDoc === null)
      throw new Error('Draft has from-doc but current head-doc is null')
    if (headDoc.id !== draft.fromDocId)
      errCodes.push(CommitInputErrorCode.FROM_DOC_NOT_HEAD)
  }
  if (draft.fromDocId === null && headDoc !== null) {
    errCodes.push(CommitInputErrorCode.FROM_DOC_NOT_HEAD)
  }

  // const domainChanged = draft.domain === curDoc!.domain
  // const metaChanged = metaDiff(curDoc!.meta as unknown as NoteDocMeta, draftParsed.meta)
  // const contentChanged = getContentDiff(curDoc!.content as unknown as NoteDocContent, draftParsed.content)

  const { isContentEmpty } = validateContentBlocks(
      draftParsed.contentBody.blocks,
    ),
    diffBody =
      headDoc &&
      differenceContentBody(draftParsed.contentBody, headDoc.contentBody),
    inlineDiscussesNoId = inlineDiscusses.filter(e => e.id === undefined)

  if (isContentEmpty) errCodes.push(CommitInputErrorCode.CONTENT_EMPTY)
  if (diffBody !== null && diffBody.blockChanges.length === 0)
    errCodes.push(CommitInputErrorCode.CONTENT_NOT_CHANGE)
  if (inlineDiscussesNoId.length > 0) {
    console.debug(inlineDiscussesNoId)
    errCodes.push(CommitInputErrorCode.DISCUSS_NOT_CREATE)
  }

  if (errCodes.length > 0) {
    const items: CommitInputErrorItem[] = errCodes.map(code => ({
      draftId: draft.id,
      code,
    }))
    throw new CommitInputError(items)
  }
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
 * After commit, how to known the note-doc's corresponding note-draft?
 * - If draft has sym, use sym.id (both exist on draft and doc)
 * - If draft has symbol, use symbol to match doc.sym.symbol
 *
 * TODO:
 * - [] For each commit, input note-draft should have unique symbol/sym
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
  const inputs: Awaited<ReturnType<typeof validateInput>>[] = []

  let errItems: CommitInputErrorItem[] = []

  for (const id of draftIds) {
    const draft = await prisma.noteDraft.findUnique({ where: { id } })
    if (draft === null) {
      throw new Error('Draft not found by given id')
    }

    try {
      inputs.push(await validateInput(draft, userId))
    } catch (err) {
      if (err instanceof CommitInputError) {
        errItems = errItems.concat(err.items)
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
    if (discussesCreated_unfoundInBlocks.length > 0) {
      console.debug(
        'Discusses created but not found in blocks, delete',
        discussesCreated_unfoundInBlocks.map(e => e.id),
      )
    }

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
