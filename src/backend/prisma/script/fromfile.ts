/** Run: npx ts-node prisma/script/fromfile.ts */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import dotenv from 'dotenv'
import { hash, hashSync } from 'bcryptjs'
import * as PA from '@prisma/client'
import { getOrCreateLink } from '../../src/models/link'
import { getOrCreateCardBySymbol, getOrCreateCardByLink, createCardBody } from '../../src/models/card'
import { splitByUrl, TextEditor } from '../../../lib/editor/src'

const config = dotenv.config()
if (config.error) throw config.error
if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) throw new Error('.env Error')

const SEEDFILE_PATH = resolve(__dirname, '..', 'seed.txt')

const BOT = { email: config.parsed.BOT_EMAIL, password: config.parsed.BOT_PASSWORD }

const TESTUSERS = [
  { email: 'aaa@aaa.com', password: 'aaa' },
  { email: 'bbb@bbb.com', password: 'bbb' },
  { email: 'ccc@ccc.com', password: 'ccc' },
  { email: 'ddd@ddd.com', password: 'ddd' },
  { email: 'eee@eee.com', password: 'eee' },
]

const prisma = new PA.PrismaClient({
  // errorFormat: 'pretty',
  // log: ['query', 'info', 'warn'],
})

function load(filepath: string): [string, string][] {
  return (
    splitByUrl(readFileSync(filepath, { encoding: 'utf8' }))
      .filter((e): e is [string, string] => e[0] !== undefined)
      // .map(e => [e[0], `\n${e[1].trim()}`])
      .map(e => [e[0], e[1].trim()])
  )
}

async function main() {
  console.log('-- 清空Databse')
  await prisma.$executeRaw(
    'TRUNCATE "User", "Oauthor", "Symbol", "Link", "Anchor", "Cocard", "Ocard", "Selfcard", "CardBody" CASCADE;',
  )

  console.log('-- 創Users')
  await prisma.user.create({
    data: { email: BOT.email, password: await hash(BOT.password, 10) },
  })
  const testusers = await prisma.$transaction(
    TESTUSERS.map(e =>
      prisma.user.create({
        data: { email: e.email, password: hashSync(e.password, 10) },
      }),
    ),
  )

  for (const [url, body] of load(SEEDFILE_PATH)) {
    if (url === undefined) {
      continue
    }

    console.log('--- 創web-card')
    // eslint-disable-next-line no-await-in-loop
    const [link] = await getOrCreateLink(url)
    // eslint-disable-next-line no-await-in-loop
    const card = await getOrCreateCardByLink(link)

    const editor = new TextEditor(card.body.text, link.url)
    editor.setBody(body)
    editor.flush()

    console.log('--- 創nested-symbol-card')
    for (const [cardlabel, markerlines] of editor.getNestedMarkerLines()) {
      // eslint-disable-next-line no-await-in-loop
      const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
      const nestedEditor = new TextEditor(nestedCard.body.text)
      nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
      nestedEditor.flush()

      // eslint-disable-next-line no-await-in-loop
      await createCardBody(nestedCard, nestedEditor, testusers[0].id)
    }

    // 必須在最後才創root-card，不然markerlines的new標記會被刪除，因為已經儲存
    // eslint-disable-next-line no-await-in-loop
    await createCardBody(card, editor, testusers[0].id)
  }
}
// console.log('start')

main()
  .catch(e => {
    console.error(e)
  })
  .finally(async () => {
    process.exit()
  })
