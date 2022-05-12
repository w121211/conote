import prisma from '../../../lib/prisma'
import {
  noteDocModel,
  NoteDocMetaModel,
  mergeAutomatical,
} from '../../../lib/models/note-doc-model'
import { testHelper } from '../../test-helpers'
import { Bullet } from '../../../components/bullet/bullet'
import { mockNoteDrafts } from '../../__mocks__/mock-note-draft'
import { mockNoteDocs } from '../../__mocks__/mock-note-doc'
import { NoteDocMeta } from '../../../lib/interfaces'
import { mockCommits } from '../../__mocks__/mock-commit'
import { mockBlocks } from '../../../components/block-editor/test/__mocks__/mock-block'

beforeAll(async () => {
  console.log('Writing required data into database')
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)

  console.log('Setting up a fetch-client')
  // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  //   await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Branch", "Note", "NoteDoc", "NoteDraft", "NoteEmoji", "Link", "Poll", "Sym",  "User" CASCADE;`

  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

afterEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Link", "Poll", "Sym" CASCADE;`
})

/**
 * Cases:
 * - [] auto merge
 * - [] merge/reject by poll
 * -
 */

describe('mergeAutomatical()', () => {
  it('no fromDocId', async () => {
    await testHelper.createCandidateCommit(prisma)
    const doc = await prisma.noteDoc.findUnique({
      where: { id: mockNoteDocs[1].id },
    })
    mergeAutomatical(doc!)
    const afterDoc = await prisma.noteDoc.findUnique({ where: { id: doc!.id } })
    expect(afterDoc?.status).toMatchInlineSnapshot()
  })

  it("no deletions and changes to the previous-doc's content except for addition", async () => {
    await testHelper.createMergeCommit
    // const docMerged = await prisma.noteDoc.findUnique({
    //   where: { id: mockNoteDocs[1].id },
    // })
    const newCommit = await prisma.commit.create({
      data: { ...mockCommits[0], id: 'mock-commit-test' },
    })
    const newContent = {
      ...mockNoteDocs[1].content,
      symbol_symId: { ...mockNoteDocs[1].content.symbolIdMap, $AA: null },
    }
    const docToMerge = await prisma.noteDoc.create({
      data: {
        ...mockNoteDocs[1],
        id: 'mock-note-test',
        status: 'CANDIDATE',
        commitId: newCommit.id,
        content: newContent,
      },
    })
    mergeAutomatical(docToMerge)
    const afterDoc = await prisma.noteDoc.findUnique({
      where: { id: docToMerge.id },
    })
    expect(afterDoc?.status).toMatchInlineSnapshot()
  })
  it("deletions or changes to the previous-doc's content", async () => {
    await testHelper.createMergeCommit
    // const docMerged = await prisma.noteDoc.findUnique({
    //   where: { id: mockNoteDocs[1].id },
    // })
    const newCommit = await prisma.commit.create({
      data: { ...mockCommits[0], id: 'mock-commit-test' },
    })
    const newContent = {
      ...mockNoteDocs[1].content,
      symbol_symId: { $AA: null },
      blocks: mockBlocks[1],
    }
    const docToMerge = await prisma.noteDoc.create({
      data: {
        ...mockNoteDocs[1],
        id: 'mock-note-test',
        status: 'CANDIDATE',
        commitId: newCommit.id,
        content: newContent,
      },
    })
    mergeAutomatical(docToMerge)
    const afterDoc = await prisma.noteDoc.findUnique({
      where: { id: docToMerge.id },
    })
    expect(afterDoc?.status).toMatchInlineSnapshot()
  })
  // Move to ValidateCommit
  // it('no change', async () => {
  //   await testHelper.createMergeCommit(prisma)
  //   // await testHelper.createCandidateCommit(prisma)
  //   const docMerged = await prisma.noteDoc.findUnique({
  //     where: { id: mockNoteDocs[1].id },
  //   })
  //   const newCommit = await prisma.commit.create({
  //     data: { ...mockCommits[0], id: 'mock-commit-test' },
  //   })
  //   const docToMerge = await prisma.noteDoc.create({
  //     data: {
  //       ...mockNoteDocs[1],
  //       id: 'mock-note-test',
  //       status: 'CANDIDATE',
  //       commitId: newCommit.id,
  //     },
  //   })
  //   mergeAutomatical(docToMerge)
  //   const resultDoc = await prisma.noteDoc.findUnique({
  //     where: { id: docToMerge.id },
  //   })
  //   expect(resultDoc).rejects.toThrowErrorMatchingInlineSnapshot()
  // })
})
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
