import { Card, CardBody, CardType, Link } from '@prisma/client'
import { FetchClient } from '../../../packages/fetcher/src'
import prisma from '../prisma'
import { checkBulletDraft, BulletNode } from '../bullet/node'
import { runBulletOp } from '../bullet/operation'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from '../bullet/types'
import { HashtagDraft, HashtagGroupDraft } from '../hashtag/types'
import { getOrCreateLink, linkToSymbol } from './link'
import { parse } from './symbol'
import { getBotId } from './user'
import { inspect } from 'util'

export type PinBoardCode = 'BUYSELL' | 'VS'

export type PinBoard = {
  pinCode: PinBoardCode
  boardId: number
  pollId?: number
}

/**
 * card head content是以bullet形式儲存，但需要能導出此資料格式
 * 用於讓前端知道有什麼可用的property
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

export type CardHeadContentValueInjected = CardHeadContentValue & {
  pinBoards: PinBoard[]
}

export type CardHeadContent = {
  self: RootBullet
  value: CardHeadContentValue
}

// export type MirrorOperation = BulletOperation

// TODO: 改成用bullet存？ 可以直接用bullet ops
// export type MirrorEntry = {
//   cardSymbol: string
//   cardBodyId: number // 儲存編輯後創的body id，可能與最新body不一樣
//   // op?: MirrorOperation
// }

export type CardBodyContent = {
  value: RootBullet
  // self: RootBullet
  // mirrors?: RootBulletChildless[]
}

export type CardTemplate = {
  name: string
  // headDraft: RootBulletDraft
  bodyDraft: RootBulletDraft
}

export type CardTemplateProps = {
  symbol: string
  template: string
  title: string
  ticker?: string
}

const defaultHashtags: (HashtagDraft | HashtagGroupDraft)[] = [
  { type: 'hashtag-draft', op: 'CREATE', text: '#up' },
  { type: 'hashtag-draft', op: 'CREATE', text: '#down' },
  { type: 'hashtag-draft', op: 'CREATE', text: '#pin' },
]

export const templateTicker: CardTemplate = {
  name: '::Ticker',
  bodyDraft: {
    draft: true,
    op: 'CREATE',
    root: true,
    symbol: '%SYMBOL%',
    head: '%SYMBOL%',
    freeze: true,
    newHashtags: defaultHashtags,
    children: [
      {
        draft: true,
        op: 'CREATE',
        head: '討論區',
        children: [
          {
            draft: true,
            op: 'CREATE',
            head: '提問',
            children: [
              {
                draft: true,
                op: 'CREATE',
                head: '%SYMBOL% 如何操作？',
                newHashtags: [{ op: 'CREATE', type: 'hashtag-group-draft', pollChoices: ['#buy', '#sell', '#hold'] }],
                children: [],
              },
            ],
          },
        ],
      },
      { draft: true, op: 'CREATE', head: '[!]', children: [] },
      { draft: true, op: 'CREATE', head: '[?]', children: [] },
      { draft: true, op: 'CREATE', head: '[*]', children: [] },
      { draft: true, op: 'CREATE', head: '[+]', children: [] },
      { draft: true, op: 'CREATE', head: '[-]', children: [] },
      { draft: true, op: 'CREATE', head: '[vs]', children: [] },
    ],
  },
}

export const templateWebpage: CardTemplate = {
  name: '::Webpage',
  bodyDraft: {
    draft: true,
    op: 'CREATE',
    head: '%SYMBOL%',
    freeze: true,
    root: true,
    symbol: '%SYMBOL%',
    newHashtags: defaultHashtags,
    children: [
      {
        draft: true,
        op: 'CREATE',
        head: '筆記區',
        children: [],
      },
    ],
  },
}

const regexReplaceMather = /%([A-Z_]+)%/gm

/**
 * (Recursive) 將Bullet draft的內容依照給予的card template properties替換掉
 */
export function replaceBulletDraft<T extends BulletDraft | RootBulletDraft>(node: T, props: CardTemplateProps): T {
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
    symbol: 'symbol' in node ? node.symbol.replace(regexReplaceMather, _replacer) : undefined,
    children: node.children?.map(e => replaceBulletDraft(e, props)),
  }
}

async function batchCreateBullet() {
  // TODO
}

export async function getLatestCardBody(cardId: number): Promise<CardBody | null> {
  return await prisma.cardBody.findFirst({
    where: { cardId },
    orderBy: { createdAt: 'desc' },
  })
}

// export async function getCurrentCardHead(cardId: number): Promise<CardHead | null> {
//   return await prisma.cardHead.findFirst({
//     where: { cardId },
//     orderBy: { createdAt: 'desc' },
//   })
// }

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

// export async function createCardHead(prop: {
//   cardId: number
//   draft: RootBulletDraft
//   userId: string
// }): Promise<CardBody> {
//   const { cardId, draft, userId } = prop
//   const timestamp = Date.now()
//   const cur = await getCurrentCardHead(cardId)
//   const curContent: CardHeadContent | undefined = cur ? JSON.parse(cur.content) : undefined
//   const nextSelf = await runBulletOp({
//     cardId: cardId,
//     current: curContent && curContent.self,
//     draft,
//     timestamp,
//     userId,
//   })
//   const nextContent: CardHeadContent = {
//     self: nextSelf,
//     // TODO: require type guard
//     value: bulletToKeyValue(nextSelf) as CardHeadContentValue,
//   }
//   return await prisma.cardHead.create({
//     data: {
//       timestamp,
//       // TODO: serializer
//       content: JSON.stringify(nextContent),
//       card: { connect: { id: cardId } },
//       user: { connect: { id: userId } },
//       prev: cur ? { connect: { id: cur.id } } : undefined,
//     },
//   })
// }

/**
 * 用於資料庫的建立，不考慮輸入資料的檢查等，內部使用
 */
async function _createCardBody(props: {
  cardId: number
  root: RootBulletDraft
  userId: string
}): Promise<[CardBody, CardBodyContent]> {
  const { cardId, root, userId } = props

  const timestamp = Date.now()
  const cur = await getLatestCardBody(cardId)
  const curContent: CardBodyContent | undefined = cur ? JSON.parse(cur.content) : undefined

  const nextRoot = await runBulletOp({
    cardId: cardId,
    current: curContent && curContent.value,
    draft: root,
    timestamp,
    userId,
  })

  const nextContent: CardBodyContent = { value: nextRoot }

  const body = await prisma.cardBody.create({
    data: {
      timestamp,
      content: JSON.stringify(nextContent), // TODO: serializer
      card: { connect: { id: cardId } },
      user: { connect: { id: userId } },
      prev: cur ? { connect: { id: cur.id } } : undefined,
    },
  })
  return [body, nextContent]
}

/**
 * 檢查 card body 的 value draft，若檢驗有問題，throws 錯誤
 * @returns 若檢驗沒問題，返回 bullet input
 * @throws 檢驗失敗時告知 error
 */
async function checkDraft(draft: RootBulletDraft): Promise<{
  cardSymbol: string
  cardId?: number
  curValue?: Bullet
  draft: RootBulletDraft
}> {
  const symbol = draft.symbol

  // draft沒有op，不用create，返回
  if (!BulletNode.hasAnyOp(draft)) {
    // console.log(`${symbol}的draft沒有op，不用create，返回`)
    // return { cardSymbol: symbol }
    console.error(inspect(draft, { depth: null }))
    throw new Error('draft沒有op')
  }

  // 檢查是否有card，沒有的話需要創
  // TODO: 1. 需要增加template 2. 適合在這裡創卡嗎？
  // const card = await getOrCreateCardBySymbol(symbol)

  const card = await prisma.card.findUnique({ where: { symbol } })
  if (card === null) {
    throw new Error('用draft創新卡功能還沒implemented')
  }
  // if (cardCreated) {
  //   const merged = mergeTree(root, body.root)
  //   const checked = checkBulletInput(root, cur)
  //   return checked
  // }

  const body = await getLatestCardBody(card.id)
  if (body === null) {
    throw new Error('找不到 body，第一次創卡無法使用 checkDraft()')
  }
  const curContent: CardBodyContent = JSON.parse(body.content)

  return {
    cardId: card.id,
    cardSymbol: symbol,
    curValue: curContent.value,
    draft: {
      ...draft,
      children: draft.children.map(e => checkBulletDraft(e, curContent.value)),
    },
  }
}

/**
 * 創card body的標準method，針對self, mirrors一起輸入創建，會進行輸入資料的檢查，
 * 沒問題後先創mirrors的card body，再創self的card body
 *
 * 步驟：
 * - 檢查此卡片是否允許mirrors
 * - 對每個mirror，做完以下步驟後存成entry
 *   - 沒有op，代表此mirror無更新，忽略
 *   - 是新卡，創card、創body
 *   - 非新卡，創body
 * - 對mirrors本身增加、刪除
 *   - TODO: 需記錄標示
 * - 儲存
 *   - self有更新？ -> 存新的self、或存cur self
 *   - mirrors有更新？ -> 存新的mirros、或存cur mirrors
 *   - self, mirrors皆無更新 -> 不儲存
 *
 * @throws 輸入資料有問題時會報錯，用try-catch方式創card body
 */
export async function createCardBody(props: {
  cardId: number
  root: RootBulletDraft
  userId: string
}): Promise<[CardBody, CardBodyContent]> {
  const { cardId, root, userId } = props

  // if (self === undefined && mirrors === undefined) {
  //   throw new Error('self、mirrors需至少要給一個')
  // }

  const body = await getLatestCardBody(cardId)
  if (body === null) {
    throw new Error('Card body not found')
  }
  const card = await prisma.card.findUnique({ where: { id: cardId } })
  if (card === null) {
    throw new Error('Card not found')
  }

  // if (mirrors && card.type !== CardType.WEBPAGE) {
  //   // 檢查此卡片是否允許mirrors
  //   throw new Error('Card not allow to have mirrors')
  // }

  const checked = root && (await checkDraft(root))
  // const checkedMirrors = mirrors && (await Promise.all(mirrors.map(async e => await checkDraft(e))))

  // const bodyContent: CardBodyContent = JSON.parse(body.content)
  // 若mirror有更新，創mirror body並更新entry，沒有更新的返回原entry
  // TODO: 目前忽略了將mirror entry被刪除的情況 -> 會直接從entries移除
  // const nextMirrors: RootBulletChildless[] | undefined =
  //   checkedMirrors &&
  //   (
  //     await Promise.all(
  //       checkedMirrors.map(async (checked): Promise<RootBulletChildless | undefined> => {
  //         if (checked.draft === undefined) {
  //           // 沒有draft，代表雖然有此mirror但沒更新，找current mirror填補，若找不到表示新增了一個symbol，但卻沒有更新，忽略此mirror
  //           return bodyContent.mirrors?.find(e => e.symbol === checked.cardSymbol)
  //         }
  //         if (checked.cardId && checked.draft) {
  //           const [body, bodyContent] = await _createCardBody({
  //             cardId: checked.cardId,
  //             self: checked.draft,
  //             userId,
  //           })
  //           // mirror不需要完全記錄原本的node，因為會依symbol, body id抓原本的bullet
  //           return {
  //             id: bodyContent.self.id,
  //             timestamp: bodyContent.self.timestamp,
  //             userIds: bodyContent.self.userIds,
  //             head: bodyContent.self.head,
  //             root: true,
  //             mirror: true,
  //             symbol: bodyContent.self.symbol,
  //             cardBodyId: body.id,
  //             children: [],
  //           }
  //         }
  //         return undefined
  //       }),
  //     )
  //   ).filter((e): e is RootBulletChildless => e !== undefined)

  // 更新self
  return await _createCardBody({
    cardId: card.id,
    root: checked.draft,
    userId,
  })
}

export async function attachLatestHeadBody(card: Card): Promise<
  Card & {
    // head: CardHead
    body: CardBody
  }
> {
  // const head = await getCurrentCardHead(card.id)
  const body = await getLatestCardBody(card.id)
  if (body) {
    return { ...card, body }
  } else {
    throw new Error('card沒有對應的head/body，需要先創head/body')
  }
}

/**
 * 僅供內部使用，會載入 template 並創第一個 card body
 */
async function _createCard(props: {
  link?: Link
  symbol: string
  template: CardTemplate
  templateProps: CardTemplateProps
  type: CardType
}): Promise<
  Card & {
    link: Link | null
    // head: CardHead
    body: CardBody
  }
> {
  const { link, symbol, template, templateProps, type } = props
  const card = await prisma.card.create({
    data: {
      link: link && { connect: { id: link.id } },
      type,
      symbol,
    },
    include: { link: true },
  })
  // 依template建card-head, card-body
  // const head = await createCardHead({
  //   cardId: card.id,
  //   draft: replaceBulletDraft(template.headDraft, templateProps),
  //   userId: await getBotId(),
  // })
  const [body] = await _createCardBody({
    cardId: card.id,
    root: replaceBulletDraft(template.bodyDraft, templateProps),
    userId: await getBotId(),
  })
  return { ...card, body }
}

export const templateDict: { [key in CardType]: CardTemplate } = {
  [CardType.TICKER]: templateTicker,
  [CardType.TOPIC]: templateTicker,
  [CardType.WEBPAGE]: templateWebpage,
}

/**
 * 搜尋、創新 symbol card
 * TODO: 當 symbol 為 url 時，應導向 webpage card
 */
export async function getOrCreateCardBySymbol(symbol: string): Promise<
  Card & {
    link: Link | null
    // head: CardHead
    body: CardBody
  }
> {
  const { symbolName, cardType } = parse(symbol)
  const template = templateDict[cardType]
  const card = await prisma.card.findUnique({
    where: { symbol: symbolName },
    include: { link: true },
  })
  if (card === null) {
    return await _createCard({
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
    return {
      ...(await attachLatestHeadBody(card)),
      link: card.link,
    }
  }
}

/**
 * 搜尋、創新 webpage card
 * 若給予的 url 在資料庫中找不到對應的 link，會 fetch url 並創一個 link
 */
export async function getOrCreateCardByUrl({ fetcher, url }: { fetcher?: FetchClient; url: string }): Promise<
  Card & {
    link: Link
    // head: CardHead
    body: CardBody
  }
> {
  const [link, { fetchResult }] = await getOrCreateLink({ fetcher, url })
  const template = templateDict[CardType.WEBPAGE]
  const symbol = linkToSymbol(link)
  const card = link.card
    ? await attachLatestHeadBody(link.card)
    : await _createCard({
        link,
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
