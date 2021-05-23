/**
 * 1. 僅用於初始資料庫建立
 * 2. 作為server-side的測試demo
 * Run: npm run seed
 */
import dotenv from 'dotenv'
import { hash } from 'bcryptjs'
import * as PA from '@prisma/client'
import { getOrCreateCardBySymbol, createCardBody } from '../../lib/models/card'
import { Editor } from '../../../lib/editor/src'

const config = dotenv.config()
if (config.error) {
  throw config.error
}
if (!config.parsed?.BOT_EMAIL || !config.parsed?.BOT_PASSWORD) {
  throw new Error('Error')
}

const BOT = { email: config.parsed.BOT_EMAIL, password: config.parsed.BOT_PASSWORD }

// --- Fake data for test

const TESTUSER = { email: 'aaa@aaa.com', password: 'aaa' }
const OAUTHOR = {
  name: '@aaa:youtube',
  link: { url: 'http://url.of.webpage0', domain: 'somedomain.com' },
  links: ['[Youtube](http://link.to.channel)'],
  srcTitle: 'Some author title',
}
const SRC = {
  url: 'http://url.of.webpage1',
  domain: 'somedomain.com',
  srcTitle: 'Some webpage title 1',
  srcAuthor: '@aaa:youtube',
  srcPublishDate: '2011-08-12T',
  srcId: 'aaa',
  srcType: PA.SrcType.VIDEO,
}

const NOTE = `////// 這篇的重點 //////
[_作者] someone
[_key] #廢文 #新聞 [[Some Topic]] $AA $BB

[重點]
- 用一句話解釋：
- 問題：
- 解決方法：
- 新穎性：

////// 這篇的內容筆記 //////

[[TOPIC FOR NESTED]]

$AA
[+]
Plus 1
[-]
Minus 1
[?] BUY@12

這是一個沒有marker的文字，這部分該如何處理？

////// 社群意見(你、社群的觀點) //////
(這裡可以允許任意文字，不必一定要是marker)
(marker的好處只是在於「」)

[反駁]
-反駁1
-反駁2
`

const NOTE2 = `////// 這篇的重點 //////
[_作者] someone
[_key] #廢文 #新聞 [[Some Topic]] $AA $BB

[重點]
- 用一句話解釋：
- 問題：
- 解決方法：
- 新穎性：

////// 這篇的內容筆記 //////

[[TOPIC FOR NESTED]]

$AA
[+]
Plus 2
[-]
Minus 2
[?] BUY@12

這是一個沒有marker的文字，這部分該如何處理？

////// 社群意見(你、社群的觀點) //////
(這裡可以允許任意文字，不必一定要是marker)
(marker的好處只是在於「」)

[反駁]
-反駁1
-反駁2
`

const NESTED_CARD = `

$BB
[+]
Plus 1
[-]
Minus 1

[_key] [[AAA]] [[BBB]] $AAA $BBB #CCC
[?] BUY vs SELL
[+]
abcdef
[-]

[替代] $BB $CC
`

const prisma = new PA.PrismaClient({
  // errorFormat: 'pretty',
  // log: ['query', 'info', 'warn'],
})

function insert<T>(item: T, arr: T[], i: number): T[] {
  return [...arr.slice(0, i), item, ...arr.slice(i)]
}

function createNotesFromFile(filepath: string) {
  /** Bulk create: 讀檔 > 用URL分出每個note > 依序parse, 存入note */
}

async function testWebpageOps() {
  console.log('----- 新增Webpage cocard -----')

  console.log('1. Fetch: 分析source url -> oauthor, contentType, contentTitle, ...')
  // const [link, { fetched }] = await getOrCreateLink('https://www.youtube.com/watch?v=XVX4DNuV62s', BOT.email)
  const fetched = {
    domain: SRC.domain,
    resolvedUrl: SRC.url,
    oauthorName: SRC.srcAuthor,
    srcId: SRC.srcId,
    srcType: SRC.srcType,
    srcTitle: SRC.srcTitle,
    srcPublishDate: SRC.srcPublishDate,
  }

  console.log('2. Fetch後，新增oauthor, link, cocard & 將meta存入web-card')

  // const markers: MK.Marker[] = [];
  // if (fetched.srcTitle) {
  //   markers.push({ mark: MK.MARKER_FORMAT.srcTitle.mark, value: fetched.srcTitle });
  // }
  // if (fetched.srcPublishDate) {
  //   markers.push({ mark: MK.MARKER_FORMAT.srcPublishDate.mark, value: fetched.srcPublishDate });
  // }
  // const head = MK.markersToText(markers, MK.WEBPAGE_HEAD_FORMATTER);

  const oauthor = fetched.oauthorName
    ? await prisma.oauthor.upsert({
        where: { name: fetched.oauthorName },
        create: { name: fetched.oauthorName },
        // update留空等同於getOrCreate
        update: {},
      })
    : undefined
  const link = await prisma.link.create({
    data: {
      url: fetched.resolvedUrl,
      domain: fetched.domain,
      srcId: fetched.srcId,
      srcType: fetched.srcType,
      oauthor: oauthor ? { connect: { id: oauthor.id } } : undefined,
      cocard: {
        create: {
          template: PA.CardTemplate.WEBPAGE,
          meta: {},
          body: { create: { text: '', user: { connect: { email: BOT.email } } } },
        },
      },
    },
  })

  console.log('3. 編輯後的text -> tokenize -> stamp -> line-metas，將text存成新的CardBody，並建立anchors')

  const note = await prisma.cocard.findUnique({
    where: { linkUrl: link.url },
  })
  if (note === null) throw new Error()

  const editor = new TextEditor()
  editor.setBody(NOTE)
  editor.flush()
  await createCardBody(note, editor, TESTUSER.email)

  console.log('4. 同步儲存存nested-card, 包括ticker-card, oauthor-ticker-card')

  for (const [cardlabel, markerLines] of editor.getNestedMarkerLines()) {
    // 若找不到symbol會直接創新的
    // eslint-disable-next-line no-await-in-loop
    const card = await getOrCreateCardBySymbol(cardlabel.symbol)
    const editor = new TextEditor(card.body.text)
    editor.flush()
    console.log(editor.getBody())
    for (const e of markerLines) {
      console.log(e)
      editor.insertMarkerLine(e)
    }
    console.log(editor.getBody())
    // editor.flush();
    // eslint-disable-next-line no-await-in-loop
    await createCardBody(card, editor, TESTUSER.email)
  }
}

async function main() {
  console.log('-- 清空Databse')
  await prisma.$executeRaw(
    'TRUNCATE "User", "Oauthor", "Symbol", "Link", "Anchor", "Cocard", "Ocard", "Selfcard", "CardBody" CASCADE;',
  )

  console.log('-- Insert users')
  await prisma.user.create({
    data: { email: BOT.email, password: await hash(BOT.password, 10) },
  })
  await prisma.user.create({
    data: { email: TESTUSER.email, password: await hash(TESTUSER.password, 10) },
  })

  // console.log('-- Insert symbols');
  // const tickers = await prisma.$transaction(
  //   TICKERS.map(e => prisma.symbol.create({ data: { name: e.symbol, cat: PA.SymbolCat.TICKER } })),
  // );
  // const topics = await prisma.$transaction(
  //   TOPICS.map(e => prisma.symbol.create({ data: { name: e.symbol, cat: PA.SymbolCat.TOPIC } })),
  // );

  await testWebpageOps()

  console.log('-- All done!')
}

function testEditor() {
  const editor = new TextEditor()
  editor.setBody(NESTED_CARD)
  editor.insertMarkerLine({
    linenumber: 1,
    str: 'string; // 這行實際的值（原封不動）',
    // userId?: string;
    // anchorId?: number;
    // stampId?: string;
    // new?: true; // 沒有stamp，視為新的一行
    // broken?: true; // 有stamp，但損毀
    // src?: string; // 對網頁做筆記時，紀錄該網頁的url，視為來源
    marker: {
      mark: '[insert]',
      value: 'string;string;string;string;string;string;',
      // error?: string;
    },
  })
  editor.insertMarkerLine({
    linenumber: 1,
    str: 'string; // 這行實際的值（原封不動）',
    // userId: 'userId',
    // anchorId?: number;
    // stampId?: string;
    // new?: true; // 沒有stamp，視為新的一行
    // broken?: true; // 有stamp，但損毀
    // src?: string; // 對網頁做筆記時，紀錄該網頁的url，視為來源
    marker: {
      mark: '[insert]',
      value: 'string;string;string;string;string;string;',
      // error?: string;
    },
  })
  console.log(editor.getBody())

  editor.flush()
  editor.flush()

  // console.log(editor.getMarkerLines());
  console.log(editor.getBody())
}

// testEditor();

// main()
//   .catch(e => {
//     console.error(e)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//     process.exit()
//   })

const body = `
[key]
[?] (這行留空) %Jrd %iKS %psv
[+]
收購金額龐大：$750百萬 - $3十億 %a9g
主席Jim Ross ，SPDR基金主席，SPY創始人，黃金ETF GLD創始人 %57c
收購對象：金融科技公司，可能是比特幣 %f1n
可能是BlockFi：交易電子貨幣，用戶可從自己的加密貨幣裡賺取利息的公司，可抵押電子貨幣貸款美金 %Utz
BlockFi去年成長十倍，營收達1億美元 %5vE
2021年第1季宣布收購對象 %kFy
[-]
[Alternative]
[Q]

[]
70股@11.11，目標130股 %MNF
`

async function test() {
  const card = await prisma.cocard.findUnique({
    where: { linkUrl: '//$FUSE' },
    include: { body: true },
  })
  if (card === null) throw new Error('')

  const editor = new TextEditor(card.body.text, card.linkUrl)
  editor.setBody(body)
  editor.flush()

  const rootBody = await createCardBody(card, editor, 'cklm5zebz00077cqsubeoo8lk')

  // TODO: 1. 只有web-card才需要處理nested 2. 這裡的logic可以移到card.ts

  for (const [cardlabel, markerLines] of editor.getNestedMarkerLines()) {
    // 若找不到symbol會直接創新的
    // eslint-disable-next-line no-await-in-loop
    const card = await getOrCreateCardBySymbol(cardlabel.symbol)
    const editor = new TextEditor(card.body.text)
    editor.flush()
    for (const e of markerLines) {
      // console.log(e)
      editor.insertMarkerLine(e)
    }
    // console.log(editor.getBody())
    // eslint-disable-next-line no-await-in-loop
    await createCardBody(card, editor, 'cklm5zebz00077cqsubeoo8lk')
  }

  return rootBody
}

test().catch(e => {
  console.error(e)
})
