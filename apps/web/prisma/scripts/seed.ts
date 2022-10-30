import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit.model'
import { noteDraftModel } from '../../lib/models/note-draft.model'
import { noteDocModel } from '../../lib/models/note-doc.model'
import { linkModel } from '../../lib/models/link.model'
import { mockBranches } from '../../test/__mocks__/branch.mock'
import {
  mockNoteDrafts,
  mockNoteDrafts_gotFromDoc,
} from '../../test/__mocks__/note-draft.mock'
import { mockUsers } from '../../test/__mocks__/user.mock'
import { testHelper } from '../../test/test-helpers'
import { mockLinks } from '../../test/__mocks__/link.mock'

// const scraper = new FetchClient(
//   resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'),
// )

const prisma = new PrismaClient({ errorFormat: 'pretty' })

/**
 * Main entry
 */
async function main() {
  console.log('Truncating databse...')
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User", "Commit", "Discuss", "DiscussPost", "Note", "NoteDoc", "NoteDraft", "Link", "Sym", "Poll", "PollVote" CASCADE;`

  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)
  // await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(0, 2))

  //
  // 1. Simulate creating a draft (topic-note), discuss, and commit
  //
  //

  const draft0 = mockNoteDrafts[0]
  const { symbol, userId, contentBody, meta, ...rest } = draft0
  const draft0_ = await noteDraftModel.create(
    mockBranches[0].name,
    symbol,
    userId,
    {
      ...rest,
      contentBody: {
        blocks: contentBody.blocks,
        blockDiff: [],
      },
    },
  )

  await testHelper.createDiscusses(prisma, draft0_.id)
  const { noteDocs: createdNoteDocs0 } = await commitNoteDrafts(
    [draft0_.id],
    draft0_.userId,
  )

  // Warnning! This is the wrong way to create merge polls. Only used for the testing.
  // await testHelper.createMergePoll(
  //   prisma,
  //   mockMergePolls[0],
  //   createdNoteDocs0[0],
  // )

  //
  // 2. Simulate create a draft has from-doc
  //
  //

  const fromDoc0 = createdNoteDocs0[0]
  const fromDoc0_ = noteDocModel.parse(fromDoc0)
  const drafts_gotFromDoc = mockNoteDrafts_gotFromDoc(
    mockUsers[4].id,
    fromDoc0_,
  )

  await testHelper.createNoteDrafts(prisma, drafts_gotFromDoc)
  await commitNoteDrafts(
    drafts_gotFromDoc.map(e => e.id),
    mockUsers[4].id,
  )

  //
  // 3. Simulate creating a draft of web-note
  //
  //

  await testHelper.createLinks(prisma)
  const draft4 = mockNoteDrafts[4]
  const mockLink = mockLinks.find(e => e.id === draft4.linkId)

  if (mockLink === undefined) throw new Error('mockLink === undefined')

  const [link4] = await linkModel.getOrCreateLink(mockLink.url)
  const {
    userId: userId4,
    contentBody: contentBody4,
    meta: meta4,
    ...rest4
  } = draft4
  const draft4_ = await noteDraftModel.createByLink(
    mockBranches[0].name,
    link4.id,
    userId4,
    {
      ...rest4,
      contentBody: { blocks: contentBody4.blocks, blockDiff: [] },
    },
  )
  const { noteDocs: noteDocs4 } = await commitNoteDrafts([draft4_.id], userId)

  //
  // 4. Simulate creating a web-note on the same url
  //
  //
  const fromDoc4 = noteDocs4[0],
    fromDoc4_ = noteDocModel.parse(fromDoc4),
    draft5 = mockNoteDrafts_gotFromDoc(mockUsers[1].id, fromDoc4_)[0]

  const [link5] = await linkModel.getOrCreateLink(mockLink.url)
  const {
    userId: userId5,
    contentBody: contentBody5,
    meta: meta5,
    ...rest5
  } = draft5

  const draft5_ = await noteDraftModel.createByLink(
    mockBranches[0].name,
    link5.id,
    userId5,
    {
      ...rest5,
      contentBody: { blocks: contentBody5.blocks, blockDiff: [] },
    },
  )
  await commitNoteDrafts([draft5_.id], userId5)
}

main()
  .catch(err => {
    console.error(err)
    throw err
  })
  .finally(async () => {
    console.log('Done, closing primsa')
    // scraper.dump()
    prisma.$disconnect()
    process.exit()
  })
