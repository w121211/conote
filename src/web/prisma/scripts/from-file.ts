/* eslint-disable no-await-in-loop */
/** Run: npx|yarn ts-node prisma/script/fromfile.ts */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'fs'
import { resolve, basename, dirname, join } from 'path'
import dotenv from 'dotenv'
import { hash, hashSync } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { splitByUrl, Editor, Markerline } from '../../../lib/editor/src'
import { FetchClient } from '../../../lib/fetcher/src'
import { getOrCreateLink } from '../../lib/models/link'
import { getOrCreateCardByLink } from '../../lib/models/card'
import { createWebCardBody } from '../../lib/models/card-body'
import { createTestUsers, TESTUSERS } from '../../lib/test-helper'

// const config = dotenv.config({ path: resolve(process.cwd(), '.env.local') })
// if (config.error) throw config.error
// if (!config.parsed?.BOT_EMAIL) throw new Error('BOT_EMAIL not found in .env')

const prisma = new PrismaClient({
  errorFormat: 'pretty',
  // log: ['query', 'info', 'warn'],
})
const fetcher = new FetchClient(resolve(process.cwd(), process.argv[2], 'local-cache.dump.json'))

async function main() {
  console.log('-- 清空Databse')
  await prisma.$executeRaw(
    'TRUNCATE "User", "Oauthor", "Symbol", "Link", "Anchor", "Cocard", "Ocard", "Selfcard", "CardBody" CASCADE;',
  )

  console.log('-- 創test-users')
  await createTestUsers(prisma)

  const seedDirPath = resolve(process.cwd(), process.argv[2])
  console.log(`-- Load seeds from: ${seedDirPath}`)

  for (const filename of readdirSync(seedDirPath).sort()) {
    if (filename.startsWith('_')) {
      console.log(`Skip: ${filename}`)
      continue
    }

    const filepath = join(seedDirPath, filename)
    console.log(`-- seed file: ${filepath}`)

    for (const [url, body] of splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))
      .filter((e): e is [string, string] => e[0] !== undefined)
      .map(e => [e[0].trim(), e[1].trim()])) {
      if (url === undefined) continue

      console.log(`--- 創web-card ${url}`)
      const [link] = await getOrCreateLink(url, fetcher)
      console.log(`link created`)
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
    // fetcher.dump()
    prisma.$disconnect()
    process.exit()
  })
