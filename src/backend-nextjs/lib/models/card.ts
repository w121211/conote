/* eslint-disable no-await-in-loop */
// import * as _ from 'lodash';
// import dayjs from 'dayjs';
import { CardBody, CardTemplate, Cocard, Link, Symbol as PrismaSymbol, SymbolCat } from '@prisma/client'
import { Editor } from '../../../lib/editor/src'
import prisma from '../prisma'
import { getBotId } from './user'
import { getOrCreateSymbol, symbolToUrl, SYMBOL_DOMAIN } from './symbol'
import { CommentMeta } from './comment'
import { createCardBody } from './card-body'

export interface CardMeta {
  symbol?: string
  // 每個card都自帶一個comment作為discuss-board
  commentId: number
  // 自帶、不可改的markerlines
  // staticMarkerlines: Markerline[]
}

const TEMPLATE: Record<CardTemplate, string> = {
  [CardTemplate.TICKER]: `[~]
[?]
<BUY> <SELL>
[+]
[-]`,
  [CardTemplate.TOPIC]: `[~]
[?]
<LONG> <SHORT>
[+]
[-]`,
  [CardTemplate.WEBPAGE]: '',
}

const SYMBOL_TO_TEMPLATE: Record<SymbolCat, CardTemplate> = {
  [SymbolCat.TICKER]: CardTemplate.TICKER,
  [SymbolCat.TOPIC]: CardTemplate.TOPIC,
}

/** 用於首次創卡，僅內部使用，外部用`getOrCreateCard...` */
async function createCard(
  template: CardTemplate,
  symbol?: PrismaSymbol,
  link?: Link,
): Promise<
  Cocard & {
    link: Link
    body: CardBody
  }
> {
  if (symbol === undefined && link === undefined) {
    throw new Error('`symbol`或`link`需要有其中一個')
  }
  const botId = await getBotId()

  // 創card，有了card-id才能創關聯的comments，meta, body都是暫時的
  const card = await prisma.cocard.create({
    data: {
      template,
      meta: {},
      body: { create: { meta: [], text: '', user: { connect: { id: botId } } } },
      link: symbol
        ? { create: { url: symbolToUrl(symbol.name), domain: SYMBOL_DOMAIN } }
        : { connect: { id: (link as Link).id } },
    },
  })

  // 創card-body
  const editor = new Editor()
  editor.setText(TEMPLATE[template])
  editor.flush()
  await createCardBody(card, editor, botId)

  // 創card專屬的comment, ie discuss-board
  const discussBoard = await prisma.comment.create({
    data: {
      meta: ({
        cardId: card.id,
        inCardIds: [],
      } as CommentMeta) as Record<string, any>,
      text: '',
      user: { connect: { id: botId } },
      count: { create: {} },
    },
  })

  // 更新card-meta
  return prisma.cocard.update({
    data: {
      meta: ({
        symbol: symbol ? symbol.name : undefined,
        commentId: discussBoard.id,
      } as CardMeta) as Record<string, any>,
    },
    where: { id: card.id },
    include: {
      link: true,
      body: true,
    },
  })
}

export async function getOrCreateCardBySymbol(
  symbolName: string,
): Promise<
  Cocard & {
    link: Link
    body: CardBody
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
  link: Link,
): Promise<
  Cocard & {
    link: Link
    body: CardBody
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
  return await createCard(CardTemplate.WEBPAGE, undefined, link)
}

// export async function createConnectedContents(
//   contents: MarkToConnectedContentRecord,
//   cardId: number,
// ): Promise<MarkToConnectedContentRecord> {
//   const botId = await getBotId()

//   const record: MarkToConnectedContentRecord = {}
//   for (const k in contents) {
//     const e = contents[k]
//     if (e.poll && e.pollChoices) {
//       // eslint-disable-next-line no-await-in-loop
//       const comment = await prisma.comment.create({
//         data: {
//           meta: ({ inCardIds: [cardId] } as CommentMeta) as Record<string, any>,
//           text: k,
//           user: { connect: { id: botId } },
//           count: { create: {} },
//           poll: {
//             create: {
//               choices: e.pollChoices,
//               user: { connect: { id: botId } },
//               count: { create: {} },
//             },
//           },
//         },
//         include: { poll: true },
//       })
//       record[k] = { ...e, commentId: comment.id, pollId: comment.poll?.id }
//     } else if (e.comment) {
//       // eslint-disable-next-line no-await-in-loop
//       const comment = await prisma.comment.create({
//         data: {
//           meta: ({ inCardIds: [cardId] } as CommentMeta) as Record<string, any>,
//           text: k,
//           user: { connect: { id: botId } },
//           count: { create: {} },
//         },
//       })
//       record[k] = { ...e, commentId: comment.id }
//     }
//   }
//   return record
// }
