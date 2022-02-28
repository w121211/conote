// import { hash, hashSync } from 'bcryptjs'
import { create, isEqual } from 'lodash'
import { faker } from '@faker-js/faker'
import { PrismaClient } from '@prisma/client'
import { NodeChange, TreeChangeService, TreeNode } from '@conote/docdiff'
import { Bullet } from '../components/bullet/bullet'
import { getBotEmail } from '../lib/models/user-model'
import { CommitModel } from '../lib/models/commit-model'

// fake incremental id
let i = 0
const fid = () => {
  i++
  return i.toString()
}

const TEST_DISCUSSES = [
  { id: 'testdiscuss0', title: faker.lorem.lines(1), content: faker.lorem.paragraph(), userId: 'testuser0' },
  { id: 'testdiscuss1', title: faker.lorem.lines(1), userId: 'testuser1' },
]

const TEST_POSTS = [
  { userId: 'testuser0', content: faker.lorem.paragraph() },
  { userId: 'testuser1', content: faker.lorem.paragraph() },
  { userId: 'testuser2', content: faker.lorem.paragraph() },
]

export const BOT = { id: 'bot', email: getBotEmail() }

export const TESTUSERS = [
  { id: 'testuser0', email: 'aaa@aaa.com', password: 'aaa' },
  { id: 'testuser1', email: 'bbb@bbb.com', password: 'bbb' },
  { id: 'testuser2', email: 'ccc@ccc.com', password: 'ccc' },
  { id: 'testuser3', email: 'ddd@ddd.com', password: 'ddd' },
  { id: 'testuser4', email: 'eee@eee.com', password: 'eee' },
]

export const TESTAUTHORS = [{ name: 'test-author-1' }]

// --- Tree values ---

export const bt = (cid: number, children: TreeNode<Bullet>[] = []): TreeNode<Bullet> => {
  return {
    cid: cid.toString(),
    data: { id: cid.toString(), cid: cid.toString(), head: `${cid}${cid}${cid}` },
    children,
  }
}

// const isBulletEqual = (a: Bullet, b: Bullet) => {
// }

// const CARD_STATES: CardStateParsed[] = []

// export const TEST_SYMBOLS = [
//   { name: '$AAA', cat: SymbolCat.TICKER },
//   { name: '$ABB', cat: SymbolCat.TICKER },
//   { name: '$ACC', cat: SymbolCat.TICKER },
//   { name: '$BBB', cat: SymbolCat.TICKER },
//   { name: '$CCC', cat: SymbolCat.TICKER },
//   { name: '$DDD', cat: SymbolCat.TICKER },
//   { name: '[[Apple]]', cat: SymbolCat.TOPIC },
//   { name: '[[Google]]', cat: SymbolCat.TOPIC },
//   { name: '[[蘋果]]', cat: SymbolCat.TOPIC },
//   { name: '[[估狗]]', cat: SymbolCat.TOPIC },
//   { name: '[[Apple love Google]]', cat: SymbolCat.TOPIC },
//   { name: '[[Google hate Apple]]', cat: SymbolCat.TOPIC },
// ]

export const TestDataHelper = {
  createDiscusses: async (prisma: PrismaClient): Promise<void> => {
    await prisma.$transaction(
      TEST_DISCUSSES.map(e =>
        prisma.discuss.create({
          data: {
            id: e.id,
            userId: e.userId,
            title: e.title,
            content: e.content,
            count: { create: {} },
            posts: { createMany: { data: TEST_POSTS } },
          },
        }),
      ),
    )
  },

  createUsers: async (prisma: PrismaClient): Promise<void> => {
    await prisma.user.create({
      // data: { id: BOT.id, email: BOT.email, password: await hash(BOT.password, 10) },
      data: { id: BOT.id, email: BOT.email },
    })
    await prisma.$transaction(
      TESTUSERS.map(e =>
        prisma.user.create({
          // data: { id: e.id, email: e.email, password: hashSync(e.password, 10) },
          data: { id: e.id, email: e.email },
        }),
      ),
    )
    await prisma.$transaction(
      TESTAUTHORS.map(e =>
        prisma.author.create({
          data: { name: e.name },
        }),
      ),
    )
  },

  createCommits: async (): Promise<void> => {
    const v: TreeNode<Bullet>[][] = [[], [bt(0)], [bt(1, [bt(3), bt(4)]), bt(2)]]

    const values: [TreeNode<Bullet>[], TreeNode<Bullet>[], NodeChange<Bullet>[]][] = [
      [v[0], v[1]],
      [v[1], v[2]],
    ].map(([s, f]) => [s, f, TreeChangeService.getChnages(f, s, isEqual)])

    const commit0 = await CommitModel.create(
      {
        cardStateInputs: [
          {
            cid: '$AA',
            prevStateId: null,
            cardInput: { symbol: '$AA' },
            value: values[0][1],
            changes: values[0][2],
          },
        ],
      },
      TESTUSERS[0].id,
    )
    const state0 = commit0.commit.cardStates[0]
    if (state0 === undefined) {
      throw 'createCommits(): state0 === undefined'
    }

    const commit1 = await CommitModel.create(
      {
        cardStateInputs: [
          {
            cid: '$AA',
            prevStateId: state0.id,
            cardId: state0.cardId,
            value: values[1][1],
            changes: values[1][2],
          },
          {
            cid: '$BB',
            prevStateId: null,
            // sourceCardId: state0.cardId,
            cardInput: { symbol: '$BB' },
            value: values[0][1],
            changes: values[0][2],
          },
          {
            cid: '$CC',
            prevStateId: null,
            // sourceCardId: state0.cardId,
            cardInput: { symbol: '$CC' },
            value: values[0][1],
            changes: values[0][2],
          },
        ],
      },
      TESTUSERS[0].id,
    )
  },
}

// export async function createTestSymbols(prisma: PrismaClient): Promise<void> {
//   await prisma.$transaction(
//     TEST_SYMBOLS.map(e =>
//       prisma.symbol.create({
//         data: { name: e.name, cat: e.cat },
//       }),
//     ),
//   )
// }

/**
 * Recursively remove keys from an object
 * Source: https://github.com/lodash/lodash/issues/723
 *
 * @param {object} input
 * @param {Array<number | string>>} excludes
 * @return {object}
 */
export const omitDeep = (input: Record<string, unknown>, excludes: Array<number | string>): Record<string, unknown> => {
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
    } else if (typeof value === 'object' && value !== null) {
      acc[key] = omitDeep(value as Record<string, unknown>, excludes)
      return acc
    }

    acc[key] = value

    return acc
  }, {})
}

const omitUndefined = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj))
}

export const clean = (obj: Record<string, unknown> | null): Record<string, unknown> | null => {
  return obj === null ? obj : omitUndefined(omitDeep(obj, ['createdAt', 'updatedAt', 'id', 'symId', 'cardId']))
}
