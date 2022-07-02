/* eslint-disable no-await-in-loop */
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import {
  CommitInputError,
  commitNoteDrafts,
} from '../../../lib/models/commit-model'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'
import { mockUsers } from '../../__mocks__/mock-user'
// import { mockNoteDocs } from '../../__mocks__/mock-note-doc'

beforeAll(async () => {
  // Writing required data into database
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createBranches(prisma)
  await testHelper.createUsers(prisma)

  // console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Commit", "Discuss", "Note", "NoteDoc", "NoteDraft", "Link", "Sym", "Poll" CASCADE;`
})

afterAll(async () => {
  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

/**
 * Validations
 *
 * Cases which throws
 * - [x] user is not the owner of draft
 * - [x] draftId cannot be found
 * - [x] fromDoc is empty but there is a latest doc
 * - [x] fromDoc does not match
 * - [] the draft content is the same as from-doc
 *
 */

// it('throws if user is not the owner of draft', async () => {
//   await testHelper.createNoteDrafts(prisma, [
//     mockNoteDrafts[0],
//     mockNoteDrafts[1],
//   ])
//   expect.assertions(1)
//   return commitNoteDrafts(
//     [mockNoteDrafts[0].id, mockNoteDrafts[1].id],
//     mockUsers[0].id,
//   ).catch(err => {
//     expect((err as unknown as CommitInputError).rejects).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "draftId": "1-got_discusses",
//           "msg": "User is not the owner of the draft",
//         },
//       ]
//     `)
//   })
// })

// it('throws if draftId cannot be found', async () => {
//   await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
//   expect.assertions(1)
//   await expect(
//     commitNoteDrafts(
//       [mockNoteDrafts[0].id, 'a-not-found-draft-id'],
//       mockUsers[0].id,
//     ),
//   ).rejects.toThrowErrorMatchingInlineSnapshot(`"Draft not found by given id"`)
// })

// it('throws if from-doc is empty but there is a latest doc ', async () => {
//   await testHelper.createMergeCommit(prisma)
//   expect.assertions(1)
//   return commitNoteDrafts([mockNoteDrafts[0].id], mockUsers[0].id).catch(
//     err => {
//       expect((err as unknown as CommitInputError).rejects)
//         .toMatchInlineSnapshot(`
//         Array [
//           Object {
//             "draftId": "0-from_empty",
//             "msg": "Draft does not have a from-doc, but a head-doc is exist",
//           },
//         ]
//       `)
//     },
//   )
// })

// it('throws if the draft content is the same as from-doc', async () => {
//   const { noteDoc } = await testHelper.createMergeCommit(prisma),
//     draft = {
//       ...mockNoteDrafts[0],
//       id: 'draft-no-change',
//       fromDocId: noteDoc.id,
//     }

//   await testHelper.createNoteDrafts(prisma, [draft])
//   expect.assertions(1)
//   return commitNoteDrafts([draft.id], mockUsers[0].id).catch(err => {
//     expect((err as unknown as CommitInputError).rejects).toMatchInlineSnapshot(`
//       Array [
//         Object {
//           "draftId": "draft-no-change",
//           "msg": "Draft's content-body do not change from from-doc",
//         },
//       ]
//     `)
//   })
// })

// /**
//  * Executions
//  *
//  * Cases:
//  * - [x] (1) from-doc is null, create sym, note
//  * - [x] (2) from-doc is not null
//  * - [x] mix of (1) and (2) (commit drafts with null and not null for from-doc)
//  * - [x] got discuss ids, should only set this-draft-created-discusses to "ACTIVE"
//  * - [ ] commit a web-note (ie, got link-id) if from-doc is null => not equals to case (1),
//  *       need one extra step: connect sym & link
//  * - [x] commit a web-note if from-doc is not null => equals to case (2)
//  *
//  */

// it('create sym, note if from-doc not exist', async () => {
//   await testHelper.createNoteDrafts(prisma, [
//     mockNoteDrafts[0],
//     {
//       ...mockNoteDrafts[1],
//       userId: mockUsers[0].id,
//     },
//   ])
//   await testHelper.createDiscusses(prisma, mockNoteDrafts[1].id)

//   const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
//     [mockNoteDrafts[0].id, mockNoteDrafts[1].id],
//     mockUsers[0].id,
//   )
//   expect(Object.keys(symbol_symId)).toMatchInlineSnapshot(`
//       Array [
//         "[[Apple]]",
//         "[[Google]]",
//       ]
//     `)
//   expect(notes.map(e => e.sym.symbol)).toMatchInlineSnapshot(`
//       Array [
//         "[[Apple]]",
//         "[[Google]]",
//       ]
//     `)
//   expect(
//     noteDocs.map(({ status, meta }) => ({
//       status,
//       mergeState: (meta as any).mergeState,
//     })),
//   ).toMatchInlineSnapshot(`
//     Array [
//       Object {
//         "mergeState": "merged_auto-initial_commit",
//         "status": "MERGED",
//       },
//       Object {
//         "mergeState": "merged_auto-initial_commit",
//         "status": "MERGED",
//       },
//     ]
//   `)
//   const updatedDrafts = await prisma.noteDraft.findMany({
//     where: { commit: { id: commit.id } },
//   })
//   expect(updatedDrafts.map(e => [e.symbol, e.status])).toMatchInlineSnapshot(`
//       Array [
//         Array [
//           "[[Google]]",
//           "COMMIT",
//         ],
//         Array [
//           "[[Apple]]",
//           "COMMIT",
//         ],
//       ]
//     `)
//   const noteDocHistory = await prisma.noteDoc.findMany({
//     where: { note: { id: notes[0].id } },
//     take: 3,
//   })
//   expect(noteDocHistory.map(e => e.domain)).toMatchInlineSnapshot(`
//       Array [
//         "domain0",
//       ]
//     `)
// })

it('create noteDoc if from-doc exists', async () => {
  // Start with a draft without from-doc and simulate the first-commit to get the note-doc as from-doc.
  //  This way removes the hassle of caring the commit process
  //  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
  const { noteDoc } = await testHelper.createMergeCommit(prisma)
  await testHelper.createNoteDrafts(prisma, [
    {
      ...mockNoteDrafts[0],
      id: 'local_id',
      // symbol: sym.symbol,
      userId: mockUsers[1].id,
      fromDocId: noteDoc.id,
      contentBody: {
        ...mockNoteDrafts[0].contentBody,
        blocks: mockNoteDrafts[0].contentBody.blocks.slice(0, -1),
      },
    },
  ])

  expect(
    await prisma.noteDraft.findUnique({
      where: { id: 'local_id' },
      select: { fromDocId: true },
    }),
  ).toMatchInlineSnapshot(`
    Object {
      "fromDocId": "0-candidate_initial_commit",
    }
  `)

  const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
    ['local_id'],
    mockUsers[1].id,
  )
  expect(Object.keys(symbol_symId)).toMatchInlineSnapshot(`
      Array [
        "[[Apple]]",
      ]
    `)
  expect(notes.map(e => e.sym.symbol)).toMatchInlineSnapshot(`
      Array [
        "[[Apple]]",
      ]
    `)
  expect(
    noteDocs.map(({ status, meta }) => ({
      status,
      mergeState: (meta as any).mergeState,
    })),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "mergeState": "wait_to_merge-by_poll",
        "status": "CANDIDATE",
      },
    ]
  `)

  const updatedDrafts = await prisma.noteDraft.findMany({
    where: { commit: { id: commit.id } },
  })
  expect(updatedDrafts.map(e => [e.symbol, e.status])).toMatchInlineSnapshot(`
      Array [
        Array [
          "[[Apple]]",
          "COMMIT",
        ],
      ]
    `)

  const noteDocHistory = await prisma.noteDoc.findMany({
    where: { note: { id: notes[0].id } },
    take: 10,
    orderBy: { createdAt: 'asc' },
  })
  expect(
    noteDocHistory.map(e => ({
      domain: e.domain,
      status: e.status,
      fromDocId: e.fromDocId,
    })),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "domain": "domain0",
        "fromDocId": null,
        "status": "MERGED",
      },
      Object {
        "domain": "domain0",
        "fromDocId": "0-candidate_initial_commit",
        "status": "CANDIDATE",
      },
    ]
  `)
})

it('got discuss ids, should only set this-draft-created-discusses to "ACTIVE"', async () => {
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[1]])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[1].id)
  expect(
    (await prisma.discuss.findMany()).map(e => ({
      id: e.id,
      userId: e.userId,
      status: e.status,
    })),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "id": "mock_discuss_0_active",
        "status": "ACTIVE",
        "userId": "testuser0",
      },
      Object {
        "id": "mock_discuss_1_draft",
        "status": "DRAFT",
        "userId": "testuser1",
      },
      Object {
        "id": "mock_discuss_2_archive",
        "status": "ARCHIVE",
        "userId": "testuser2",
      },
    ]
  `)
  const result = await commitNoteDrafts([mockNoteDrafts[1].id], mockUsers[1].id)
  expect(
    result.notes.map(e => {
      return e.discusses.map(d => ({
        id: d.id,
        userId: d.userId,
        status: d.status,
      }))
    }),
  ).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "id": "mock_discuss_0_active",
          "status": "ACTIVE",
          "userId": "testuser0",
        },
        Object {
          "id": "mock_discuss_2_archive",
          "status": "ARCHIVE",
          "userId": "testuser2",
        },
        Object {
          "id": "mock_discuss_1_draft",
          "status": "ACTIVE",
          "userId": "testuser1",
        },
      ],
    ]
  `)
})

it('create multiple note-docs given multiple draft-ids', async () => {
  const { noteDoc } = await testHelper.createMergeCommit(prisma)
  await testHelper.createNoteDrafts(prisma, [
    {
      ...mockNoteDrafts[0],
      id: 'local_id',
      userId: mockUsers[1].id,
      fromDocId: noteDoc.id,
      contentBody: {
        ...mockNoteDrafts[0].contentBody,
        blocks: mockNoteDrafts[0].contentBody.blocks.slice(0, -1),
      },
    },
    mockNoteDrafts[1],
  ])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[1].id)

  const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
    ['local_id', mockNoteDrafts[1].id],
    mockUsers[1].id,
  )
  expect(Object.keys(symbol_symId)).toMatchInlineSnapshot(`
      Array [
        "[[Apple]]",
        "[[Google]]",
      ]
    `)
  expect(notes.map(e => e.sym.symbol)).toMatchInlineSnapshot(`
      Array [
        "[[Apple]]",
        "[[Google]]",
      ]
    `)
  expect(
    noteDocs.map(({ fromDocId, status, meta }) => ({
      fromDocId,
      status,
      mergeState: (meta as any).mergeState,
    })),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "fromDocId": "0-candidate_initial_commit",
        "mergeState": "wait_to_merge-by_poll",
        "status": "CANDIDATE",
      },
      Object {
        "fromDocId": null,
        "mergeState": "merged_auto-initial_commit",
        "status": "MERGED",
      },
    ]
  `)
  const updatedDrafts = await prisma.noteDraft.findMany({
    where: { commit: { id: commit.id } },
  })
  expect(updatedDrafts.map(e => [e.symbol, e.status])).toMatchInlineSnapshot(`
    Array [
      Array [
        "[[Apple]]",
        "COMMIT",
      ],
      Array [
        "[[Google]]",
        "COMMIT",
      ],
    ]
  `)
})
