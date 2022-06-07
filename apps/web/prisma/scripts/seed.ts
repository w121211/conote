import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit-model'
import {
  mockNoteDrafts,
  mockNoteDrafts_gotFromDoc,
} from '../../test/__mocks__/mock-note-draft'
import { testHelper } from '../../test/test-helpers'
import { NoteDraftParsed } from '../../lib/interfaces'
import { noteDocModel } from '../../lib/models/note-doc-model'
import { mockUsers } from '../../test/__mocks__/mock-user'

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

  await testHelper.createDiscusses(prisma)

  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(0, 2))
  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(5))

  const { noteDocs } = await commitNoteDrafts(
    [mockNoteDrafts[0].id],
    mockNoteDrafts[0].userId,
  )
  await commitNoteDrafts([mockNoteDrafts[1].id], mockNoteDrafts[1].userId)

  // await testHelper.createMergePolls(prisma)

  const fromDoc = noteDocs[0],
    fromDoc_ = noteDocModel.parse(fromDoc),
    drafts = mockNoteDrafts_gotFromDoc(mockUsers[4].id, fromDoc_)

  await testHelper.createNoteDrafts(prisma, drafts)
  await commitNoteDrafts(
    drafts.map(e => e.id),
    mockUsers[4].id,
  )
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
