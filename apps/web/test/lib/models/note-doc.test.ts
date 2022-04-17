/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { CommitInput as GQLCommitInput } from 'graphql-let/__generated__/__types__'
import { Bullet } from '../../../components/bullet/bullet'
import prisma from '../../../lib/prisma'
import { NoteModel } from '../../../lib/models/note-model'
import { CommitModel } from '../../../lib/models/commit-model'
import { bt, clean, TestDataHelper, TESTUSERS, TEST_COMMIT, TEST_NOTEDRAFTS, TEST_SYMBOLS } from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-draft-model'
import { noteDocModel } from '../../../lib/models/note-doc-model'
import { SymType } from '@prisma/client'

beforeAll(async () => {
  console.log('Writing required data into database')
  await TestDataHelper.createUsers(prisma)
  await TestDataHelper.createDiscusses(prisma)
  await TestDataHelper.createNoteDrafts(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym", "User" CASCADE;`

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
  await prisma.$transaction(
    TEST_NOTEDRAFTS.map(e =>
      prisma.note.create({
        data: {
          id: e.id,
          branch: { connect: { name: 'branch01' } },
          sym: { connect: { id: e.symId } },
        },
      }),
    ),
  )

  const docs = await prisma.$transaction(
    TEST_NOTEDRAFTS.map(e =>
      prisma.noteDoc.create({
        data: {
          branch: { connect: { name: 'branch01' } },
          sym: { connect: { id: e.symId } },
          commit: { connect: { id: TEST_COMMIT[0].id } },
          user: { connect: { id: e.userId } },
          note: {},
          domain: e.domain,
          content: { symbolIdMap: e.symbolIdMap, blocks: e.blocks },
        },
      }),
    ),
  )
  const result = await noteDocModel.updateSymbolIdDict(docs[0], syms)
  expect(result.symbolIdDict).toMatchInlineSnapshot(`
      Object {
        "[[Apple]]": "cl20ocp5b0063rrobnm6zp7i9",
        "[[Google]]": "cl20ocp8y0123rrobq1od6o34",
      }
    `)
  expect(result.noteDocs.map(e => e.content)).toMatchInlineSnapshot(`
      Array [
        Object {
          "blocks": Array [
            Object {
              "str": "kkk",
              "uid": "1",
            },
          ],
          "symbolIdMap": Object {
            "[[Google]]": "",
          },
        },
        Object {
          "blocks": Array [
            Object {
              "str": "aba",
              "uid": "1",
            },
          ],
          "symbolIdMap": Object {
            "[[Apple]]": "",
          },
        },
      ]
    `)
})
