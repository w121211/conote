/* eslint-disable no-await-in-loop */
import { Bullet } from '../../../components/bullet/types'
import prisma from '../../../lib/prisma'
import { clean, TestDataHelper, TESTUSERS } from '../../test-helpers'
import { CardDigestModel } from '../../../lib/models/card-digest'

// let fetcher: FetchClient

beforeAll(async () => {
  console.log('Writing required data into database')
  await TestDataHelper.createUsers(prisma)

  // // console.log('Setting up a fetch-client')
  // // fetcher = new FetchClient(resolve(__dirname, '.cache.fetcher.json'))
})

afterAll(async () => {
  await prisma.$queryRaw`TRUNCATE "Author", "Bullet", "BulletEmoji", "Card", "CardState", "CardEmoji", "Link", "Poll", "Shot", "Sym", "User" CASCADE;`

  // Bug: comment out to prevent rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

it('CardDigestModel.getLatest()', async () => {
  await TestDataHelper.createCommits()

  const digests = await CardDigestModel.getLatest()
  expect(digests.map(e => clean(e))).toMatchSnapshot()
})
