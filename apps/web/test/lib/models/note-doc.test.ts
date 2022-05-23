import prisma from '../../../lib/prisma'
import {
  noteDocModel,
  NoteDocMetaModel,
  mergeAutomatical,
  mergePeriodical,
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
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll"  CASCADE;`
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
      where: { id: mockNoteDocs[0].id },
    })
    const afterDoc = await mergeAutomatical(doc!)
    // const afterDoc = await prisma.noteDoc.findUnique({ where: { id: doc!.id } })
    expect(afterDoc!.status).toMatchInlineSnapshot(`"MERGE"`)
  })

  // it("no deletions and changes to the previous-doc's content except for addition", async () => {
  //   await testHelper.createMergeCommit(prisma)

  //   // const docMerged = await prisma.noteDoc.findUnique({
  //   //   where: { id: mockNoteDocs[1].id },
  //   // })
  //   const newCommit = await prisma.commit.create({
  //     data: { ...mockCommits[0], id: 'mock-commit-test' },
  //   })
  //   const newContent = {
  //       ...mockNoteDocs[1].content,
  //       symbol_symId: { ...mockNoteDocs[1].content.symbolIdMap, $AA: null },
  //     },
  //     poll = await prisma.poll.create({
  //       data: {
  //         id: 'mock-poll-test-1',
  //         meta: {},
  //         user: { connect: { id: mockNoteDocs[1].userId } },
  //       },
  //     })
  //   const docToMerge = await prisma.noteDoc.create({
  //     data: {
  //       // ...mockNoteDocs[1],
  //       id: 'mock-note-test',
  //       // branchId_symId: {
  //       //   branchId: mockNoteDocs[1].branchId,
  //       //   symId: mockNoteDocs[1].symId,
  //       // },
  //       branch: { connect: { id: mockNoteDocs[1].branchId } },
  //       sym: { connect: { id: mockNoteDocs[1].symId } },
  //       note: {
  //         connect: {
  //           branchId_symId: {
  //             branchId: mockNoteDocs[1].branchId,
  //             symId: mockNoteDocs[1].symId,
  //           },
  //         },
  //       },
  //       domain: 'domain0',
  //       fromDoc: { connect: { id: mockNoteDocs[1].id } },
  //       mergePoll: { connect: { id: poll.id } },
  //       status: 'CANDIDATE',
  //       commit: { connect: { id: newCommit.id } },
  //       content: newContent,
  //       user: { connect: { id: mockNoteDocs[1].userId } },
  //     },
  //   })
  //   const afterDoc = await mergeAutomatical(docToMerge)
  //   // const afterDoc = await prisma.noteDoc.findUnique({
  //   //   where: { id: docToMerge.id },
  //   // })
  //   expect(afterDoc!.status).toMatchInlineSnapshot()
  // })
  // it("deletions or changes to the previous-doc's content", async () => {
  //   await testHelper.createMergeCommit
  //   // const docMerged = await prisma.noteDoc.findUnique({
  //   //   where: { id: mockNoteDocs[1].id },
  //   // })
  //   const newCommit = await prisma.commit.create({
  //     data: { ...mockCommits[0], id: 'mock-commit-test' },
  //   })
  //   const newContent = {
  //     ...mockNoteDocs[1].content,
  //     symbol_symId: { $AA: null },
  //     blocks: mockBlocks[1],
  //   }
  //   const docToMerge = await prisma.noteDoc.create({
  //     data: {
  //       ...mockNoteDocs[1],
  //       id: 'mock-note-test',
  //       status: 'CANDIDATE',
  //       commitId: newCommit.id,
  //       content: newContent,
  //     },
  //   })
  //   const afterDoc = await mergeAutomatical(docToMerge)
  //   // const afterDoc = await prisma.noteDoc.findUnique({
  //   //   where: { id: docToMerge.id },
  //   // })
  //   expect(afterDoc!.status).toMatchInlineSnapshot()
  // })
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

describe('mergePeriodical()', () => {
  it('merge if the time is up and ups are more than downs', async () => {
    await testHelper.createCandidateCommit(prisma)
    // set the time and Poll to be able to merge successfully
    const poll = await prisma.poll.findUnique({
      where: { id: mockNoteDocs[0].mergePollId },
      include: { count: true },
    })
    await prisma.pollCount.update({
      data: { nVotes: [5, 3] },
      where: { id: poll?.count?.id },
    })
    const docMerged = await mergePeriodical(mockNoteDocs[0])
    expect(docMerged.status).toMatchInlineSnapshot(`"MERGE"`)
  })
  it('reject if the time is up and downs are more than ups', async () => {
    await testHelper.createCandidateCommit(prisma)
    // set the time and Poll to be able to reject
    const poll = await prisma.poll.findUnique({
      where: { id: mockNoteDocs[0].mergePollId },
      include: { count: true },
    })
    await prisma.pollCount.update({
      data: { nVotes: [1, 9] },
      where: { id: poll?.count?.id },
    })
    const docMerged = await mergePeriodical(mockNoteDocs[0])
    expect(docMerged.status).toMatchInlineSnapshot(`"REJECT"`)
  })
})

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
