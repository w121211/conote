/* eslint-disable no-await-in-loop */
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-model'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'
import { mockUsers } from '../../__mocks__/mock-user'
import { mockNoteDocs } from '../../__mocks__/mock-note-doc'

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
    await testHelper.createNoteDrafts(prisma, [
      mockNoteDrafts[0],
      mockNoteDrafts[1],
    ])
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
   * - [x] (2) from-doc is not null
   * - [x] mix of (1) and (2) (commit drafts with null and not null for from-doc)
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
            "id": "mock-discuss-0_active",
            "status": "ACTIVE",
            "userId": "testuser0",
          },
          Object {
            "id": "mock-discuss-1_draft",
            "status": "ACTIVE",
            "userId": "testuser1",
          },
          Object {
            "id": "mock-discuss-2_archive",
            "status": "ARCHIVE",
            "userId": "testuser2",
          },
        ],
      ]
    `)
  })
  it('create noteDoc if from-doc exists', async () => {
    await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
    await testHelper.createCommit(prisma)
    await testHelper.createNoteDrafts(prisma, [
      {
        ...mockNoteDrafts[0],
        id: 'mock-draft-0-1_from-empty',
        userId: mockUsers[1].id,
        fromDocId: mockNoteDocs[1].id,
      },
    ])
    expect(
      await prisma.noteDraft.findUnique({
        where: { id: 'mock-draft-0-1_from-empty' },
        select: { fromDocId: true },
      }),
    ).toMatchInlineSnapshot(`
      Object {
        "fromDocId": "mock-doc-1_merge",
      }
    `)

    const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
      ['mock-draft-0-1_from-empty'],
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
    expect(noteDocs.map(e => e.status)).toMatchInlineSnapshot(`
      Array [
        "CANDIDATE",
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
      take: 3,
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
          "status": "MERGE",
        },
        Object {
          "domain": "domain0",
          "fromDocId": "mock-doc-1_merge",
          "status": "CANDIDATE",
        },
      ]
    `)
  })

  it('create multiple noteDocs if one from-doc exists and the other does not', async () => {
    await testHelper.createNoteDrafts(prisma, [mockNoteDrafts[0]])
    await testHelper.createCommit(prisma)
    await testHelper.createNoteDrafts(prisma, [
      {
        ...mockNoteDrafts[0],
        id: 'mock-draft-0-1_from-empty',
        userId: mockUsers[1].id,
        fromDocId: mockNoteDocs[1].id,
      },
      mockNoteDrafts[1],
    ])
    const { commit, notes, noteDocs, symbol_symId } = await commitNoteDrafts(
      ['mock-draft-0-1_from-empty', mockNoteDrafts[1].id],
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
    expect(noteDocs.map(e => ({ fromDocId: e.fromDocId, status: e.status })))
      .toMatchInlineSnapshot(`
      Array [
        Object {
          "fromDocId": "mock-doc-1_merge",
          "status": "CANDIDATE",
        },
        Object {
          "fromDocId": null,
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
          "[[Google]]",
          "COMMIT",
        ],
        Array [
          "[[Apple]]",
          "COMMIT",
        ],
      ]
    `)
  })
})
