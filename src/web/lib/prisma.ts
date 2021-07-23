import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices
// https://github.com/nextauthjs/next-auth/issues/824

const prismaClientPropertyName = `__prevent-name-collision__prisma`

type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient
}

function getPrismaClient(): PrismaClient {
  if (process.env.NODE_ENV === `production`) {
    return new PrismaClient()
  } else {
    console.log('Creating global prisma client')
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[prismaClientPropertyName]) {
      newGlobalThis[prismaClientPropertyName] = new PrismaClient()
    }
    return newGlobalThis[prismaClientPropertyName]
  }
}

const prisma = getPrismaClient()

export default prisma
