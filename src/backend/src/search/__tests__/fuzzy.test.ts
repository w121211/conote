/* eslint-disable no-await-in-loop */
// import _ from 'lodash'
import { hash, hashSync } from 'bcryptjs'
import { PrismaClient } from '@prisma/client'
import { prisma } from '../../index'
// import { getOrCreateLink } from '../models/link'
// import { getOrCreateCardBySymbol, getOrCreateCardByLink, CardMeta } from '../models/card'
// import { createCardBody } from '../models/card-body'
// import { Editor, Markerline } from '../../../lib/editor/src'
// import { prisma } from '../context'
import { _clean, BOT, TESTUSERS, TESTOAUTHORS } from '../../test-helper'

// jest.mock('chance', () => {
//   return {
//     Chance: jest.fn().mockImplementation(() => {
//       return {
//         i: 0,
//         string(): string {
//           const str = this.i.toString(36).padStart(3, '0')
//           this.i += 1
//           if (this.i >= 36 * 36 * 36) {
//             this.i = 0
//           }
//           return str
//         },
//       }
//     }),
//   }
// })

beforeAll(async () => {
  // Write required data for db
  const _prisma = new PrismaClient()
  await _prisma.user.create({
    data: { id: BOT.id, email: BOT.email, password: await hash(BOT.password, 10) },
  })
  await _prisma.$transaction(
    TESTUSERS.map(e =>
      prisma.user.create({
        data: { id: e.id, email: e.email, password: hashSync(e.password, 10) },
      }),
    ),
  )
  await _prisma.$transaction(
    TESTOAUTHORS.map(e =>
      prisma.oauthor.create({
        data: { name: e.name },
      }),
    ),
  )
  _prisma.$disconnect()
})

afterAll(async () => {
  prisma.$disconnect()
})

// --- Test Entry ---

test('create a symbol card', async () => {
  const card = await getOrCreateCardBySymbol('$AA')
  const discussBoard = await prisma.comment.findUnique({
    where: { id: ((card.meta as unknown) as CardMeta).commentId },
  })
  expect(_clean(card)).toMatchSnapshot()
  expect(_clean(discussBoard)).toMatchSnapshot()
  // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
})

test('create a symbol card body', async () => {
  const card = await getOrCreateCardBySymbol('$AA')
  const editor = new Editor(card.body.text)
  editor.setText(`[?] <BUY> @30
[+]
111 111
222 222`)
  editor.flush()

  await createCardBody(card, editor, TESTUSERS[0].id)
  const temp = await prisma.cocard.findUnique({
    where: { id: card.id },
    include: { body: true },
  })
  expect(_clean(temp)).toMatchSnapshot()
  // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
})

test('create a blank web card', async () => {
  const [link] = await getOrCreateLink('http://test1.com')
  const card = await getOrCreateCardByLink(link)
  expect(_clean(card)).toMatchSnapshot()
})

test('edit a web card', async () => {
  const card = await prisma.cocard.findUnique({
    where: { linkUrl: 'http://test1.com' },
    include: { body: true },
  })
  if (card === null) throw new Error()

  const editor = new Editor(card.body.text)
  editor.setText(`[*]
2021年會有進一步財政刺激
歷年有1月效應，1月份呈現反彈，但不認為`)
  editor.flush()

  await createCardBody(card, editor, TESTUSERS[0].id)
  const temp = await prisma.cocard.findUnique({
    where: { id: card.id },
    include: { body: true },
  })
  expect(_clean(temp)).toMatchSnapshot()
})

test('create a nested web-card', async () => {
  const [link, { fetched }] = await getOrCreateLink('http://test2.com')
  const card = await getOrCreateCardByLink(link)

  const editor = new Editor(
    card.body.text,
    (card.body.meta as unknown) as Markerline[],
    'http://test2.com',
    TESTOAUTHORS[0].name,
  )
  editor.setText(`$CC
[?] <BUY> @30
[+]
111 111
222 222

$DD
[?] <SELL> @30`)
  editor.flush()

  for (const [cardlabel, markerlines] of editor.getNestedMarkerlines()) {
    const nestedCard = await getOrCreateCardBySymbol(cardlabel.symbol)
    const nestedEditor = new Editor(
      nestedCard.body.text,
      (nestedCard.body.meta as unknown) as Markerline[],
      link.url,
      TESTOAUTHORS[0].name,
    )
    nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
    nestedEditor.flush()
    console.log(nestedEditor.getText())
    console.log(nestedEditor.getMarkerlines())

    await createCardBody(nestedCard, nestedEditor, TESTUSERS[1].id)
  }

  await createCardBody(card, editor, TESTUSERS[1].id)

  expect(_clean((await getOrCreateCardByLink(link)).body.text)).toMatchSnapshot()
  expect(_clean((await getOrCreateCardByLink(link)).body.meta)).toMatchSnapshot()
  expect(_clean((await getOrCreateCardBySymbol('$CC')).body.text)).toMatchSnapshot()
  expect(_clean((await getOrCreateCardBySymbol('$CC')).body.meta)).toMatchSnapshot()
  expect(_clean((await getOrCreateCardBySymbol('$DD')).body.text)).toMatchSnapshot()
  expect(_clean((await getOrCreateCardBySymbol('$DD')).body.meta)).toMatchSnapshot()

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
