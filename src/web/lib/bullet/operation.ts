import { inspect } from 'util'
import { getBotId } from '../models/user'
import prisma from '../prisma'
import {
  Bullet,
  BulletDraft,
  InlineItem,
  isBullet,
  isBulletDraft,
  isRootBullet,
  isRootBulletDraft,
  RootBullet,
  RootBulletDraft,
  toInlinePoll,
  // toInlineHashtag,
} from './types'
import { BulletNode } from './node'
import { cloneDeep } from '@apollo/client/utilities'
import { inlinesToString, parseBulletHead } from './parse'

/**
 * 使用conditional type，輸入是bullet draft時返回bullet，輸入是root bullet draft時返回root bullet
 * @see https://www.typescriptlang.org/docs/handbook/2/conditional-types.html
 */
type BulletOrRootBullet<T extends BulletDraft | RootBulletDraft> = T extends RootBulletDraft ? RootBullet : Bullet

function isBulletOrRootBullet<T extends BulletDraft | RootBulletDraft>(
  node: Bullet | RootBullet,
  draft: T,
): node is BulletOrRootBullet<T> {
  if (isBulletDraft(draft) && isBullet(node)) return true
  if (isRootBulletDraft(draft) && isRootBullet(node)) return true
  return false
}

async function isBotOrThrow(userId: string, msg: string): Promise<void> {
  if (userId === (await getBotId())) return
  throw msg
}

function returnOrThrow<T extends BulletDraft | RootBulletDraft>(
  node: Bullet | RootBullet,
  draft: T,
): BulletOrRootBullet<T> {
  if (isBulletOrRootBullet(node, draft)) {
    return node
  }
  console.error(node)
  console.error(draft)
  throw new Error('Root bullet draft應返回root bullet，bullet draft應返回bullet')
}

async function createInlineItem({
  inline,
  // bulletId,
  // cardId,
  userId,
}: {
  inline: InlineItem
  // bulletId: string
  // cardId: string
  userId: string
}): Promise<InlineItem> {
  switch (inline.type) {
    // case 'new-hashtag': {
    //   const hashtag = await prisma.hashtag.create({
    //     data: {
    //       userId,
    //       bulletId,
    //       cardId,
    //       text: draft.str,
    //       count: { create: {} },
    //     },
    //     include: { count: true },
    //   })
    //   const hasCount = (obj: Hashtag & { count: HashtagCount | null }): obj is Hashtag & { count: HashtagCount } => {
    //     return obj.count !== null
    //   }
    //   if (hasCount(hashtag)) {
    //     return {
    //       type: 'hashtag',
    //       str: hashtag.text,
    //       id: hashtag.id,
    //       hashtag: toGQLHashtag(hashtag),
    //     }
    //   }
    //   throw 'Hashtag.count shoud exist'
    // }
    case 'poll': {
      if (inline.id === undefined) {
        // 沒有 id 的情況視為新增一個
        const poll = await prisma.poll.create({
          data: {
            userId,
            choices: inline.choices,
            count: { create: {} },
          },
        })
        return toInlinePoll({ id: poll.id, choices: poll.choices })
      }
      return inline
    }
    default:
      return inline
  }

  // let board: (Board & { poll: Poll | null }) | undefined
  // if (draft.board || draft.poll) {
  //   const hashtag = getLinkHashtag(draft)
  //   if (hashtag === undefined) {
  //     throw new Error('創bullet-board需要有搭配的link-hashtag')
  //   }
  //   board = await prisma.board.create({
  //     data: {
  //       hashtag: hashtag.text,
  //       meta: '',
  //       content: draft.head,
  //       user: { connect: { id: userId } },
  //       card: { connect: { id: cardId } },
  //       bullet: { connect: { id: bullet.id } },
  //       poll:
  //         draft.poll && draft.pollChoices
  //           ? { create: { user: { connect: { id: userId } }, choices: draft.pollChoices, count: { create: {} } } }
  //           : undefined,
  //       count: { create: {} },
  //     },
  //     include: { poll: true },
  //   })
  // }
  // const node: BulletRootOrBullet<T> = {
  //   // TODO: 不應該直接copy input
  //   ...draft,
  //   id: bullet.id,
  //   boardId: board?.id,
  //   pollId: board?.poll?.id,
  //   userIds: [userId],
  //   timestamp,
  //   hashtags,
  //   children: undefined,
  // }
}

/**
 * 在資料庫創一個bullet
 */
async function createOneBullet<T extends BulletDraft | RootBulletDraft>(props: {
  cardId: string
  draft: T
  timestamp: number
  userId: string
}): Promise<BulletOrRootBullet<T>> {
  const { cardId, draft, timestamp, userId } = props

  if (draft.freeze && userId !== (await getBotId())) {
    console.warn(draft)
    throw new Error('權限不足: 無法創freeze bullet')
  }
  const dbBullet = await prisma.bullet.create({
    data: {
      card: { connect: { id: cardId } },
    },
  })

  // tokenize & parse
  const { headInlines } = parseBulletHead({ str: draft.head })
  const producedHeadInlines = await Promise.all(headInlines.map(e => createInlineItem({ inline: e, userId })))

  if (isRootBulletDraft(draft)) {
    const produced: RootBullet = {
      id: dbBullet.id,
      userIds: [userId],
      root: true,
      symbol: draft.symbol,
      head: inlinesToString(producedHeadInlines).trim(),
      body: draft.body,
      timestamp,
      children: [],
      symbols: [],
    }
    return produced
  }
  const node: Bullet = {
    id: dbBullet.id,
    userIds: [userId],
    head: inlinesToString(producedHeadInlines).trim(),
    body: draft.body,
    timestamp,
    children: [],
    authorId: draft.authorId,
    sourceCardId: draft.sourceCardId,
    sourceLinkId: draft.sourceLinkId,
    symbols: [],
  }
  return returnOrThrow(node, draft)
}

/**
 * (Recursive) Bullet operation
 * current -> draft (string -> inlines -> create) -> produced
 * @param current - 若沒給予視為第一次創建body
 * @param timestamp - 若沒給予視為只執行hashtag ops、或沒有ops
 */
export async function runBulletOp(props: {
  draft: RootBulletDraft
  cardId: string
  userId: string
  timestamp: number
  current?: RootBullet
}): Promise<RootBullet> {
  const { draft: rootDraft, cardId, userId, timestamp, current } = props

  const curDict = current && BulletNode.toDict(current)

  async function _run(node: BulletDraft): Promise<Bullet | null> {
    if (node.op === 'CREATE') {
      const childlessProduced = await createOneBullet({ cardId, draft: node, timestamp, userId })
      const children =
        node.children && (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
      const next = {
        ...childlessProduced,
        draft: undefined,
        children,
      }
      return next
    }

    const cur = node.id && curDict && curDict[node.id] // 有對應的 current node？
    if (cur) {
      if (cur.op === 'DELETE') {
        // current 被標記刪除
        return null
      }
      delete cur.op

      if (node.op === undefined) {
        const children = (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
        const next = { ...cur, children }
        return next
      }
      if (node.op === 'MOVE' || node.op === 'DELETE') {
        const children = (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
        const next = {
          ...cur,
          op: node.op,
          userIds: [...cur.userIds, userId],
          timestamp,
          children,
        }
        return next
      }
      if (node.op === 'UPDATE' || node.op === 'UPDATE_MOVE') {
        const head = node.head
        const dbBullet = await prisma.bullet.findUnique({
          where: { id: cur.id },
          include: { emojis: true },
        })
        if (dbBullet) {
          // const { headInlines } = parseBulletHead({
          //   str: head,
          //   // connected: { hashtags: dbBullet.hashtags.map(e => toInlineHashtag(e)) },
          // })
          // const producedHeadInlines = await Promise.all(
          //   headInlines.map(e => createInlineItem({ draft: e, userId, bulletId: dbBullet.id, cardId })),
          // )
          const children = (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
          const next = {
            ...cur,
            op: node.op,
            userIds: [...cur.userIds, userId],
            timestamp,
            children,
            head,
            body: node.body,
          }
          return next
        }
        throw '找不到 db-bullet'
      }
    }

    // 其他未處理到的情形
    console.error(inspect(node, { depth: null }))
    console.error(inspect(cur, { depth: null }))
    throw 'bullet-input必須是新創("create")，或是已經創建並能在latest card body中用bullet id找到'
  }

  async function _runRoot(node: RootBulletDraft): Promise<RootBullet> {
    if (node.op === 'CREATE') {
      const childlessProduced = await createOneBullet({ cardId, draft: node, timestamp, userId })
      const children =
        node.children && (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
      const next = {
        ...childlessProduced,
        children,
      }
      return next
    }

    const cur = node.id && curDict && curDict[node.id] // 有對應的 current node？
    if (cur) {
      if (node.op === undefined) {
        const children = (await Promise.all(node.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
        const next = { ...cur, children }
        return returnOrThrow(next, node)
      }
      throw 'root bullet 目前只能 create，不接受其他 op'
    }
    throw '找不到對應的 current node'
  }

  return await _runRoot(cloneDeep(rootDraft))
}
