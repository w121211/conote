import dotenv from 'dotenv'
import { hash, hashSync } from 'bcryptjs'
import { PrismaClient, SymbolCat } from '@prisma/client'
// import omitDeep from 'omit-deep-lodash'
import { omitUndefined } from '../../lib/editor/src/test-helper'
<<<<<<< HEAD
=======

>>>>>>> backend-dev
/**
 * See: https://github.com/lodash/lodash/issues/723
 * Recursively remove keys from an object
 * @param {object} input
 * @param {Array<number | string>>} excludes
 * @return {object}
 */
function omitDeep(input: Record<string, unknown>, excludes: Array<number | string>): Record<string, unknown> {
  return Object.entries(input).reduce<Record<string, unknown>>((acc, [key, value]) => {
    const shouldExclude = excludes.includes(key)
    if (shouldExclude) return acc

    if (Array.isArray(value)) {
      const arrValue = value
      const nextValue = arrValue.map(arrItem => {
        if (typeof arrItem === 'object') {
          return omitDeep(arrItem, excludes)
        }
        return arrItem
      })
      acc[key] = nextValue
      return acc
    } else if (typeof value === 'object') {
      acc[key] = omitDeep(value as Record<string, unknown>, excludes)
      return acc
    }

    acc[key] = value

    return acc
  }, {})
}

<<<<<<< HEAD
export function clean(obj: Record<string, unknown>): Record<string, unknown> {
  return omitUndefined(omitDeep(obj, ['createdAt', 'updatedAt']))
=======
export function clean(obj: Record<string, unknown> | null): Record<string, unknown> | null {
  return obj === null ? obj : omitUndefined(omitDeep(obj, ['createdAt', 'updatedAt']))
>>>>>>> backend-dev
}

const config = dotenv.config()

if (config.error) throw config.error

if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) {
  throw new Error('BOT_EMAIL or BOT_PASSWORD not found in .env')
}

export const BOT = { id: 'bot', email: config.parsed.BOT_EMAIL, password: config.parsed.BOT_PASSWORD }

export const TESTUSERS = [
  { id: 'test-user-1', email: 'aaa@aaa.com', password: 'aaa' },
  { id: 'test-user-2', email: 'bbb@bbb.com', password: 'bbb' },
  { id: 'test-user-3', email: 'ccc@ccc.com', password: 'ccc' },
  { id: 'test-user-4', email: 'ddd@ddd.com', password: 'ddd' },
  { id: 'test-user-5', email: 'eee@eee.com', password: 'eee' },
]

export const TESTOAUTHORS = [{ name: 'test-oauthor-1' }]

export const TEST_SYMBOLS = [
  { name: '$AAA', cat: SymbolCat.TICKER },
  { name: '$ABB', cat: SymbolCat.TICKER },
  { name: '$ACC', cat: SymbolCat.TICKER },
  { name: '$BBB', cat: SymbolCat.TICKER },
  { name: '$CCC', cat: SymbolCat.TICKER },
  { name: '$DDD', cat: SymbolCat.TICKER },
  { name: '[[Apple]]', cat: SymbolCat.TOPIC },
  { name: '[[Google]]', cat: SymbolCat.TOPIC },
  { name: '[[蘋果]]', cat: SymbolCat.TOPIC },
  { name: '[[估狗]]', cat: SymbolCat.TOPIC },
  { name: '[[Apple love Google]]', cat: SymbolCat.TOPIC },
  { name: '[[Google hate Apple]]', cat: SymbolCat.TOPIC },
]

export async function createTestUsers(prisma: PrismaClient): Promise<void> {
  await prisma.user.create({
    data: { id: BOT.id, email: BOT.email, password: await hash(BOT.password, 10) },
  })
  await prisma.$transaction(
    TESTUSERS.map(e =>
      prisma.user.create({
        data: { id: e.id, email: e.email, password: hashSync(e.password, 10) },
      }),
    ),
  )
  await prisma.$transaction(
    TESTOAUTHORS.map(e =>
      prisma.oauthor.create({
        data: { name: e.name },
      }),
    ),
  )
}

export async function createTestSymbols(prisma: PrismaClient): Promise<void> {
  await prisma.$transaction(
    TEST_SYMBOLS.map(e =>
      prisma.symbol.create({
        data: { name: e.name, cat: e.cat },
      }),
    ),
  )
}
