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
  TEST_COMMIT,
  TEST_NOTEDRAFTS,
  TEST_SYMBOLS,
} from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-draft-model'
import { noteDocModel, SymbolIdDict } from '../../../lib/models/note-doc-model'
import { SymType } from '@prisma/client'

beforeAll(async () => {
  console.log('Writing required data into database')
  await TestDataHelper.createUsers(prisma)
  await TestDataHelper.createDiscusses(prisma)
  await TestDataHelper.createBranch(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym",  "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

test('updateSymbol', async () => {
  const syms = await prisma.$transaction(
    TEST_SYMBOLS.map(e =>
      prisma.sym.create({
        data: {
          id: e.id,
          symbol: e.symbol,
          type: e.type as unknown as SymType,
        },
      }),
    ),
  )

  const symIds: SymbolIdDict = {}
  for (const sym of syms) {
    symIds[sym.symbol] = sym.id
  }

  const commit = await prisma.commit.create({
    data: {
      id: TEST_COMMIT[0].id,
      user: { connect: { id: TEST_COMMIT[0].userId } },
    },
  })

  await prisma.$transaction(
    TEST_NOTEDRAFTS.map(e =>
      prisma.note.create({
        data: {
          id: e.id,
          branch: { connect: { name: TEST_BRANCH[0].name } },
          sym: { connect: { id: e.symId } },
        },
      }),
    ),
  )

  const docs = await prisma.$transaction(
    TEST_NOTEDRAFTS.map(e =>
      prisma.noteDoc.create({
        data: {
          branch: { connect: { name: TEST_BRANCH[0].name } },
          sym: { connect: { id: e.symId } },
          commit: { connect: { id: TEST_COMMIT[0].id } },
          user: { connect: { id: e.userId } },
          note: {},
          domain: e.domain,
          content: { symbolIdDict: e.symbolIdDict, blocks: e.blocks },
        },
      }),
    ),
  )
  for (const index in docs) {
    await noteDocModel.updateSymbolIdDict(docs[index], symIds)
  }

  const result = await prisma.noteDoc.findMany({
    where: { commitId: commit.id },
    select: { content: true },
  })
  expect(result).toMatchInlineSnapshot(`
    Array [
      Object {
        "content": Object {
          "blocks": Array [
            Object {
              "str": "kkk",
              "uid": "1",
            },
          ],
          "symbolIdDict": Object {
            "$BA": "sym2",
            "[[Google]]": "sym1",
          },
        },
      },
      Object {
        "content": Object {
          "blocks": Array [
            Object {
              "str": "aba",
              "uid": "1",
            },
          ],
          "symbolIdDict": Object {
            "[[Apple]]": "sym0",
          },
        },
      },
      Object {
        "content": Object {
          "blocks": Array [
            Object {
              "str": "ooo",
              "uid": "1",
            },
          ],
          "symbolIdDict": Object {
            "[[Apple]]": "sym0",
          },
        },
      },
    ]
  `)
})
