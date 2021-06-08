/* eslint-disable no-await-in-loop */
/** Run: yarn ts-node prisma/script/fromfile.ts */
import { lstatSync, readdirSync, readFileSync } from 'fs'
import { resolve, join } from 'path'
import { Link, PrismaClient } from '@prisma/client'
import { splitByUrl } from '../../../packages/editor/src'
import { FetchClient } from '../../../packages/fetcher/src'
import { getOrCreateLink } from '../../lib/models/link'
import { getOrCreateCardByLink } from '../../lib/models/card'
import { createWebCardBody } from '../../lib/models/card-body'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'

const IGNORE_FILE_STARTS_WITH = '_'

const seedDirPath = resolve(process.cwd(), process.argv[2])
const fetcher = new FetchClient(resolve(process.cwd(), process.argv[2], '_local-cache.dump.json'))
const prisma = new PrismaClient({ errorFormat: 'pretty' })

async function main() {
  console.log('-- 清空Databse')
  await prisma.$executeRaw(
    'TRUNCATE "User", "Oauthor", "Symbol", "Link", "Anchor", "Cocard", "Ocard", "Selfcard", "CardBody" CASCADE;',
  )

  console.log('-- 創test-users')
  await createTestUsers(prisma)

  for (const filename of readdirSync(seedDirPath).sort()) {
    if (filename.startsWith(IGNORE_FILE_STARTS_WITH)) {
      console.log(`Skip: ${filename}`)
      continue
    }

    const filepath = join(seedDirPath, filename)
    console.log(`-- seed file: ${filepath}`)

    for (const [url, body] of splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))) {
      let link: Link
      try {
        console.log(`創web-card ${url}`)
        const [_link] = await getOrCreateLink(url, fetcher)
        link = _link
        console.log(`link created`)
      } catch (err) {
        console.error(err)
        continue
      }
      const card = await getOrCreateCardByLink(link)
      console.log(`card created`)
      await createWebCardBody(card.id, body, TESTUSERS[0].id)
      console.log(`card body created`)
    }
  }
}

main()
  .catch(err => {
    console.error(err)
    throw new Error()
  })
  .finally(async () => {
    console.log('finished, closing primsa')
    fetcher.dump()
    prisma.$disconnect()
    process.exit()
  })
