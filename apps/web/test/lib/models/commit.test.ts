/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { CommitInput as GQLCommitInput } from 'graphql-let/__generated__/__types__'
import { Bullet } from '../../../components/bullet/bullet'
import prisma from '../../../lib/prisma'
import { NoteModel } from '../../../lib/models/note-model'
import { CommitModel } from '../../../lib/models/commit-model'
import {
  bt,
  clean,
  TestDataHelper,
  TESTUSERS,
  TEST_BRANCH,
  TEST_NOTEDRAFTS,
  TEST_SYMBOLS,
} from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-draft-model'
import { SymModel } from '../../../lib/models/sym-model'
import exp from 'constants'

beforeEach(async () => {
  console.log('Writing required data into database')
  await TestDataHelper.createUsers(prisma)
  await TestDataHelper.createDiscusses(prisma)
  await TestDataHelper.createBranch(prisma)
  await TestDataHelper.createNoteDrafts(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym", "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

test('commitNoteDrafts', async () => {
  const result = await commitNoteDrafts(
    [TEST_NOTEDRAFTS[0].id, TEST_NOTEDRAFTS[1].id],
    'testuser0',
  )
  const updatedDrafts = await prisma.noteDraft.findMany({
    where: { commit: { id: result.commit.id } },
  })

  // Check the status of Draft is changed
  expect(updatedDrafts.map(e => e.status)).toMatchInlineSnapshot(`
    Array [
      "COMMIT",
      "COMMIT",
    ]
  `)
  // Check content is saved to NoteDoc
  expect(result.noteDocs.map(e => e.status)).toMatchInlineSnapshot(`
    Array [
      "CANDIDATE",
      "CANDIDATE",
    ]
  `)
  const noteDocHistory = await prisma.noteDoc.findMany({
    where: { note: { id: result.notes[0].id } },
    take: 3,
  })
  expect(noteDocHistory.map(e => e.domain)).toMatchInlineSnapshot(`
    Array [
      "domain0",
    ]
  `)
})

test('commitNoteDrafts got discusses id ', async () => {
  const result = await commitNoteDrafts([TEST_NOTEDRAFTS[1].id], 'testuser0')
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
          "id": "testdiscuss0",
          "status": "ACTIVE",
          "userId": "testuser0",
        },
        Object {
          "id": "testdiscuss1",
          "status": "ACTIVE",
          "userId": "testuser1",
        },
        Object {
          "id": "testdiscuss2",
          "status": "ACTIVE",
          "userId": "testuser1",
        },
      ],
    ]
  `)
})

test('commitNoteDrafts draftId cannot be found', async () => {
  await expect(async () => {
    await commitNoteDrafts([TEST_NOTEDRAFTS[0].id, 'draft00'], 'testuser0')
  }).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Some draftId does not exist."`,
  )
})

test('commitNoteDrafts fromDoc is empty but there is a latest doc ', async () => {
  const { type } = SymModel.parse(TEST_SYMBOLS[0].symbol)
  const sym = await prisma.sym.create({
    data: {
      id: TEST_SYMBOLS[0].id,
      type,
      symbol: TEST_SYMBOLS[0].symbol,
    },
  })
  const note = await prisma.note.create({
    data: {
      id: 'testnote0',
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: TEST_SYMBOLS[0].id } },
    },
  })
  const commit0 = await prisma.commit.create({
    data: {
      id: 'commit00',
      user: { connect: { id: TESTUSERS[0].id } },
    },
  })

  await prisma.noteDoc.create({
    data: {
      id: 'testdoc0',
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: sym.id } },
      commit: { connect: { id: commit0.id } },
      note: { connect: { id: note.id } },
      user: { connect: { id: TESTUSERS[0].id } },
      status: 'MERGE',
      domain: TEST_NOTEDRAFTS[0].domain,
      content: {
        blocks: [
          { uid: '1', str: 'aba' },
          { uid: '3', str: 'iii' },
        ],
      },
    },
  })
  await expect(async () => {
    await commitNoteDrafts([TEST_NOTEDRAFTS[0].id], TEST_NOTEDRAFTS[0].userId)
  }).rejects.toThrowErrorMatchingInlineSnapshot(
    `"FromDoc is not the latest doc of this note."`,
  )
})

test('commitNoteDrafts fromDoc does not match', async () => {
  const { commit, notes, noteDocs } = await commitNoteDrafts(
    [TEST_NOTEDRAFTS[0].id],
    'testuser0',
  )
  const commit1 = await prisma.commit.create({
    data: {
      id: 'commit00',
      user: { connect: { id: TESTUSERS[0].id } },
    },
  })

  await prisma.noteDoc.create({
    data: {
      id: 'testdoc0',
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: notes[0].symId } },
      commit: { connect: { id: commit1.id } },
      note: { connect: { id: notes[0].id } },
      user: { connect: { id: TESTUSERS[1].id } },
      status: 'MERGE',
      domain: noteDocs[0].domain,
      content: {
        blocks: [
          { uid: '2', str: 'a' },
          { uid: '4', str: 'ii' },
        ],
      },
    },
  })

  const symbol = await prisma.sym.findUnique({
    where: { id: notes[0].symId },
    select: { symbol: true },
  })

  const newDraft = await prisma.noteDraft.create({
    data: {
      id: 'testdraft99',
      symbol: symbol!.symbol,
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: notes[0].symId } },
      note: { connect: { id: notes[0].id } },
      user: { connect: { id: TESTUSERS[0].id } },
      domain: noteDocs[0].domain,
      content: {
        blocks: [
          { uid: '1', str: 'abpp' },
          { uid: '3', str: 'illi' },
        ],
      },
    },
  })
  await expect(async () => {
    await commitNoteDrafts([newDraft.id], TESTUSERS[0].id)
  }).rejects.toThrowErrorMatchingInlineSnapshot(
    `"FromDoc is not the latest doc of this note."`,
  )
})

test('commitNoteDrafts recommit the same drafts after commit failed to accomplish', async () => {
  const { commit, notes, noteDocs } = await commitNoteDrafts(
    [TEST_NOTEDRAFTS[0].id],
    'testuser0',
  )
  const commit1 = await prisma.commit.create({
    data: {
      id: 'commit00',
      user: { connect: { id: TESTUSERS[0].id } },
    },
  })

  await prisma.noteDoc.create({
    data: {
      id: 'testdoc0',
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: notes[0].symId } },
      commit: { connect: { id: commit1.id } },
      note: { connect: { id: notes[0].id } },
      user: { connect: { id: TESTUSERS[1].id } },
      status: 'MERGE',
      domain: noteDocs[0].domain,
      content: {
        blocks: [
          { uid: '2', str: 'a' },
          { uid: '4', str: 'ii' },
        ],
      },
    },
  })

  const symbol = await prisma.sym.findUnique({
    where: { id: notes[0].symId },
    select: { symbol: true },
  })

  const newDraft = await prisma.noteDraft.create({
    data: {
      id: 'testdraft99',
      symbol: symbol!.symbol,
      branch: { connect: { name: TEST_BRANCH[0].name } },
      sym: { connect: { id: notes[0].symId } },
      note: { connect: { id: notes[0].id } },
      user: { connect: { id: TESTUSERS[0].id } },
      domain: noteDocs[0].domain,
      content: {
        blocks: [
          { uid: '1', str: 'abpp' },
          { uid: '3', str: 'illi' },
        ],
      },
    },
  })
  await expect(async () => {
    await commitNoteDrafts(
      [TEST_NOTEDRAFTS[1].id, newDraft.id],
      TESTUSERS[0].id,
    )
  }).rejects.toThrowErrorMatchingInlineSnapshot(
    `"FromDoc is not the latest doc of this note."`,
  )

  const draft1FailedToCommit = await prisma.noteDraft.findUnique({
    where: { id: TEST_NOTEDRAFTS[1].id },
  })

  expect(draft1FailedToCommit!.status).toMatchInlineSnapshot(`"EDIT"`)

  const result = await commitNoteDrafts(
    [TEST_NOTEDRAFTS[1].id],
    TESTUSERS[0].id,
  )

  const draft1ToCommit = await prisma.noteDraft.findUnique({
    where: { id: TEST_NOTEDRAFTS[1].id },
  })

  expect(result.noteDocs.map(e => ({ status: e.status })))
    .toMatchInlineSnapshot(`
    Array [
      Object {
        "status": "CANDIDATE",
      },
    ]
  `)
  expect(draft1ToCommit!.status).toMatchInlineSnapshot(`"COMMIT"`)
})
