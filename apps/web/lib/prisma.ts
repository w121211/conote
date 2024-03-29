import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
// @see
// https://pris.ly/d/help/next-js-best-practices
// https://github.com/nextauthjs/next-auth/issues/824

const prismaClientPropertyName = `__prevent-name-collision__prisma`

type GlobalThisWithPrismaClient = typeof globalThis & {
  [prismaClientPropertyName]: PrismaClient
}

const getPrismaClient = (): PrismaClient => {
  if (process.env.NODE_ENV === 'production') {
    return new PrismaClient()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[prismaClientPropertyName]) {
      console.log('Creating global prisma client')
      newGlobalThis[prismaClientPropertyName] = new PrismaClient()
    }
    return newGlobalThis[prismaClientPropertyName]
  }
}

const prisma = getPrismaClient()

export default prisma
