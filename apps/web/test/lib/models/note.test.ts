/**
 * yarn run test-lib note.test
 */
/* eslint-disable no-await-in-loop */
// import _ from 'lodash'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Note, PrismaClient } from '@prisma/client'
// import { getOrCreateNoteBySymbol, getOrCreateNoteByLink, NoteMeta } from '../note'
import { FetchClient } from '../../../lib/fetcher/fetch-client'
import { NoteModel } from '../../../lib/models/note-model'
import prisma from '../../../lib/prisma'
import { clean } from '../../test-helpers'

const sampleFilepath = resolve(__dirname, '__samples__', 'common.txt')

// const params: NoteTemplateParams = {
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
let note: Note

// beforeAll(async () => {
//   console.log('Writing required data into database')
//   const _prisma = new PrismaClient()
//   await createTestUsers(_prisma)
//   note = await _prisma.note.create({
//     data: {
//       meta?: JsonNullValueInput | InputJsonValue
//     createdAt?: Date | string
//     updatedAt?: Date | string
//     sym: SymCreateNestedOneWithoutNoteInput
//     link?: LinkCreateNestedOneWithoutNoteInput
//     states?: NoteStateCreateNestedManyWithoutNoteInput
//     emojis?: NoteEmojiCreateNestedManyWithoutNoteInput
//       type: NoteTy.TICKER,
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
//     noteId: note.id,
//     input: input0,
//     // prevDict,
//     timestamp: 111111111,
//     userId: TESTUSERS[0].id,
//   })
//   expect(clean(root0)).toMatchSnapshot()
// })

// test('createNoteBody()', async () => {
//   const body0 = await createNoteBody({ noteId: note.id, bulletInputRoot: input0 }, TESTUSERS[0].id)
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

//   const body1 = await createNoteBody({ noteId: note.id, bulletInputRoot: input1 }, TESTUSERS[1].id)
//   console.log(body1)
//   expect(clean({ ...body1, content: omitDeep(JSON.parse(body1.content), ['timestamp']) })).toMatchSnapshot()
// })

// test('createNote()', async () => {
//   const { note, body } = await createNote({ name: '$BBB', template: templateTicker, title: 'BBB Company' })
//   expect(clean(note)).toMatchSnapshot()
//   expect(clean({ ...body, content: omitDeep(JSON.parse(body.content), ['timestamp']) })).toMatchSnapshot()
// })

it.each(['https://zhuanlan.zhihu.com/p/75120221', 'https://www.mobile01.com/topicdetail.php?f=793&t=6520838'])(
  'getOrCreateByUrl()',
  async url => {
    const note = await NoteModel.getOrCreateByUrl({ url: url })
    expect(clean(note)).toMatchSnapshot()
  },
)

// test('create a symbol note', async () => {
//   const note = await createNote('$AA')
//   // const discussBoard = await prisma.comment.findUnique({
//   //   where: { id: (note.meta as unknown as NoteMeta).commentId },
//   // })
//   expect(clean(note)).toMatchSnapshot()
//   // expect(clean(discussBoard)).toMatchSnapshot()
//   // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
// })

// test('create a symbol note body', async () => {
//   const note = await getOrCreateNoteBySymbol('$AA')
//   const editor = new Editor(note.body.text)
//   editor.setText(`[?] <BUY> @30
// [+]
// 111 111
// 222 222`)
//   editor.flush()

//   await createNoteBody(note, editor, TESTUSERS[0].id)
//   const temp = await prisma.conote.findUnique({
//     where: { id: note.id },
//     include: { body: true },
//   })
//   expect(clean(temp)).toMatchSnapshot()
//   // expect(_clean(editor.getMarkerlines())).toMatchSnapshot()
// })

// test('create a blank web note', async () => {
//   const [link] = await getOrCreateLink('http://test1.com')
//   const note = await getOrCreateNoteByLink(link)
//   expect(clean(note)).toMatchSnapshot()
// })

// test('edit a web note', async () => {
//   const note = await prisma.conote.findUnique({
//     where: { linkUrl: 'http://test1.com' },
//     include: { body: true },
//   })
//   if (note === null) throw new Error()

//   const editor = new Editor(note.body.text)
//   editor.setText(`[*]
// 2021年會有進一步財政刺激
// 歷年有1月效應，1月份呈現反彈，但不認為`)
//   editor.flush()

//   await createNoteBody(note, editor, TESTUSERS[0].id)
//   const temp = await prisma.conote.findUnique({
//     where: { id: note.id },
//     include: { body: true },
//   })
//   expect(clean(temp)).toMatchSnapshot()
// })

// test('create a nested web-note', async () => {
//   const [link, { fetchResult }] = await getOrCreateLink('http://test2.com')
//   const note = await getOrCreateNoteByLink(link)

//   const editor = new Editor(
//     note.body.text,
//     note.body.meta as unknown as Markerline[],
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

//   for (const [notelabel, markerlines] of editor.getNestedMarkerlines()) {
//     const nestedNote = await getOrCreateNoteBySymbol(notelabel.symbol)
//     const nestedEditor = new Editor(
//       nestedNote.body.text,
//       nestedNote.body.meta as unknown as Markerline[],
//       link.url,
//       TESTOAUTHORS[0].name,
//     )
//     nestedEditor.setMarkerlinesToInsert(markerlines.filter(e => e.new && !e.neatReply))
//     nestedEditor.flush()
//     console.log(nestedEditor.getText())
//     console.log(nestedEditor.getMarkerlines())

//     await createNoteBody(nestedNote, nestedEditor, TESTUSERS[1].id)
//   }

//   await createNoteBody(note, editor, TESTUSERS[1].id)

//   expect((await getOrCreateNoteByLink(link)).body.text).toMatchSnapshot()
//   expect(clean((await getOrCreateNoteByLink(link)).body.meta as unknown as Record<string, unknown>)).toMatchSnapshot()
//   expect((await getOrCreateNoteBySymbol('$CC')).body.text).toMatchSnapshot()
//   expect(
//     clean((await getOrCreateNoteBySymbol('$CC')).body.meta as unknown as Record<string, unknown>),
//   ).toMatchSnapshot()
//   expect((await getOrCreateNoteBySymbol('$DD')).body.text).toMatchSnapshot()
//   expect(
//     clean((await getOrCreateNoteBySymbol('$DD')).body.meta as unknown as Record<string, unknown>),
//   ).toMatchSnapshot()

//   // await createNoteBody(note, editor, TESTUSERS[1].id)

//   // const rootNote = await prisma.conote.findUnique({
//   //   where: { id: note.id },
//   //   include: { body: true },
//   // })
//   // expect(omitDeep(rootNote ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   // const nestedNote = await prisma.conote.findUnique({
//   //   where: { linkUrl: '//$ABBV' },
//   //   include: { body: true },
//   // })
//   // if (nestedNote === null) throw new Error()
//   // expect(omitDeep(nestedNote ?? {}, ['createdAt', 'updatedAt'])).toMatchSnapshot()

//   // const markerlines = new TextEditor(nestedNote.body.text).getMarkerlines()
//   // expect(markerlines).toMatchSnapshot()
// })

// test.each(
//   splitByUrl(readFileSync(sampleFilepath, { encoding: 'utf8' }))
//     .filter((e): e is [string, string] => e[0] !== undefined)
//     .map(e => [e[0].trim(), e[1].trim()]),
// )('Create web note from common.txt', async (url: string, body: string) => {
//   if (url === undefined) return

//   const [link] = await getOrCreateLink(url, fetcher)
//   const note = await getOrCreateNoteByLink(link)
//   expect((await createWebNoteBody(note.id, body, TESTUSERS[0].id)).text).toMatchSnapshot()
//   // expect((await createWebNoteBody(note.id, body, TESTUSERS[0].id)).meta).toMatchSnapshot()
// })
