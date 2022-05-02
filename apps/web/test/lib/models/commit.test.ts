/* eslint-disable no-await-in-loop */
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-draft-model'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'
import { mockUsers } from '../../__mocks__/mock-user'

beforeEach(async () => {
  // Writing required data into database
  await testHelper.createBranch(prisma)
  await testHelper.createUsers(prisma)
  await testHelper.createDiscusses(prisma)

  // console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym", "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

describe('commitNoteDrafts()', () => {
  /**
   * Validations
   *
   * Cases which throws error:
   * - [x] user is not the owner of draft
   * - [x] draftId cannot be found
   * - [x] fromDoc is empty but there is a latest doc
   * - [x] fromDoc does not match
   *
   */

  it('throws if user is not the owner of draft', async () => {
    await testHelper.createNoteDrafts(prisma)

    await expect(async () => {
      await commitNoteDrafts(
        [mockNoteDrafts[0].id, mockNoteDrafts[1].id],
        mockUsers[0].id,
      )
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"User is not the owner of the draft"`,
    )
  })

  it('throws if draftId cannot be found', async () => {
    await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])

    await expect(async () => {
      await commitNoteDrafts(
        [mockNoteDrafts[0].id, 'a-not-found-draft-id'],
        mockUsers[0].id,
      )
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"Some draftId does not exist."`,
    )
  })

  it('throws if fromDoc is empty but there is a latest doc ', async () => {
    await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
    await testHelper.createCommit(prisma)

    await expect(async () => {
      await commitNoteDrafts([mockNoteDrafts[0].id], mockUsers[0].id)
    }).rejects.toThrowErrorMatchingInlineSnapshot(
      `"FromDoc is not the latest doc of this note."`,
    )
  })

  /**
   * Executions
   *
   * Cases:
   * - [x] (1) from-doc is null, create sym, note
   * - [ ] (2) from-doc is not null
   * - [ ] mix of (1) and (2)
   * - [x] got discuss ids, should only set this-draft-created-discusses to "ACTIVE"
   *
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
    expect(noteDocs.map(e => e.status)).toMatchInlineSnapshot(`
      Array [
        "CANDIDATE",
        "CANDIDATE",
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

  it('got discuss ids, should only set this-draft-created-discusses to "ACTIVE"', async () => {
    await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[1]])

    expect(
      (await prisma.discuss.findMany()).map(e => ({
        id: e.id,
        userId: e.userId,
        status: e.status,
      })),
    ).toMatchInlineSnapshot(`
      Array [
        Object {
          "id": "mock-discuss-0_active",
          "status": "ACTIVE",
          "userId": "testuser0",
        },
        Object {
          "id": "mock-discuss-1_draft",
          "status": "DRAFT",
          "userId": "testuser1",
        },
        Object {
          "id": "mock-discuss-2_archive",
          "status": "ARCHIVE",
          "userId": "testuser2",
        },
      ]
    `)

    const result = await commitNoteDrafts(
      [mockNoteDrafts[1].id],
      mockUsers[1].id,
    )
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
            "id": "mock-discuss-1_draft",
            "status": "ACTIVE",
            "userId": "testuser1",
          },
        ],
      ]
    `)
  })
})

// test('commitNoteDrafts fromDoc does not match', async () => {
//   const { commit, notes, noteDocs } = await commitNoteDrafts(
//     [TEST_NOTEDRAFTS[0].id],
//     'testuser0',
//   )
//   const commit1 = await prisma.commit.create({
//     data: {
//       id: 'commit00',
//       user: { connect: { id: TEST_USERS[0].id } },
//     },
//   })

//   await prisma.noteDoc.create({
//     data: {
//       id: 'testdoc0',
//       branch: { connect: { name: TEST_BRANCH[0].name } },
//       sym: { connect: { id: notes[0].symId } },
//       commit: { connect: { id: commit1.id } },
//       note: { connect: { id: notes[0].id } },
//       user: { connect: { id: TEST_USERS[1].id } },
//       status: 'MERGE',
//       domain: noteDocs[0].domain,
//       content: {
//         blocks: [
//           { uid: '2', str: 'a' },
//           { uid: '4', str: 'ii' },
//         ],
//       },
//     },
//   })

//   const symbol = await prisma.sym.findUnique({
//     where: { id: notes[0].symId },
//     select: { symbol: true },
//   })

//   const newDraft = await prisma.noteDraft.create({
//     data: {
//       id: 'testdraft99',
//       symbol: symbol!.symbol,
//       branch: { connect: { name: TEST_BRANCH[0].name } },
//       sym: { connect: { id: notes[0].symId } },
//       note: { connect: { id: notes[0].id } },
//       user: { connect: { id: TEST_USERS[0].id } },
//       domain: noteDocs[0].domain,
//       content: {
//         blocks: [
//           { uid: '1', str: 'abpp' },
//           { uid: '3', str: 'illi' },
//         ],
//       },
//     },
//   })
//   await expect(async () => {
//     await commitNoteDrafts([newDraft.id], TEST_USERS[0].id)
//   }).rejects.toThrowErrorMatchingInlineSnapshot(
//     `"FromDoc is not the latest doc of this note."`,
//   )
// })

// test('commitNoteDrafts recommit the same drafts after commit failed to accomplish', async () => {
//   const { commit, notes, noteDocs } = await commitNoteDrafts(
//     [TEST_NOTEDRAFTS[0].id],
//     'testuser0',
//   )
//   const commit1 = await prisma.commit.create({
//     data: {
//       id: 'commit00',
//       user: { connect: { id: TEST_USERS[0].id } },
//     },
//   })

//   await prisma.noteDoc.create({
//     data: {
//       id: 'testdoc0',
//       branch: { connect: { name: TEST_BRANCH[0].name } },
//       sym: { connect: { id: notes[0].symId } },
//       commit: { connect: { id: commit1.id } },
//       note: { connect: { id: notes[0].id } },
//       user: { connect: { id: TEST_USERS[1].id } },
//       status: 'MERGE',
//       domain: noteDocs[0].domain,
//       content: {
//         blocks: [
//           { uid: '2', str: 'a' },
//           { uid: '4', str: 'ii' },
//         ],
//       },
//     },
//   })

//   const symbol = await prisma.sym.findUnique({
//     where: { id: notes[0].symId },
//     select: { symbol: true },
//   })

//   const newDraft = await prisma.noteDraft.create({
//     data: {
//       id: 'testdraft99',
//       symbol: symbol!.symbol,
//       branch: { connect: { name: TEST_BRANCH[0].name } },
//       sym: { connect: { id: notes[0].symId } },
//       note: { connect: { id: notes[0].id } },
//       user: { connect: { id: TEST_USERS[0].id } },
//       domain: noteDocs[0].domain,
//       content: {
//         blocks: [
//           { uid: '1', str: 'abpp' },
//           { uid: '3', str: 'illi' },
//         ],
//       },
//     },
//   })
//   await expect(async () => {
//     await commitNoteDrafts(
//       [TEST_NOTEDRAFTS[1].id, newDraft.id],
//       TEST_USERS[0].id,
//     )
//   }).rejects.toThrowErrorMatchingInlineSnapshot(
//     `"FromDoc is not the latest doc of this note."`,
//   )

//   const draft1FailedToCommit = await prisma.noteDraft.findUnique({
//     where: { id: TEST_NOTEDRAFTS[1].id },
//   })

//   expect(draft1FailedToCommit!.status).toMatchInlineSnapshot(`"EDIT"`)

//   const result = await commitNoteDrafts(
//     [TEST_NOTEDRAFTS[1].id],
//     TEST_USERS[0].id,
//   )

//   const draft1ToCommit = await prisma.noteDraft.findUnique({
//     where: { id: TEST_NOTEDRAFTS[1].id },
//   })

//   expect(result.noteDocs.map(e => ({ status: e.status })))
//     .toMatchInlineSnapshot(`
//     Array [
//       Object {
//         "status": "CANDIDATE",
//       },
//     ]
//   `)
//   expect(draft1ToCommit!.status).toMatchInlineSnapshot(`"COMMIT"`)
// })
