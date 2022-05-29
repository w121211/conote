import { PrismaClient } from '@prisma/client'
import { commitNoteDrafts } from '../../lib/models/commit-model'
import { testHelper } from '../../test/test-helpers'
import { mockNoteDrafts } from '../../test/__mocks__/mock-note-draft'
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

  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User", "Commit", "Discuss", "Note", "NoteDoc", "NoteDraft", "Link", "Sym" CASCADE;`

  console.log('Creating mock users, branches...')

  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)

  console.log('Creating mock discusses...')

  await testHelper.createDiscusses(prisma)

  console.log('Creating mock note-drafts...')
  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(0, 2))
  await testHelper.createNoteDrafts(prisma, mockNoteDrafts.slice(5))

  console.log('Creating mock commits...')
  await commitNoteDrafts([mockNoteDrafts[0].id], mockNoteDrafts[0].userId)
  await commitNoteDrafts([mockNoteDrafts[1].id], mockNoteDrafts[1].userId)

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
