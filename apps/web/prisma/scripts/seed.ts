import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit-model'
import { mockNoteDrafts } from '../../test/__mocks__/mock-note-draft'
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

  await testHelper.createDiscusses(prisma)

  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(0, 2))
  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(5))

  await commitNoteDrafts([mockNoteDrafts[0].id], mockNoteDrafts[0].userId)
  await commitNoteDrafts([mockNoteDrafts[1].id], mockNoteDrafts[1].userId)

  await testHelper.createMergePolls(prisma)

  // mockNoteDrafts.slice(0, 2).forEach(async e => {
  //   await commitNoteDrafts([e.id], e.userId)
  // })
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
