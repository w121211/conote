// import * as _ from 'lodash';
// import dayjs from 'dayjs';
import * as PA from '@prisma/client'
import { prisma } from '../context'
import { getBotEmail } from './user'
import { getOrCreateSymbol, symbolToUrl, SYMBOL_DOMAIN } from './symbol'
import { TextEditor, MarkToConnectedContentRecord } from '../../../lib/editor/src'

interface CardTemplate {
  body: string
  connContents: MarkToConnectedContentRecord
}

export interface CardMeta {
  symbol?: string
  // 紀錄marker-line與connected-content（poll, comment, etc)
  conn: MarkToConnectedContentRecord
  // 每個card都帶有一個comment作為discuss-board
  commentId: number
}

const TEMPLATE: Record<PA.CardTemplate, CardTemplate> = {
  [PA.CardTemplate.TICKER]: {
    body: `[=]
[?:poll] <買> vs <賣>
[+]
[-]
[VS]
- [[<$AAA> vs <$BBB>]]
- [[<$AAA> vs <$CCC>]]
[Q]
`,
    connContents: { '[?:poll]': { poll: true, pollChoices: ['買', '賣'] } },
  },
  [PA.CardTemplate.TOPIC]: {
    body: `[=]
[?:poll] <看多> vs <看空>
[+]
[-]
[Q]`,
    connContents: { '[?:poll]': { comment: true, pollChoices: ['看多', '看空'] } },
  },
  [PA.CardTemplate.WEBPAGE]: {
    body: '',
    connContents: {},
  },
}

const SYMBOL_TO_TEMPLATE: Record<PA.SymbolCat, PA.CardTemplate> = {
  [PA.SymbolCat.TICKER]: PA.CardTemplate.TICKER,
  [PA.SymbolCat.TOPIC]: PA.CardTemplate.TOPIC,
}

export async function createConnectedContents(
  contents: MarkToConnectedContentRecord,
): Promise<MarkToConnectedContentRecord> {
  const record: MarkToConnectedContentRecord = {}
  for (const k in contents) {
    const e = contents[k]
    if (e.poll && e.pollChoices) {
      // eslint-disable-next-line no-await-in-loop
      const comment = await prisma.comment.create({
        data: {
          // parse marker-value作為poll的內文及選項
          text: k,
          user: { connect: { email: getBotEmail() } },
          count: { create: {} },
          poll: {
            create: {
              choices: e.pollChoices,
              user: { connect: { email: getBotEmail() } },
              count: { create: {} },
            },
          },
        },
        include: { poll: true },
      })
      record[k] = { ...e, commentId: comment.id, pollId: comment.poll?.id }
    } else if (e.comment) {
      // eslint-disable-next-line no-await-in-loop
      const comment = await prisma.comment.create({
        data: {
          // 直接用marker作為text
          text: k,
          user: { connect: { email: getBotEmail() } },
          count: { create: {} },
        },
      })
      record[k] = { ...e, commentId: comment.id }
    }
  }
  return record
}

async function createCard(
  template: PA.CardTemplate,
  symbol?: PA.Symbol,
  link?: PA.Link,
): Promise<
  PA.Cocard & {
    link: PA.Link
    body: PA.CardBody
  }
> {
  if (symbol === undefined && link === undefined) {
    throw new Error('`symbol`或`link`需要有其中一個')
  }
  const conn = await createConnectedContents(TEMPLATE[template].connContents)

  // 創body，因為是第一次創，不使用`createCardBody()`
  // 將connected-contents加到markerlines中
  const editor = new TextEditor()
  editor.setBody(TEMPLATE[template].body)
  editor.flush()
  editor.addConnectedContents(conn)
  const body = await prisma.cardBody.create({
    data: {
      text: editor.toStoredText(),
      user: { connect: { email: getBotEmail() } },
    },
  })

  // 創card專屬comment
  const cardComment = await prisma.comment.create({
    data: {
      text: '',
      user: { connect: { email: getBotEmail() } },
      count: { create: {} },
    },
  })

  // 創meta
  const meta: CardMeta = {
    symbol: symbol ? symbol.name : undefined,
    conn,
    commentId: cardComment.id,
  }

  // 創card, link
  return await prisma.cocard.create({
    data: {
      template,
      meta: meta as Record<string, any>,
      body: { connect: { id: body.id } },
      link: symbol
        ? { create: { url: symbolToUrl(symbol.name), domain: SYMBOL_DOMAIN } }
        : { connect: { id: (link as PA.Link).id } },
    },
    include: {
      link: true,
      body: true,
    },
  })
}

export async function createCardBody(card: PA.Cocard, editor: TextEditor, userId: string): Promise<PA.CardBody> {
  const creaters: PA.Prisma.Prisma__AnchorClient<PA.Anchor>[] = []
  for (const e of editor.getMarkerlines()) {
    if (e.comment && e.commentId && e.marker?.value) {
      // TODO: 對comment創reply
      // await prisma.reply.create({})
    }
    if (e.new && e.stampId) {
      // 創anchor
      creaters.push(
        prisma.anchor.create({
          data: {
            // user: { connect: { email: userEmail } },
            user: { connect: { id: userId } },
            cocard: { connect: { id: card.id } },
            // cocard: isOcard(card) ? undefined : { connect: { id: card.id } },
            // ocard: isOcard(card) ? { connect: { id: card.id } } : undefined,
            count: { create: {} },
            path: e.stampId,
          },
        }),
      )
    }
  }
  const anchors = (await prisma.$transaction([...creaters])) as PA.Anchor[]
  editor.addAnchors(
    anchors.map(e => {
      if (e.path === null) throw new Error()
      return { ...e, stamp: e.path }
    }),
  )

  // 創新body，連結prev-body（prev-body會自動與cocard斷開連結）
  return await prisma.cardBody.create({
    data: {
      text: editor.toStoredText(),
      user: { connect: { id: userId } },
      cocard: { connect: { id: card.id } },
      prev: { connect: { id: card.bodyId } },
    },
  })
}

export async function getOrCreateCardBySymbol(
  symbolName: string,
): Promise<
  PA.Cocard & {
    link: PA.Link
    body: PA.CardBody
  }
> {
  const found = await prisma.cocard.findUnique({
    where: { linkUrl: symbolToUrl(symbolName) },
    include: { link: true, body: true },
  })
  if (found) {
    return { ...found }
    // const [text, linemetas] = splitMetatext(card.body.text);
    // return { ...card, body: { ...card.body, text, linemetas } };
  }

  // 沒找到cocard，創一個，同步創link
  const [symbol] = await getOrCreateSymbol(symbolName)
  return await createCard(SYMBOL_TO_TEMPLATE[symbol.cat], symbol)
}

export async function getOrCreateCardByLink(
  link: PA.Link,
): Promise<
  PA.Cocard & {
    link: PA.Link
    body: PA.CardBody
  }
> {
  // 找cocard
  const found = await prisma.cocard.findUnique({
    where: { linkUrl: link.url },
    include: { link: true, body: true },
  })
  if (found) {
    return found
    // const [text, linemetas] = splitMetatext(card.body.text);
    // return { ...card, body: { ...card.body, text, linemetas } };
  }

  // 沒找到cocard，創一個
  return await createCard(PA.CardTemplate.WEBPAGE, undefined, link)
}
