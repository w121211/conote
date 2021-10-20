import { Card, CardBody, CardType, Link } from '.prisma/client'
import { FetchClient } from '../fetcher/fetcher'
import prisma from '../prisma'
import { checkBulletDraft, BulletNode } from '../bullet/node'
import { runBulletOp } from '../bullet/operation'
import { Bullet, isRootBulletDraft, RootBullet, RootBulletDraft } from '../bullet/types'
import { getOrCreateLink, linkToSymbol } from './link'
import { parseSymbol } from './symbol'
import { getBotId } from './user'
import { inspect } from 'util'
import { writeLine } from '../bullet/sim-editor'

export type CardMeta = {
  template?: 'webpage' | 'ticker' | 'topic' | 'vs'
  redirects?: string[]
  duplicates?: string[]
  url?: string
  author?: string
  date?: string
  description?: string
  keywords?: string[]
  // lang?: string
  title?: string
}

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

// const buysellPollAttr: { choices: string[]; meta: PollMeta } = {
//   choices: ['#buy', '#sell', '#hold'],
//   meta: {
//     code: 'buysell',
//   },
// }

export const tickerStarter = ({ symbol }: { symbol: string }): RootBulletDraft => {
  return {
    draft: true,
    op: 'CREATE',
    root: true,
    symbol,
    head: symbol,
    freeze: true,
    children: [
      writeLine('_討論'),
      writeLine('最新[!]'),
      writeLine('簡介[*]'),
      writeLine('優[+]'),
      writeLine('缺[-]'),
      writeLine('比較[vs]'),
    ],
  }
}

export const topicStarter = ({ symbol }: { symbol: string }): RootBulletDraft => {
  return {
    draft: true,
    op: 'CREATE',
    root: true,
    symbol,
    head: symbol,
    freeze: true,
    children: [
      writeLine('_討論'),
      writeLine('最新[!]'),
      writeLine('簡介[*]'),
      writeLine('優[+]'),
      writeLine('缺[-]'),
      writeLine('比較[vs]'),
    ],
  }
}

export const webpageStarter = ({ symbol }: { symbol: string }): RootBulletDraft => ({
  draft: true,
  op: 'CREATE',
  head: symbol,
  freeze: true,
  root: true,
  symbol,
  children: [writeLine('_討論'), writeLine('_筆記')],
})

// const reReplacer = /%([A-Z_]+)%/gm

/**
 * (Recursive) 將Bullet draft的內容依照給予的card template properties替換掉
 */
// export function replaceBulletDraft<T extends BulletDraft | RootBulletDraft>(node: T, props: CardTemplateProps): T {
//   function _keyIn(key: string, props: CardTemplateProps): key is keyof CardTemplateProps {
//     return key in props
//   }

//   function _replacer(match: string, p1: string): string {
//     if (p1) {
//       const k = p1.toLowerCase()
//       if (_keyIn(k, props)) return props[k] ?? ''
//     }
//     console.error(p1)
//     throw new Error(`props未包含需要的variable: ${p1}}`)
//   }

//   return {
//     ...node,
//     head: node.head.replace(reReplacer, _replacer),
//     body: node.body?.replace(reReplacer, _replacer),
//     symbol: 'symbol' in node ? node.symbol.replace(reReplacer, _replacer) : undefined,
//     children: node.children?.map(e => replaceBulletDraft(e, props)),
//   }
// }

export async function getLatestCardBody(cardId: string): Promise<CardBody | null> {
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

// function serializeContent() {
//   // TODO
// }

// function deserializeContent() {
//   // TODO
// }

// interface KeyValue<T> {
//   [k: string]: T | KeyValue<T>
// }

// function bulletToKeyValue(node: Bullet): KeyValue<string | string[] | boolean | undefined> {
//   if (node.children && node.children.length > 0) {
//     const obj: KeyValue<string | string[] | boolean | undefined> = {}
//     for (const e of node.children) {
//       const kv = bulletToKeyValue(e)
//       if (e.head in kv) {
//         obj[e.head] = kv[e.head]
//       }
//     }
//     return obj
//   }
//   if (node.keyvalue) {
//     if (node.valueBoolean) {
//       return { [node.head]: node.body === 'true' }
//     }
//     if (node.valueArray) {
//       return { [node.head]: node.body?.split(' ') }
//     }
//     return { [node.head]: node.body }
//   }
//   return {}
// }

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
async function _createCardBody({
  cardId,
  root,
  userId,
}: {
  cardId: string
  root: RootBulletDraft
  userId: string
}): Promise<[CardBody, CardBodyContent]> {
  const timestamp = Date.now()
  const cur = await getLatestCardBody(cardId)
  const nextRoot = await runBulletOp({
    cardId: cardId,
    current: cur ? (cur.content as unknown as CardBodyContent).value : undefined,
    draft: root,
    timestamp,
    userId,
  })
  const nextContent: CardBodyContent = { value: nextRoot }
  const body = await prisma.cardBody.create({
    data: {
      timestamp,
      // content: JSON.stringify(nextContent), // TODO: serializer
      content: nextContent,
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
  cardId?: string
  curValue?: Bullet
  draft: RootBulletDraft
}> {
  const symbol = draft.symbol

  // draft沒有op，不用create，返回
  if (!BulletNode.hasAnyOp(draft)) {
    console.error(inspect(draft, { depth: null }))
    throw 'draft 中所有的 bullet 皆沒有 op，無需創新 card body'
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
  const curContent: CardBodyContent = body.content as unknown as CardBodyContent

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
export async function createCardBody({
  cardId,
  root,
  userId,
}: {
  cardId: string
  root: RootBulletDraft
  userId: string
}): Promise<[CardBody, CardBodyContent]> {
  const body = await getLatestCardBody(cardId)
  if (body === null) {
    throw new Error('Card body not found')
  }
  const card = await prisma.card.findUnique({ where: { id: cardId } })
  if (card === null) {
    throw new Error('Card not found')
  }

  const pruned = BulletNode.prune(root)
  if (pruned && isRootBulletDraft(pruned)) {
    const checked = await checkDraft(pruned)
    return await _createCardBody({
      cardId: card.id,
      root: checked.draft,
      userId,
    })
  } else {
    throw 'Require pruned bullet to be root bulletdraft'
  }
}

/**
 * TODO: latest body 需要有驗證機制，才可以回朔
 */
export async function attachLatestBody<T extends Card>(
  card: T,
): Promise<
  T & {
    body: CardBody
  }
> {
  const body = await getLatestCardBody(card.id)
  if (body) {
    return { ...card, body }
  } else {
    throw new Error('card沒有對應的head/body，需要先創head/body')
  }
}

/**
 * 搜尋、創新 symbol card
 * TODO: 當 symbol 為 url 時，應導向 webpage card
 * @throw symbol format error
 */
export async function getOrCreateCardBySymbol(symbol: string): Promise<
  Omit<Card, 'meta'> & {
    link: Link | null
    meta: CardMeta
    body: CardBody
  }
> {
  const { symbolName, cardType } = parseSymbol(symbol)
  const found = await prisma.card.findUnique({
    where: { symbol: symbolName },
    include: { link: true },
  })
  if (found) {
    return {
      ...(await attachLatestBody(found)),
      link: found.link,
      meta: found.meta as unknown as CardMeta,
    }
  }
  // Card not found, create one
  let meta: CardMeta = {}
  let draft: RootBulletDraft
  switch (cardType) {
    case 'WEBPAGE':
      throw 'Use getOrCreateCardByUrl(...) to create a webpage card instead.'
    case 'TICKER': {
      meta = {
        template: 'ticker',
        title: '', // TODO, fill company if possible
      }
      draft = tickerStarter({ symbol })
      break
    }
    case 'TOPIC': {
      meta = {
        template: 'topic',
      }
      draft = topicStarter({ symbol })
      break
    }
  }
  const card = await prisma.card.create({
    data: {
      meta,
      symbol,
      type: cardType,
    },
  })
  const [body] = await _createCardBody({
    cardId: card.id,
    root: draft,
    userId: await getBotId(),
  })
  return { ...card, body, meta, link: null }
}

/**
 * 搜尋、創新 webpage card
 * 若給予的 url 在資料庫中找不到對應的 link，會 fetch url 並創一個 link
 */
export async function getOrCreateCardByUrl({ scraper, url }: { scraper?: FetchClient; url: string }): Promise<
  Omit<Card, 'meta'> & {
    link: Link
    meta: CardMeta
    body: CardBody
  }
> {
  const [link, { fetchResult }] = await getOrCreateLink({ scraper, url })
  const symbol = linkToSymbol(link)
  if (link.card) {
    const card = await attachLatestBody(link.card)
    return {
      ...card,
      link,
      meta: card.meta as unknown as CardMeta,
    }
  }
  // Card not found, create one
  const meta: CardMeta = {
    template: 'webpage',
    url: link.url,
    author: fetchResult?.authorName,
    date: fetchResult?.date,
    description: fetchResult?.date,
    keywords: fetchResult?.keywords,
    title: fetchResult?.title,
  }
  const card = await prisma.card.create({
    data: {
      type: CardType.WEBPAGE,
      link: { connect: { id: link.id } },
      meta,
      symbol,
    },
    include: { link: true },
  })
  const [body] = await _createCardBody({
    cardId: card.id,
    root: webpageStarter({ symbol }),
    userId: await getBotId(),
  })
  return { ...card, body, meta, link }
}

export async function getCard({ id }: { id: string }): Promise<
  | null
  | (Omit<Card, 'meta'> & {
      body: CardBody
      link: Link | null
      meta: CardMeta
    })
> {
  const card = await prisma.card.findUnique({
    where: { id },
    include: { link: true },
  })
  if (card) {
    const body = await getLatestCardBody(card.id)
    if (body === null) {
      throw 'Card body not found'
    }
    return {
      ...card,
      body,
      meta: card.meta as unknown as CardMeta,
    }
  }
  return null
}
