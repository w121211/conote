import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit.model'
import { noteDraftModel } from '../../lib/models/note-draft.model'
import { noteDocModel } from '../../lib/models/note-doc.model'
import { mockBranches } from '../../test/__mocks__/branch.mock'
import {
  mockNoteDrafts,
  mockNoteDrafts_gotFromDoc,
} from '../../test/__mocks__/note-draft.mock'
import { mockUsers } from '../../test/__mocks__/user.mock'
import { testHelper } from '../../test/test-helpers'

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

  // 1. Simulate create a draft, discuss, and commit

  const draft0 = mockNoteDrafts[0],
    { symbol, userId, contentBody, meta, ...rest } = draft0,
    draft0_ = await noteDraftModel.create(
      mockBranches[0].name,
      symbol,
      userId,
      {
        ...rest,
        contentBody: {
          blocks: contentBody.blocks,
          blockDiff: [],
          // discussIds: [],
          // symbols: [],
        },
      },
    )

  await testHelper.createDiscusses(prisma, draft0_.id)

  const { noteDocs } = await commitNoteDrafts([draft0_.id], draft0_.userId)

  // const { blocks, docBlock } = parseGQLBlocks(
  //   noteDocModel.parse(noteDocs[0]).contentBody.blocks,
  // )

  // Warnning! This is the wrong way to create merge polls. Only used for the testing.
  await testHelper.createMergePolls(prisma, noteDocs[0])

  // 2. Simulate create a draft from the head doc

  const fromDoc = noteDocs[0],
    fromDoc_ = noteDocModel.parse(fromDoc),
    drafts_gotFromDoc = mockNoteDrafts_gotFromDoc(mockUsers[4].id, fromDoc_)

  await testHelper.createNoteDrafts(prisma, drafts_gotFromDoc)
  await commitNoteDrafts(
    drafts_gotFromDoc.map(e => e.id),
    mockUsers[4].id,
  )

  // 3. Simulate a draft got from doc but the from doc is behind the head doc
  // TODO
}

main()
  .catch(err => {
    console.error('error', err)
    throw new Error()
  })
  .finally(async () => {
    console.log('Done, closing primsa')
    // scraper.dump()
    prisma.$disconnect()
    process.exit()
  })
