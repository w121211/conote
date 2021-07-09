import { inspect } from 'util'
import { Board, BoardStatus, Card, CardBody, CardHead, CardType, Link, Poll } from '@prisma/client'
import { FetchClient } from '../../../packages/fetcher/src'
import prisma from '../prisma'
import { bulletToDict, runBulletInputOp } from '../bullet-tree/node'
import { Bullet, BulletInput, BulletPinCode } from '../bullet-tree/types'
import { getOrCreateLink, linkToSymbol } from './link'
import { parseSymbol } from './symbol'
import { getBotId } from './user'
// import { getOrCreateLink } from './link'

/**
 * 用於讓前端知道有什麼可用的property
 * card-head-content是以bullet形式儲存，但需能導出此資料格式
 */
export type CardHeadContentValue = {
  template: string
  title: string
  keywords: string[]
  tags: string[]

  // links
  link?: {
    official?: string
    yahooFinance?: string
    sec?: string
    wiki?: string
  }

  // pins
  pinPrice?: true
}

export type PinBoard = {
  pinCode: BulletPinCode
  boardId: number
  pollId?: number
}

export type CardHeadContentValueInjected = CardHeadContentValue & {
  pinBoards: PinBoard[]
}

export type CardHeadContent = {
  root: Bullet
  value: CardHeadContentValue
}

export type NestedCardEntry = {
  cardSymbol: string
  cardBodyId: number
}

export type CardBodyContent = {
  root: Bullet
  nestedCards?: NestedCardEntry[]
}

export type CardTemplate = {
  name: string
  headRoot: BulletInput
  bodyRoot: BulletInput
}

export type CardTemplateProps = {
  symbol: string
  template: string
  title: string
  ticker?: string
}

export const templateTicker: CardTemplate = {
  name: '::Ticker',
  headRoot: {
    head: '_%SYMBOL%',
    freeze: true,
    freezeChildren: true,
    op: 'CREATE',
    children: [
      { head: 'template', body: '::Ticker', keyvalue: true, op: 'CREATE' },
      { head: 'title', body: '%TITLE%', keyvalue: true, op: 'CREATE' },
      { head: 'keywords', body: '', keyvalue: true, valueArray: true, op: 'CREATE' },
      { head: 'tags', body: '', keyvalue: true, valueArray: true, op: 'CREATE' },
      { head: 'pinPrice', body: 'true', freeze: true, keyvalue: true, valueBoolean: true, op: 'CREATE' },
    ],
  },
  bodyRoot: {
    head: '%SYMBOL%',
    freeze: true,
    op: 'CREATE',
    children: [
      {
        head: '[!]',
        freeze: true,
        op: 'CREATE',
        // children: [{ head: '', placeholder: 'a placeholder test', template: true }],
      },
      {
        head: '[?]',
        freeze: true,
        op: 'CREATE',
        children: [
          {
            head: `%SYMBOL% <BUY> <SELL> <WATCH>`,
            pin: true,
            pinCode: 'BUYSELL',
            poll: true,
            pollChoices: ['BUY', 'SELL', 'WATCH'],
            freeze: true,
            op: 'CREATE',
            hashtags: [{ text: '#Answer', linkBullet: true, op: 'CREATE' }],
          },
        ],
      },
      { head: '[*]', freeze: true, op: 'CREATE' },
      { head: '[+]', freeze: true, op: 'CREATE' },
      { head: '[-]', freeze: true, op: 'CREATE' },
    ],
  },
}

export const templateWebpage: CardTemplate = {
  name: '::Webpage',
  headRoot: {
    head: '_%SYMBOL%',
    freeze: true,
    op: 'CREATE',
    children: [
      { head: 'template', body: '::Webpage', keyvalue: true, op: 'CREATE' },
      { head: 'title', body: '%TITLE%', keyvalue: true, op: 'CREATE' },
      { head: 'keywords', body: '', keyvalue: true, valueArray: true, op: 'CREATE' },
      { head: 'tags', body: '', keyvalue: true, valueArray: true, op: 'CREATE' },
    ],
  },
  bodyRoot: {
    head: '%SYMBOL%',
    freeze: true,
    op: 'CREATE',
    children: [
      {
        head: '[!]',
        freeze: true,
        op: 'CREATE',
        // children: [{ head: '', placeholder: 'a placeholder test', template: true }],
      },
      {
        head: '[?]',
        freeze: true,
        op: 'CREATE',
        children: [
          {
            head: `%SYMBOL% <BUY> <SELL> <WATCH>`,
            pin: true,
            pinCode: 'BUYSELL',
            poll: true,
            pollChoices: ['BUY', 'SELL', 'WATCH'],
            freeze: true,
            op: 'CREATE',
            hashtags: [{ text: '#Answer', linkBullet: true, op: 'CREATE' }],
          },
        ],
      },
      { head: '[*]', freeze: true, op: 'CREATE' },
      { head: '[+]', freeze: true, op: 'CREATE' },
      { head: '[-]', freeze: true, op: 'CREATE' },
    ],
  },
}

const regexReplaceMather = /%([A-Z_]+)%/gm

export function replaceBulletInput(node: BulletInput, props: CardTemplateProps): BulletInput {
  function _keyIn(key: string, props: CardTemplateProps): key is keyof CardTemplateProps {
    return key in props
  }

  function _replacer(match: string, p1: string): string {
    if (p1) {
      const k = p1.toLowerCase()
      if (_keyIn(k, props)) return props[k] ?? ''
    }
    console.error(p1)
    throw new Error(`props未包含需要的variable: ${p1}}`)
  }

  return {
    ...node,
    head: node.head.replace(regexReplaceMather, _replacer),
    body: node.body?.replace(regexReplaceMather, _replacer),
    children: node.children?.map(e => replaceBulletInput(e, props)),
  }
}

async function batchCreateBullet() {
  // TODO
}

async function getCurrentCardBody(cardId: number): Promise<CardBody | null> {
  return await prisma.cardBody.findFirst({
    where: { cardId },
    orderBy: { createdAt: 'desc' },
  })
}

async function getCurrentCardHead(cardId: number): Promise<CardHead | null> {
  return await prisma.cardHead.findFirst({
    where: { cardId },
    orderBy: { createdAt: 'desc' },
  })
}

function serializeContent() {
  // TODO
}

function deserializeContent() {
  // TODO
}

// type NestedRecord = Record<string, string | string[] | boolean | undefined | Record<string, string | string[] | boolean | undefined>>

interface KeyValue<T> {
  [k: string]: T | KeyValue<T>
}

function bulletToKeyValue(node: Bullet): KeyValue<string | string[] | boolean | undefined> {
  if (node.children && node.children.length > 0) {
    const obj: KeyValue<string | string[] | boolean | undefined> = {}
    for (const e of node.children) {
      const kv = bulletToKeyValue(e)
      if (e.head in kv) {
        obj[e.head] = kv[e.head]
      }
    }
    return obj
  }
  if (node.keyvalue) {
    if (node.valueBoolean) {
      return { [node.head]: node.body === 'true' }
    }
    if (node.valueArray) {
      return { [node.head]: node.body?.split(' ') }
    }
    return { [node.head]: node.body }
  }
  return {}
}

export async function createCardHead({
  cardId,
  rootInput,
  userId,
}: {
  cardId: number
  rootInput: BulletInput
  userId: string
}): Promise<CardBody> {
  const cur = await getCurrentCardHead(cardId)
  const curDict = cur ? bulletToDict(JSON.parse(cur.content)) : undefined

  // Run bullet op
  const timestamp = Date.now()
  const root = await runBulletInputOp({
    cardId: cardId,
    input: rootInput,
    curDict,
    timestamp,
    userId,
  })
  if (root === null) {
    throw new Error()
  }

  // TODO: serializer
  const content: CardHeadContent = {
    root,
    // TODO: require type guard
    value: bulletToKeyValue(root) as CardHeadContentValue,
  }

  return await prisma.cardHead.create({
    data: {
      timestamp,
      content: JSON.stringify(content),
      card: { connect: { id: cardId } },
      user: { connect: { id: userId } },
      prev: cur ? { connect: { id: cur.id } } : undefined,
    },
  })
}

export async function createCardBody({
  cardId,
  nestedCards,
  rootInput,
  userId,
}: {
  cardId: number
  nestedCards?: NestedCardEntry[]
  rootInput: BulletInput
  userId: string
}): Promise<CardBody> {
  const cur = await getCurrentCardBody(cardId)
  const curContent: CardBodyContent = cur && JSON.parse(cur.content)
  const curDict = curContent && bulletToDict(curContent.root)

  // Run bullet op
  const timestamp = Date.now()
  const root = await runBulletInputOp({
    cardId: cardId,
    input: rootInput,
    curDict,
    timestamp,
    userId,
  })
  if (root === null) {
    throw new Error()
  }

  // TODO: serializer
  const content: CardBodyContent = { root, nestedCards }

  return await prisma.cardBody.create({
    data: {
      timestamp,
      content: JSON.stringify(content),
      card: { connect: { id: cardId } },
      user: { connect: { id: userId } },
      prev: cur ? { connect: { id: cur.id } } : undefined,
    },
  })
}

export async function attachLatestHeadBody(card: Card): Promise<
  Card & {
    head: CardHead
    body: CardBody
  }
> {
  const head = await getCurrentCardHead(card.id)
  const body = await getCurrentCardBody(card.id)
  if (head && body) {
    return { ...card, head, body }
  } else {
    throw new Error('card沒有對應的head/body，需要先創head/body')
  }
}

async function createCard({
  symbol,
  template,
  templateProps,
  type,
}: {
  symbol: string
  template: CardTemplate
  templateProps: CardTemplateProps
  type: CardType
}): Promise<
  Card & {
    head: CardHead
    body: CardBody
  }
> {
  const card = await prisma.card.create({
    data: { type, symbol },
  })

  // 依template建card-head, card-body
  const head = await createCardHead({
    cardId: card.id,
    rootInput: replaceBulletInput(template.headRoot, templateProps),
    userId: await getBotId(),
  })
  const body = await createCardBody({
    cardId: card.id,
    rootInput: replaceBulletInput(template.bodyRoot, templateProps),
    userId: await getBotId(),
  })

  return { ...card, head, body }
}

const templateDict: { [key in CardType]: CardTemplate } = {
  [CardType.TICKER]: templateTicker,
  [CardType.TOPIC]: templateTicker,
  [CardType.WEBPAGE]: templateWebpage,
}

/**
 * 搜尋、創新symbol card
 * TODO: 當symbol為url時，應導向webpage card
 */
export async function getOrCreateCardBySymbol(symbol: string): Promise<
  Card & {
    head: CardHead
    body: CardBody
  }
> {
  const { symbolName, cardType, oauthorName } = parseSymbol(symbol)
  const template = templateDict[cardType]
  const card = await prisma.card.findUnique({ where: { symbol: symbolName } })

  if (card === null) {
    return await createCard({
      symbol: symbolName,
      template: template,
      templateProps: {
        symbol: symbolName,
        template: template.name,
        title: '',
      },
      type: cardType,
    })
  } else {
    return await attachLatestHeadBody(card)
  }
}

/**
 * 搜尋、創新webpage card，若給予的url找不到對應的link，會fetch url並創一個link
 */
export async function getOrCreateCardByUrl({ fetcher, url }: { fetcher?: FetchClient; url: string }): Promise<
  Card & {
    link: Link
    head: CardHead
    body: CardBody
  }
> {
  const [link, { fetchResult }] = await getOrCreateLink({ fetcher, url })
  const template = templateDict[CardType.WEBPAGE]
  const symbol = linkToSymbol(link)
  const card = link.card
    ? await attachLatestHeadBody(link.card)
    : await createCard({
        symbol,
        template: template,
        templateProps: {
          symbol,
          template: template.name,
          title: fetchResult?.srcTitle ?? '',
        },
        type: CardType.WEBPAGE,
      })

  return { ...card, link }
}
