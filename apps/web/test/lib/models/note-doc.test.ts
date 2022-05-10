import prisma from '../../../lib/prisma'
import {
  noteDocModel,
  NoteDocMetaModel,
} from '../../../lib/models/note-doc-model'
import { testHelper } from '../../test-helpers'
import { Bullet } from '../../../components/bullet/bullet'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'

beforeAll(async () => {
  console.log('Writing required data into database')
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranch(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  //   await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym",  "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

/**
 * Cases:
 * - [] auto merge
 * - [] merge/reject by poll
 * -
 */

// describe('noteDocModel', () => {})

// noteDocModel()

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
