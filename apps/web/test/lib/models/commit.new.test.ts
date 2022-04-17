/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import cuid from 'cuid'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { CommitInput as GQLCommitInput } from 'graphql-let/__generated__/__types__'
import { Bullet } from '../../../components/bullet/bullet'
import prisma from '../../../lib/prisma'
import { NoteModel } from '../../../lib/models/note-model'
import { CommitModel } from '../../../lib/models/commit-model'
import { bt, clean, TestDataHelper, TESTUSERS, TEST_NOTEDRAFTS } from '../../test-helpers'
import { commitNoteDrafts } from '../../../lib/models/commit-draft-model'

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

test('commitNoteDrafts general return ', async () => {
  const result = await commitNoteDrafts([TEST_NOTEDRAFTS[0].id, TEST_NOTEDRAFTS[1].id], 'testuser0')
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

test('commitNoteDrafts got discusses id ', async () => {
  const result = await commitNoteDrafts([TEST_NOTEDRAFTS[1].id], 'testuser0')
  expect(result.notes.map(e => e.discusses)).toMatchInlineSnapshot(`
    Array [
      Array [
        Object {
          "content": "Ut veniam enim praesentium voluptas dolores accusantium suscipit pariatur. Alias provident quisquam explicabo consequatur sint voluptatem quam fugiat et. Culpa voluptate aliquam quia optio rerum sunt. Natus necessitatibus fugiat blanditiis in aut consequuntur. Nesciunt est est suscipit nam.",
          "createdAt": 2022-04-15T16:58:33.648Z,
          "id": "testdiscuss0",
          "meta": Object {},
          "status": "ACTIVE",
          "title": "Id sint quia quaerat et voluptatem quia.",
          "updatedAt": 2022-04-15T16:58:34.137Z,
          "userId": "testuser0",
        },
        Object {
          "content": null,
          "createdAt": 2022-04-15T16:58:33.648Z,
          "id": "testdiscuss1",
          "meta": Object {},
          "status": "ACTIVE",
          "title": "Vero veniam sit.",
          "updatedAt": 2022-04-15T16:58:34.137Z,
          "userId": "testuser1",
        },
      ],
    ]
  `)
})
