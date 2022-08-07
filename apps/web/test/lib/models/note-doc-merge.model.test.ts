import type { NoteDoc } from '@prisma/client'
import { cloneDeep } from 'lodash'
import { mockDiffBlocks } from '../../../frontend/components/editor-textarea/test/__mocks__/mock-diff-blocks'
import { NoteDocParsed } from '../../../lib/interfaces'
import { noteDocMergeModel } from '../../../lib/models/note-doc-merge.model'
import { noteDocModel } from '../../../lib/models/note-doc.model'
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { mockCommits } from '../../__mocks__/commit.mock'
import { mockLinks } from '../../__mocks__/link.mock'
import { mockNotes } from '../../__mocks__/note.mock'
import { mockNoteDocs } from '../../__mocks__/note-doc.mock'
import { mockMergePolls } from '../../__mocks__/poll.mock'
import { mockSyms } from '../../__mocks__/sym.mock'
import { mockUsers } from '../../__mocks__/user.mock'
import { mockMergePollVotes } from '../../__mocks__/poll-vote.mock'
import { createMockVotes } from './poll-merge.model.test'

/**
 * Warning! This method does not follow the correct procedures to create the note-docs
 *  and should only be used for testing merge functions. The correct way is through
 *  commit process and create all related data there.
 */
async function createMockNoteDocs(docs: NoteDocParsed<NoteDoc>[]) {
  await prisma.$transaction(mockLinks.map(e => prisma.link.create({ data: e })))
  await prisma.$transaction(mockSyms.map(e => prisma.sym.create({ data: e })))
  await prisma.$transaction(
    mockCommits.map(e => prisma.commit.create({ data: e })),
  )
  await prisma.$transaction(mockNotes.map(e => prisma.note.create({ data: e })))
  await Promise.all(
    mockMergePolls.map(e => testHelper.createMergePoll(prisma, e)),
  )

  const docs_ = await prisma.$transaction(
    docs.map(d => {
      return prisma.noteDoc.create({
        data: d,
        include: {
          sym: true,
          fromDoc: true,
          mergePoll: true,
        },
      })
    }),
  )

  return docs_
}

function c<T extends NoteDoc>(doc: T) {
  const {
    status,
    meta: { mergeState },
    mergePollId,
    fromDocId,
  } = noteDocModel.parse(doc)
  if (mergePollId) {
    return { status, mergeState, mergePollId: 'got-merge-poll-id', fromDocId }
  }
  return { status, mergeState }
}

beforeAll(async () => {
  // Reset database
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  // await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)
})

// afterAll(async () => {
//   // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
//   await prisma.$disconnect()
// })

beforeEach(async () => {
  // await prisma.$queryRaw`TRUNCATE "NoteDoc", "Poll" CASCADE;`
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
})

describe('_validateOnMerge()', () => {
  it('not throws for candidate-mock-note-doc', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    await expect(
      noteDocMergeModel._validateOnMerge(docs[0]),
    ).resolves.not.toThrow()
  })

  it('throws if doc is not candidate', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    await expect(
      noteDocMergeModel._validateOnMerge(docs[2]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"Doc.status not CANDIDATE"`)
  })

  /**
   * Simulate a doc is created with a merge poll, but another doc is merged so made this doc's from-doc is not the head.
   * When this doc is merging, expect
   * - Change merge poll's status to 'PAUSE'
   */
  it('throws if from-doc is not the head', async () => {
    const candidate: NoteDocParsed<NoteDoc> = {
        ...mockNoteDocs[2], // mockNoteDocs[2] is the head, so use it as the starter
        id: '99-candidate__has_from_doc',
        fromDocId: mockNoteDocs[0].id,
        mergePollId: mockMergePolls[1].id, // Give a merge-poll to test the poll status
        status: 'CANDIDATE',
        meta: {
          mergeState: 'before_merge',
        },
      },
      docs = await createMockNoteDocs([...mockNoteDocs, candidate]), // Need to create other docs so the candidate can 'connect'
      lastDoc = docs[docs.length - 1]

    try {
      await noteDocMergeModel._validateOnMerge(lastDoc)
    } catch (err) {
      const err_ = err as any
      expect(err_.flag).toMatchInlineSnapshot(`"paused-from_doc_not_head"`)
      expect(c(err_.updatedNoteDoc)).toMatchInlineSnapshot(`
        Object {
          "fromDocId": "0-candidate_initial_commit",
          "mergePollId": "got-merge-poll-id",
          "mergeState": "paused-from_doc_not_head",
          "status": "PAUSE",
        }
      `)
      expect(err_.updatedNoteDoc.mergePoll.status).toMatchInlineSnapshot(
        `"PAUSE"`,
      )
    }
  })
})

describe('_mergeAuto()', () => {
  const fromDoc = mockNoteDocs[2],
    baseCandidate: NoteDocParsed<NoteDoc> = {
      ...fromDoc,
      id: '99-candidate__has_from_doc',
      fromDocId: fromDoc.id,
      mergePollId: null,
      status: 'CANDIDATE',
      meta: { mergeState: 'before_merge' },
    }

  it('merges if no from-doc', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs),
      doc = docs[0]

    await expect(
      noteDocModel.getHeadDoc(doc.branchId, doc.symId),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[getHeadNoteDoc] Not found head-note-doc, unexpected error"`,
    )
    expect(c(await noteDocMergeModel._mergeAuto(doc))).toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-initial_commit",
        "status": "MERGED",
      }
    `)
    expect(
      (await noteDocModel.getHeadDoc(doc.branchId, doc.symId)).id,
    ).toMatchInlineSnapshot(`"0-candidate_initial_commit"`)
  })

  it('rejects if no changes', async () => {
    const docs = await createMockNoteDocs([...mockNoteDocs, baseCandidate]),
      last = docs[docs.length - 1]
    expect(c(await noteDocMergeModel._mergeAuto(last))).toMatchInlineSnapshot(`
      Object {
        "mergeState": "rejected_auto-no_changes",
        "status": "REJECTED",
      }
    `)
  })

  it('rejects if has other waiting-docs', async () => {
    // TODO
  })

  it('merges if only insertions', async () => {
    // TODO: Content head insertions?

    const cand = cloneDeep(baseCandidate)
    cand.contentBody = {
      ...cand.contentBody,
      blocks: mockDiffBlocks.insertsOnly,
    }
    cand.userId = mockUsers[1].id
    const docs = await createMockNoteDocs([...mockNoteDocs, cand]),
      last = docs[docs.length - 1]

    expect(c(await noteDocMergeModel._mergeAuto(last))).toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-only_insertions",
        "status": "MERGED",
      }
    `)
  })

  it('rejects if content got mix changes', async () => {
    const cdt = cloneDeep(baseCandidate)
    cdt.contentBody = {
      ...cdt.contentBody,
      blocks: mockDiffBlocks.mix,
    }
    cdt.userId = mockUsers[1].id
    const docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    await expect(
      noteDocMergeModel._mergeAuto(last),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`"fail_to_auto_merge"`)
  })

  it('rejects if conent-head got modified && not the same user', async () => {
    // TODO
  })

  it('merges by the same-user-policy when content-head got modified', async () => {
    // TODO
  })

  it('merges by the same-user-policy when content-body got modified', async () => {
    const cdt = cloneDeep(baseCandidate)
    cdt.contentBody = {
      ...cdt.contentBody,
      blocks: mockDiffBlocks.mix,
    }
    // cand.userId = mockUsers[1].id

    const docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    expect(c(await noteDocMergeModel._mergeAuto(last))).toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-same_user",
        "status": "MERGED",
      }
    `)
  })

  it('merges by the same-user-policy when content-head got modified, and the symbol name will update', async () => {
    const fromDoc = mockNoteDocs[3],
      cdt: NoteDocParsed<NoteDoc> = {
        ...fromDoc,
        id: '99-candidate__has_from_doc',
        fromDocId: fromDoc.id,
        mergePollId: null,
        status: 'CANDIDATE',
        meta: { mergeState: 'before_merge' },
        contentHead: {
          ...fromDoc.contentHead,
          symbol: '[[A modified symbol name]]',
        },
      }

    const docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    expect(c(await noteDocMergeModel._mergeAuto(last))).toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-same_user",
        "status": "MERGED",
      }
    `)
    expect(
      (await prisma.sym.findUnique({ where: { id: last.symId } }))?.symbol,
    ).toMatchInlineSnapshot(`"[[A modified symbol name]]"`)
  })
})

describe('_createMergePoll()', () => {
  it('throws if doc already has a merge poll', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    await expect(
      noteDocMergeModel._createMergePoll(docs[2]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Doc already has a merge poll"`,
    )
  })

  it('create a merge poll', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    expect(c(await noteDocMergeModel._createMergePoll(docs[0])))
      .toMatchInlineSnapshot(`
      Object {
        "fromDocId": null,
        "mergePollId": "got-merge-poll-id",
        "mergeState": "wait_to_merge-by_poll",
        "status": "CANDIDATE",
      }
    `)
  })
})

describe('_mergeByPoll()', () => {
  const fromDoc = mockNoteDocs[2],
    baseCandidate: NoteDocParsed<NoteDoc> = {
      ...fromDoc,
      id: '99-candidate__has_from_doc',
      fromDocId: fromDoc.id,
      mergePollId: mockMergePolls[1].id,
      status: 'CANDIDATE',
      meta: { mergeState: 'wait_to_merge-by_poll' },
    }

  it('merges if poll is accepted', async () => {
    const cdt = cloneDeep(baseCandidate),
      docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1],
      { mergePoll } = last

    if (mergePoll === null) throw new Error()

    expect(c(await noteDocMergeModel._mergeByPoll({ ...last, mergePoll })))
      .toMatchInlineSnapshot(`
      Object {
        "fromDocId": "2-merged_by_poll",
        "mergePollId": "got-merge-poll-id",
        "mergeState": "merged_poll",
        "status": "MERGED",
      }
    `)
  })

  it('rejectes if poll is rejected', async () => {
    const cdt = cloneDeep(baseCandidate),
      docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1],
      { mergePoll } = last

    if (mergePoll === null) throw new Error()

    await createMockVotes([
      ...mockMergePollVotes.accepts,
      ...mockMergePollVotes.rejects,
    ])

    expect(c(await noteDocMergeModel._mergeByPoll({ ...last, mergePoll })))
      .toMatchInlineSnapshot(`
      Object {
        "fromDocId": "2-merged_by_poll",
        "mergePollId": "got-merge-poll-id",
        "mergeState": "rejected_poll",
        "status": "REJECTED",
      }
    `)
  })
})

describe('mergeOnCreate()', () => {
  const fromDoc = mockNoteDocs[2],
    baseCandidate: NoteDocParsed<NoteDoc> = {
      ...fromDoc,
      id: '99-candidate__has_from_doc',
      fromDocId: fromDoc.id,
      mergePollId: mockMergePolls[1].id,
      status: 'CANDIDATE',
      meta: { mergeState: 'wait_to_merge-by_poll' },
    }

  it('auto merge for initial commit', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    expect(c(await noteDocMergeModel.mergeOnCreate(docs[0])))
      .toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-initial_commit",
        "status": "MERGED",
      }
    `)
  })

  it('creats a merge poll if auto merge failed', async () => {
    const cdt = cloneDeep(baseCandidate)
    cdt.contentBody = {
      ...cdt.contentBody,
      blocks: mockDiffBlocks.mix,
    }
    cdt.userId = mockUsers[1].id
    cdt.mergePollId = null
    const docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    expect(c(await noteDocMergeModel.mergeOnCreate(last)))
      .toMatchInlineSnapshot(`
      Object {
        "fromDocId": "2-merged_by_poll",
        "mergePollId": "got-merge-poll-id",
        "mergeState": "wait_to_merge-by_poll",
        "status": "CANDIDATE",
      }
    `)
  })
})

describe('mergeSchedule()', () => {
  const fromDoc = mockNoteDocs[2],
    base: NoteDocParsed<NoteDoc> = {
      ...fromDoc,
      id: '',
      fromDocId: fromDoc.id,
      status: 'CANDIDATE',
      meta: { mergeState: 'wait_to_merge-by_poll' },
    },
    candidates = [
      {
        ...base,
        id: '98-candidate__has_from_doc',
        mergePollId: mockMergePolls[1].id,
      },
      {
        ...base,
        id: '99-candidate__has_from_doc',
        mergePollId: mockMergePolls[2].id,
      },
    ]

  it('collect all polls // merge if the time is up and ups are more than downs', async () => {
    await createMockNoteDocs([...mockNoteDocs, ...candidates])
    await createMockVotes([
      ...mockMergePollVotes.accepts,
      ...mockMergePollVotes.rejects,
    ])

    const res = await noteDocMergeModel.mergeSchedule()

    expect(res.map(({ id, status }) => ({ id, status })))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "98-candidate__has_from_doc",
          "status": "REJECTED",
        },
        Object {
          "id": "99-candidate__has_from_doc",
          "status": "MERGED",
        },
      ]
    `)
  })
})
