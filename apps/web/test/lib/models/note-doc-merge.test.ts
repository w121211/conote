import { NoteDoc } from '@prisma/client'
import { cloneDeep } from 'lodash'
import { mockDiffBlocks } from '../../../components/block-editor/test/__mocks__/mock-diff-blocks'
import { NoteDocParsed } from '../../../lib/interfaces'
import { noteDocMergeModel } from '../../../lib/models/note-doc-merge-model'
import { noteDocModel } from '../../../lib/models/note-doc-model'
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { mockCommits } from '../../__mocks__/mock-commit'
import { mockLinks } from '../../__mocks__/mock-link'
import { mockNotes } from '../../__mocks__/mock-note'
import { mockNoteDocs } from '../../__mocks__/mock-note-doc'
import { mockMergePolls } from '../../__mocks__/mock-poll'
import { mockSyms } from '../../__mocks__/mock-sym'
import { mockUsers } from '../../__mocks__/mock-user'
import { mockMergePollVotes } from '../../__mocks__/mock-vote'
import { createMockMergePolls, createMockVotes } from './poll-merge.test'

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
  await createMockMergePolls()
  await prisma.$transaction(mockNotes.map(e => prisma.note.create({ data: e })))

  const docs_ = await prisma.$transaction(
    docs.map(e => {
      return prisma.noteDoc.create({
        data: e,
        include: {
          fromDoc: true,
          mergePoll: true,
          note: true,
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
  } = noteDocModel.parse(doc)
  if (mergePollId) {
    return { status, mergeState, mergePollId: 'got-merge-poll-id' }
  }
  return { status, mergeState }
}

beforeAll(async () => {
  // Reset database
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)
})

afterAll(async () => {
  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE "NoteDoc" CASCADE;`
})

describe('_validateOnMerge()', () => {
  it('not throws for candidate-mock-note-doc', async () => {
    const docs = await createMockNoteDocs([...mockNoteDocs])
    await expect(
      noteDocMergeModel._validateOnMerge(docs[0]),
    ).resolves.not.toThrow()
  })

  it('throws if doc is not candidate', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    await expect(
      noteDocMergeModel._validateOnMerge(docs[2]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[_validateOnMerge] Doc.status not CANDIDATE"`,
    )
  })

  it('throws if from-doc is not the head', async () => {
    const cdt: NoteDocParsed<NoteDoc> = {
        // mockNoteDocs[2] is the head, so use it as the starter
        ...mockNoteDocs[2],
        id: '99-candidate__has_from_doc',
        fromDocId: mockNoteDocs[0].id,
        // Give a merge-poll to test the poll status
        mergePollId: mockMergePolls[1].id,
        status: 'CANDIDATE',
        meta: {
          mergeState: 'before_merge',
        },
      },
      docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    try {
      await noteDocMergeModel._validateOnMerge(last)
    } catch (err) {
      const err_ = err as any
      expect(err_.flag).toMatchInlineSnapshot(`"paused-from_doc_not_head"`)
      expect(c(err_.updatedNoteDoc)).toMatchInlineSnapshot(`
        Object {
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

/**
 * Cases:
 * - [] auto merge
 * - [] merge/reject by poll
 * -
 */

describe('_mergeAuto()', () => {
  /**
   * Base test variables
   */
  const fromDoc = mockNoteDocs[2],
    baseCandidate: NoteDocParsed<NoteDoc> = {
      ...fromDoc,
      id: '99-candidate__has_from_doc',
      fromDocId: fromDoc.id,
      mergePollId: null,
      status: 'CANDIDATE',
      meta: {
        mergeState: 'before_merge',
      },
    }

  it('merges if no from-doc', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    expect(c(await noteDocMergeModel._mergeAuto(docs[0])))
      .toMatchInlineSnapshot(`
      Object {
        "mergeState": "merged_auto-initial_commit",
        "status": "MERGED",
      }
    `)
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

  it('merges if no other waiting-docs && only insertions', async () => {
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

  it('fails if no other waiting-docs && mix changes', async () => {
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

  it('merges if no other waiting-docs && mix changes && from same user', async () => {
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
})

describe('_createMergePoll()', () => {
  it('throws if doc already has a merge poll', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    await expect(
      noteDocMergeModel._createMergePoll(docs[2]),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"[_createMergePoll] Doc already has a merge poll"`,
    )
  })

  it('create a merge poll', async () => {
    const docs = await createMockNoteDocs(mockNoteDocs)
    expect(c(await noteDocMergeModel._createMergePoll(docs[0])))
      .toMatchInlineSnapshot(`
      Object {
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
      meta: {
        mergeState: 'wait_to_merge-by_poll',
      },
    }

  it('merges if poll is accepted', async () => {
    const cdt = cloneDeep(baseCandidate),
      docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]

    expect(c(await noteDocMergeModel._mergeByPoll(last)))
      .toMatchInlineSnapshot(`
      Object {
        "mergePollId": "got-merge-poll-id",
        "mergeState": "merged_poll",
        "status": "MERGED",
      }
    `)
  })

  it('rejectes if poll is rejected', async () => {
    const cdt = cloneDeep(baseCandidate),
      docs = await createMockNoteDocs([...mockNoteDocs, cdt]),
      last = docs[docs.length - 1]
    await createMockVotes([
      ...mockMergePollVotes.accepts,
      ...mockMergePollVotes.rejects,
    ])

    expect(c(await noteDocMergeModel._mergeByPoll(last)))
      .toMatchInlineSnapshot(`
      Object {
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
      meta: {
        mergeState: 'wait_to_merge-by_poll',
      },
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
        "mergePollId": "got-merge-poll-id",
        "mergeState": "wait_to_merge-by_poll",
        "status": "CANDIDATE",
      }
    `)
  })
})

// describe('mergePeriodical()', () => {
//   it('merge if the time is up and ups are more than downs', async () => {
//     await testHelper.createCandidateCommit(prisma)
//     // set the time and Poll to be able to merge successfully
//     const poll = await prisma.poll.findUnique({
//       where: { id: mockNoteDocs[0].mergePollId },
//       include: { count: true },
//     })
//     await prisma.pollCount.update({
//       data: { nVotes: [5, 3] },
//       where: { id: poll?.count?.id },
//     })
//     const docMerged = await mergePeriodical(mockNoteDocs[0])
//     expect(docMerged.status).toMatchInlineSnapshot(`"MERGE"`)
//   })

//   it('reject if the time is up and downs are more than ups', async () => {
//     await testHelper.createCandidateCommit(prisma)
//     // set the time and Poll to be able to reject
//     const poll = await prisma.poll.findUnique({
//       where: { id: mockNoteDocs[0].mergePollId },
//       include: { count: true },
//     })
//     await prisma.pollCount.update({
//       data: { nVotes: [1, 9] },
//       where: { id: poll?.count?.id },
//     })
//     const docMerged = await mergePeriodical(mockNoteDocs[0])
//     expect(docMerged.status).toMatchInlineSnapshot(`"REJECT"`)
//   })
// })

// describe('NoteDocMetaModel', () => {
//   it('NoteDocMetaModel.fromJSON()', async () => {
//     const meta = {
//       duplicatedSymbols: ['$BA'],
//       keywords: ['Boeing'],
//       redirectFroms: ['Boeing'],
//       redirectTo: '$BA',
//       webpage: {
//         authors: ['test-user-0'],
//         title: 'testing',
//         publishedAt: new Date('2011-10-05T14:48:00.000Z'),
//         tickers: ['tickers'], // tickers mentioned in the webpage content
//       },
//     }
//     testHelper.createNoteDrafts(prisma, [{ ...mockNoteDrafts[0], meta: meta }])
//     const draft = await prisma.noteDraft.findUnique({
//       where: { id: mockNoteDrafts[0].id },
//     })

//     const result = NoteDocMetaModel.fromJSON(draft?.meta)
//     expect(result.duplicatedSymbols).toMatchInlineSnapshot(`undefined`)
//   })
// })
