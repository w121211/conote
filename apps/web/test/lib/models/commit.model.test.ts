import prisma from '../../../lib/prisma'
import { commitNoteDrafts } from '../../../lib/models/commit.model'
import { mockNoteDrafts } from '../../__mocks__/note-draft.mock'
import { mockUsers } from '../../__mocks__/user.mock'
import { testHelper } from '../../test-helpers'

beforeAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createBranches(prisma)
  await testHelper.createUsers(prisma)
  // console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Commit", "Discuss", "Note", "NoteDoc", "NoteDraft", "Link", "Sym", "Poll" CASCADE;`
})

// afterAll(async () => {
// // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
//   await prisma.$disconnect()
// })

it('throws if user is not the owner of draft', async () => {
  await testHelper.createNoteDrafts(prisma, [
    mockNoteDrafts[0],
    mockNoteDrafts[1],
  ])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[1].id)
  await expect(
    commitNoteDrafts(
      [mockNoteDrafts[0].id, mockNoteDrafts[1].id],
      mockUsers[0].id,
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"User is not the owner of the draft"`,
  )
})

it('throws if draftId cannot be found', async () => {
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[0].id)
  await expect(
    commitNoteDrafts(
      [mockNoteDrafts[0].id, 'a-not-found-draft-id'],
      mockUsers[0].id,
    ),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Draft not found by given id"`)
})

it('throws if from-doc is empty but head doc exist', async () => {
  await testHelper.createMergeCommit(prisma)
  await testHelper.createDiscusses(prisma, mockNoteDrafts[0].id)
  const draft = {
    ...mockNoteDrafts[0],
    id: '99-from_doc_not_head',
  }

  await testHelper.createNoteDrafts(prisma, [draft])
  await expect(
    commitNoteDrafts([draft.id], draft.userId),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"FROM_DOC_NOT_HEAD#99-from_doc_not_head, CONTENT_NOT_CHANGE#99-from_doc_not_head"`,
  )
})

it('throws if content is the same as from-doc', async () => {
  const { noteDoc } = await testHelper.createMergeCommit(prisma)
  await testHelper.createDiscusses(prisma, mockNoteDrafts[0].id)
  const [testerDraft] = await testHelper.createNoteDrafts(prisma, [
    {
      ...mockNoteDrafts[0],
      id: 'local_id',
      fromDocId: noteDoc.id,
    },
  ])
  await expect(
    commitNoteDrafts(['local_id'], testerDraft.userId),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"CONTENT_NOT_CHANGE#local_id"`)
})

it('throws if one or more discussion ids are not found', async () => {
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[1]])
  await expect(
    commitNoteDrafts([mockNoteDrafts[1].id], mockNoteDrafts[1].userId),
  ).rejects.toThrowErrorMatchingInlineSnapshot(
    `"DISCUSS_ID_NOT_FOUND#1-got_discusses, DISCUSS_ID_NOT_FOUND#1-got_discusses, DISCUSS_ID_NOT_FOUND#1-got_discusses, DISCUSS_ID_NOT_FOUND#1-got_discusses"`,
  )
})

/**
 * commitNoteDrafts()
 *
 * Cases:
 * - [x] from-doc is null, create sym, note -> (1)
 * - [x] from-doc is not null -> (2)
 * - [x] mix of (1) and (2) (commit drafts with null and not null for from-doc)
 * - [x] got discuss ids, should only set this-draft-created-discusses to "ACTIVE"
 * - [ ] commit a web-note (ie, got link-id) if from-doc is null => not equals to case (1), need one extra step: connect sym & link
 * - [x] commit a web-note if from-doc is not null -> equals to case (2)
 *
 */

it('create sym, note if from-doc not exist', async () => {
  await testHelper.createNoteDrafts(prisma, [
    mockNoteDrafts[0],
    {
      ...mockNoteDrafts[1],
      userId: mockUsers[0].id,
    },
  ])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[1].id)

  const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
    [mockNoteDrafts[0].id, mockNoteDrafts[1].id],
    mockUsers[0].id,
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
    noteDocs.map(({ status, meta }) => ({
      status,
      mergeState: (meta as any).mergeState,
    })),
  ).toMatchInlineSnapshot(`
    Array [
      Object {
        "mergeState": "merged_auto-initial_commit",
        "status": "MERGED",
      },
      Object {
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
          "[[Google]]",
          "COMMIT",
        ],
        Array [
          "[[Apple]]",
          "COMMIT",
        ],
      ]
    `)
  const noteDocHistory = await prisma.noteDoc.findMany({
    where: { note: { id: notes[0].id } },
    take: 3,
  })
  expect(noteDocHistory.map(e => e.domain)).toMatchInlineSnapshot(`
      Array [
        "domain0",
      ]
    `)
})

it('create noteDoc if from-doc exists', async () => {
  // Start with a draft without from-doc and simulate the first-commit to get the note-doc as from-doc.
  //  This way removes the hassle of caring the commit process
  //  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
  const { noteDoc } = await testHelper.createMergeCommit(prisma)
  await testHelper.createDiscusses(prisma, mockNoteDrafts[0].id)
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
    (await prisma.discuss.findMany())
      .map(e => ({
        id: e.id,
        userId: e.userId,
        status: e.status,
      }))
      .sort((a, b) => a.id.localeCompare(b.id)),
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
      return e.discusses
        .map(d => ({
          id: d.id,
          userId: d.userId,
          status: d.status,
        }))
        .sort((a, b) => a.id.localeCompare(b.id))
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
          "id": "mock_discuss_1_draft",
          "status": "ACTIVE",
          "userId": "testuser1",
        },
        Object {
          "id": "mock_discuss_2_archive",
          "status": "ARCHIVE",
          "userId": "testuser2",
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

it('commit a web-note (ie, got link-id) if from-doc is null => not equals to case (1), need one extra step: connect sym & link', async () => {
  if (mockNoteDrafts[4].linkId === null)
    throw new Error('mockNoteDrafts[4].linkId === null')

  await testHelper.createLinks(prisma)
  await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[4]])
  await testHelper.createDiscusses(prisma, mockNoteDrafts[4].id)
  const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
    [mockNoteDrafts[4].id],
    mockNoteDrafts[4].userId,
  )

  expect(Object.keys(symbol_symId)).toMatchInlineSnapshot(`
    Array [
      "[[https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url]]",
    ]
  `)
  expect(notes.map(e => e.sym.symbol)).toMatchInlineSnapshot(`
    Array [
      "[[https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url]]",
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
        "[[https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url]]",
        "COMMIT",
      ],
    ]
  `)
  const noteDocHistory = await prisma.noteDoc.findMany({
    where: { note: { id: notes[0].id } },
    take: 10,
  })
  expect(noteDocHistory.length).toMatchInlineSnapshot(`1`)
  const link = await prisma.link.findUnique({
    where: { id: mockNoteDrafts[4].linkId },
    include: { sym: true },
  })
  expect(link?.sym?.symbol).toMatchInlineSnapshot(
    `"[[https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url]]"`,
  )
})
