// import _ from 'lodash'
import omitDeep from 'omit-deep-lodash'
import dotenv from 'dotenv'
import { hash, hashSync } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
// import { prisma, foo } from '../context'
import { getOrCreateLink } from '../models/link'
import { getOrCreateCardBySymbol, getOrCreateCardByLink, createCardBody, createConnectedContents } from '../models/card'
import { TextEditor, MarkToConnectedContentRecord } from '../../../lib/editor/src'
import { prisma } from '../context'

const config = dotenv.config()
if (config.error) throw config.error
if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) {
  throw new Error('BOT_EMAIL or BOT_PASSWORD not found in .env')
}

const BOT = { id: 'bot', email: config.parsed.BOT_EMAIL, password: config.parsed.BOT_PASSWORD }

const TESTUSERS = [
  { id: 'aaa', email: 'aaa@aaa.com', password: 'aaa' },
  { id: 'bbb', email: 'bbb@bbb.com', password: 'bbb' },
  { id: 'ccc', email: 'ccc@ccc.com', password: 'ccc' },
  { id: 'ddd', email: 'ddd@ddd.com', password: 'ddd' },
  { id: 'eee', email: 'eee@eee.com', password: 'eee' },
]

beforeAll(async () => {
  // Write required data for db
  const prisma = new PrismaClient()
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
})

test('create connected items', async () => {
  const connContents: MarkToConnectedContentRecord = { '[?:poll]': { poll: true, pollChoices: ['買', '賣'] } }
  const contents = await createConnectedContents(connContents)
  expect(omitDeep(contents, ['createdAt', 'updatedAt'])).toMatchSnapshot()
})

test('create a symbol-card', async () => {
  const card = await getOrCreateCardBySymbol('$AA')
  expect(omitDeep(card, ['createdAt', 'updatedAt'])).toMatchSnapshot()
  const editor = new TextEditor(card.body.text)
  expect(editor.getMarkerlines()).toMatchSnapshot()
})

test('create a blank web-card', async () => {
  const [link] = await getOrCreateLink('http://test1.com')
  const card = await getOrCreateCardByLink(link)
  expect(omitDeep(card, ['createdAt', 'updatedAt'])).toMatchSnapshot()
})

test('edit an existed web-card', async () => {
  const card = await prisma.cocard.findUnique({
    where: { linkUrl: 'http://test1.com' },
    include: { body: true },
  })
  if (card === null) throw new Error()

  const editor = new TextEditor(card.body.text)
  editor.setBody(`[*]
2021年會有進一步財政刺激
歷年有1月效應，1月份呈現反彈，但不認為`)
  editor.flush()

  await createCardBody(card, editor, TESTUSERS[0].id)
  const temp = await prisma.cocard.findUnique({
    where: { id: card.id },
    include: { body: true },
  })
  expect(omitDeep(temp ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()
})

test('create a nested web-card', async () => {
  const [link] = await getOrCreateLink('http://test2.com')
  const card = await getOrCreateCardByLink(link)

  const editor = new TextEditor(card.body.text)
  editor.setBody(`$ABBV
[~] [[生物技術]]
[+]
@ARK開倉
@巴菲特2020Q4加倉`)
  editor.flush()

  for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
    // eslint-disable-next-line no-await-in-loop
    const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)

    const nestedEditor = new TextEditor(nestedCard.body.text)
    expect(nestedEditor.getMarkerlines()).toMatchSnapshot()
    nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
    nestedEditor.flush()
    expect(nestedEditor.getMarkerlines()).toMatchSnapshot()

    // eslint-disable-next-line no-await-in-loop
    await createCardBody(nestedCard, nestedEditor, TESTUSERS[1].id)
  }
  // await createCardBody(card, editor, TESTUSERS[1].id)

  // const rootCard = await prisma.cocard.findUnique({
  //   where: { id: card.id },
  //   include: { body: true },
  // })
  // expect(omitDeep(rootCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

  // const nestedCard = await prisma.cocard.findUnique({
  //   where: { linkUrl: '//$ABBV' },
  //   include: { body: true },
  // })
  // if (nestedCard === null) throw new Error()
  // expect(omitDeep(nestedCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

  // const markerlines = new TextEditor(nestedCard.body.text).getMarkerlines()
  // expect(markerlines).toMatchSnapshot()
})

// test('create a nested web-card', async () => {
//   const [link] = await getOrCreateLink('http://test2.com')
//   const card = await getOrCreateCardByLink(link)

//   const editor = new TextEditor(card.body.text)
//   editor.setBody(`$ABBV
// [~] [[生物技術]]
// [+]
// @ARK開倉
// @巴菲特2020Q4加倉`)
//   editor.flush()

//   for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
//     // eslint-disable-next-line no-await-in-loop
//     const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
//     const nestedEditor = new TextEditor(nestedCard.body.text)
//     expect(nestedEditor.getMarkerlines()).toMatchSnapshot()
//     nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new))
//     nestedEditor.flush()

//     // eslint-disable-next-line no-await-in-loop
//     await createCardBody(nestedCard, nestedEditor, TESTUSERS[1].id)
//   }
//   await createCardBody(card, editor, TESTUSERS[1].id)

//   const rootCard = await prisma.cocard.findUnique({
//     where: { id: card.id },
//     include: { body: true },
//   })
//   expect(omitDeep(rootCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   const nestedCard = await prisma.cocard.findUnique({
//     where: { linkUrl: '//$ABBV' },
//     include: { body: true },
//   })
//   if (nestedCard === null) throw new Error()
//   expect(omitDeep(nestedCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   const markerlines = new TextEditor(nestedCard.body.text).getMarkerlines()
//   expect(markerlines).toMatchSnapshot()
// })

// --- Use mock

// const symbol = {
//   id: 1,
//   name: 'string',
//   cat: PA.SymbolCat.TICKER,
//   status: PA.SymbolStatus.ACTIVE,
//   createdAt: new Date(),
//   updatedAt: new Date(),
// }

// jest.mock('../context', () => ({
//   prisma: {
//     symbol: {
//       create: jest.fn().mockImplementation(() => symbol),
//     },
//   },
// }))

// test('should mock', async () => {
//   await expect(createDummy()).resolves.toBe(symbol)
// })
