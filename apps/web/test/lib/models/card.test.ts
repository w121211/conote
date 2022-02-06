/**
 * yarn run test-lib card.test
 */
/* eslint-disable no-await-in-loop */
// import _ from 'lodash'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Card, PrismaClient } from '@prisma/client'
// import { getOrCreateCardBySymbol, getOrCreateCardByLink, CardMeta } from '../card'
import { FetchClient } from '../../../lib/fetcher/fetcher'
import { CardModel } from '../../../lib/models/card-model'
import prisma from '../../../lib/prisma'
import { clean } from '../../test-helpers'

const sampleFilepath = resolve(__dirname, '__samples__', 'common.txt')

// const params: CardTemplateParams = {
//   name: '$AAA',
//   template: templateTicker.name,
//   title: 'AAA Company',
//   ticker: '$AAA',
// }

// const input0: BulletInput = {
//   head: '111',
//   body: '111-111',
//   op: 'create',
//   children: [
//     { head: '222', body: '222-222', op: 'create' },
//     {
//       head: '333',
//       op: 'create',
//       children: [
//         { head: '444', op: 'create' },
//         { head: '555', op: 'create' },
//       ],
//     },
//   ],
// }

let fetcher: FetchClient
let card: Card

// beforeAll(async () => {
//   console.log('Writing required data into database')
//   const _prisma = new PrismaClient()
//   await createTestUsers(_prisma)
//   card = await _prisma.card.create({
//     data: {
//       meta?: JsonNullValueInput | InputJsonValue
//     createdAt?: Date | string
//     updatedAt?: Date | string
//     sym: SymCreateNestedOneWithoutCardInput
//     link?: LinkCreateNestedOneWithoutCardInput
//     states?: CardStateCreateNestedManyWithoutCardInput
//     emojis?: CardEmojiCreateNestedManyWithoutCardInput
//       type: CardTy.TICKER,
//       name: params.name,
//       link: {
//         create: {
//           url: symbolToUrl(params.name),
//           domain: SYMBOL_DOMAIN,
//           srcType: SrcType.OTHER,
//         },
//       },
//     },
//   })
//   await _prisma.$disconnect()
//   console.log('Setting up a fetch-client')
//   fetcher = new FetchClient(resolve(__dirname, 'local-cache.dump.json'))
// })

afterAll(async () => {
  fetcher.dump()
  await prisma.$disconnect()
})

// test('replaceBulletInput()', () => {
//   expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
// })

// test('runBulletInputOp()', async () => {
//   const root0 = await runBulletInputOp({
//     cardId: card.id,
//     input: input0,
//     // prevDict,
//     timestamp: 111111111,
//     userId: TESTUSERS[0].id,
//   })
//   expect(clean(root0)).toMatchSnapshot()
// })

// test('createCardBody()', async () => {
//   const body0 = await createCardBody({ cardId: card.id, bulletInputRoot: input0 }, TESTUSERS[0].id)
//   expect(clean({ ...body0, content: omitDeep(JSON.parse(body0.content), ['timestamp']) })).toMatchSnapshot()

//   const input1: BulletInput = {
//     id: 6,
//     head: '111+++',
//     body: '111-111+++',
//     op: 'update',
//     children: [
//       { id: 7, head: '222', body: '222-222', op: 'delete' },
//       {
//         id: 8,
//         head: '333',
//         children: [{ id: 9, head: '444' }],
//       },
//       { id: 10, head: '555', op: 'move' },
//       { head: '666', op: 'create' },
//     ],
//   }

//   const body1 = await createCardBody({ cardId: card.id, bulletInputRoot: input1 }, TESTUSERS[1].id)
//   console.log(body1)
//   expect(clean({ ...body1, content: omitDeep(JSON.parse(body1.content), ['timestamp']) })).toMatchSnapshot()
// })

// test('createCard()', async () => {
//   const { card, body } = await createCard({ name: '$BBB', template: templateTicker, title: 'BBB Company' })
//   expect(clean(card)).toMatchSnapshot()
//   expect(clean({ ...body, content: omitDeep(JSON.parse(body.content), ['timestamp']) })).toMatchSnapshot()
// })

it.each(['https://zhuanlan.zhihu.com/p/75120221', 'https://www.mobile01.com/topicdetail.php?f=793&t=6520838'])(
  'getOrCreateByUrl()',
  async url => {
    const card = await CardModel.getOrCreateByUrl({ url: url })
    expect(clean(card)).toMatchSnapshot()
  },
)

// test('create a symbol card', async () => {
//   const card = await createCard('$AA')
//   // const discussBoard = await prisma.comment.findUnique({
//   //   where: { id: (card.meta as unknown as CardMeta).commentId },
//   // })
//   expect(clean(card)).toMatchSnapshot()
//   // expect(clean(discussBoard)).toMatchSnapshot()
//   // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
// })

// test('create a symbol card body', async () => {
//   const card = await getOrCreateCardBySymbol('$AA')
//   const editor = new Editor(card.body.text)
//   editor.setText(`[?] <BUY> @30
// [+]
// 111 111
// 222 222`)
//   editor.flush()

//   await createCardBody(card, editor, TESTUSERS[0].id)
//   const temp = await prisma.cocard.findUnique({
//     where: { id: card.id },
//     include: { body: true },
//   })
//   expect(clean(temp)).toMatchSnapshot()
//   // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
// })

// test('create a blank web card', async () => {
//   const [link] = await getOrCreateLink('http://test1.com')
//   const card = await getOrCreateCardByLink(link)
//   expect(clean(card)).toMatchSnapshot()
// })

// test('edit a web card', async () => {
//   const card = await prisma.cocard.findUnique({
//     where: { linkUrl: 'http://test1.com' },
//     include: { body: true },
//   })
//   if (card === null) throw new Error()

//   const editor = new Editor(card.body.text)
//   editor.setText(`[*]
// 2021年會有進一步財政刺激
// 歷年有1月效應，1月份呈現反彈，但不認為`)
//   editor.flush()

//   await createCardBody(card, editor, TESTUSERS[0].id)
//   const temp = await prisma.cocard.findUnique({
//     where: { id: card.id },
//     include: { body: true },
//   })
//   expect(clean(temp)).toMatchSnapshot()
// })

// test('create a nested web-card', async () => {
//   const [link, { fetchResult }] = await getOrCreateLink('http://test2.com')
//   const card = await getOrCreateCardByLink(link)

//   const editor = new Editor(
//     card.body.text,
//     card.body.meta as unknown as Markerline[],
//     'http://test2.com',
//     TESTOAUTHORS[0].name,
//   )
//   editor.setText(`$CC
// [?] <BUY> @30
// [+]
// 111 111
// 222 222

// $DD
// [?] <SELL> @30`)
//   editor.flush()

//   for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
//     const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
//     const nestedEditor = new Editor(
//       nestedCard.body.text,
//       nestedCard.body.meta as unknown as Markerline[],
//       link.url,
//       TESTOAUTHORS[0].name,
//     )
//     nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
//     nestedEditor.flush()
//     console.log(nestedEditor.getText())
//     console.log(nestedEditor.getMarkerlines())

//     await createCardBody(nestedCard, nestedEditor, TESTUSERS[1].id)
//   }

//   await createCardBody(card, editor, TESTUSERS[1].id)

//   expect((await getOrCreateCardByLink(link)).body.text).toMatchSnapshot()
//   expect(clean((await getOrCreateCardByLink(link)).body.meta as unknown as Record<string, unknown>)).toMatchSnapshot()
//   expect((await getOrCreateCardBySymbol('$CC')).body.text).toMatchSnapshot()
//   expect(
//     clean((await getOrCreateCardBySymbol('$CC')).body.meta as unknown as Record<string, unknown>),
//   ).toMatchSnapshot()
//   expect((await getOrCreateCardBySymbol('$DD')).body.text).toMatchSnapshot()
//   expect(
//     clean((await getOrCreateCardBySymbol('$DD')).body.meta as unknown as Record<string, unknown>),
//   ).toMatchSnapshot()

//   // await createCardBody(card, editor, TESTUSERS[1].id)

//   // const rootCard = await prisma.cocard.findUnique({
//   //   where: { id: card.id },
//   //   include: { body: true },
//   // })
//   // expect(omitDeep(rootCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   // const nestedCard = await prisma.cocard.findUnique({
//   //   where: { linkUrl: '//$ABBV' },
//   //   include: { body: true },
//   // })
//   // if (nestedCard === null) throw new Error()
//   // expect(omitDeep(nestedCard ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   // const markerlines = new TextEditor(nestedCard.body.text).getMarkerlines()
//   // expect(markerlines).toMatchSnapshot()
// })

// test.each(
//   splitByUrl(readFileSync(sampleFilepath, { encoding: 'utf8' }))
//     .filter((e): e is [string, string] => e[0] !== undefined)
//     .map(e => [e[0].trim(), e[1].trim()]),
// )('Create web card from common.txt', async (url: string, body: string) => {
//   if (url === undefined) return

//   const [link] = await getOrCreateLink(url, fetcher)
//   const card = await getOrCreateCardByLink(link)
//   expect((await createWebCardBody(card.id, body, TESTUSERS[0].id)).text).toMatchSnapshot()
//   // expect((await createWebCardBody(card.id, body, TESTUSERS[0].id)).meta).toMatchSnapshot()
// })
