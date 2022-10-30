import { PrismaClient } from '@prisma/client'
import { nanoid } from 'nanoid'
import { getBotEmail } from '../../lib/models/user.model'
import { BRANCH_NAME_DEFAULT } from '../../share/constants'

const prisma = new PrismaClient({ errorFormat: 'pretty' })

/**
 * Initialize the database with the required setup for an empty database.
 * Only run it once.
 */
async function main() {
  // Create the bot user
  await prisma.user.create({
    data: {
      id: nanoid(), // Give a random id
      email: getBotEmail(),
    },
  })

  // Create the default branch
  await prisma.branch.create({
    data: {
      name: BRANCH_NAME_DEFAULT,
    },
  })
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
