import { inspect } from 'util'
import { Board, Poll } from '@prisma/client'
import { getBotId } from '../models/user'
import prisma from '../prisma'
import {
  Bullet,
  BulletDraft,
  isBullet,
  isBulletDraft,
  isRootBullet,
  isRootBulletDraft,
  RootBullet,
  RootBulletDraft,
} from './types'
import { getLinkHashtag, runHastagOpBatch } from './hashtag'
import { Node } from './node'
import { cloneDeep } from '@apollo/client/utilities'

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

function _returnOrThrow<T extends BulletDraft | RootBulletDraft>(
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

/**
 * 創bullet，會在資料庫創一個bullet
 */
export async function createOneBullet<T extends BulletDraft | RootBulletDraft>(props: {
  cardId: number
  draft: T
  timestamp: number
  userId: string
}): Promise<BulletOrRootBullet<T>> {
  const { cardId, draft, timestamp, userId } = props

  if (draft.freeze && userId !== (await getBotId())) {
    console.warn(draft)
    throw new Error('權限不足: 無法創freeze bullet')
  }
  const bullet = await prisma.bullet.create({
    data: {
      card: { connect: { id: cardId } },
      count: { create: {} },
    },
  })

  let board: (Board & { poll: Poll | null }) | undefined
  if (draft.board || draft.poll) {
    const hashtag = getLinkHashtag(draft)
    if (hashtag === undefined) {
      throw new Error('創bullet-board需要有搭配的link-hashtag')
    }
    board = await prisma.board.create({
      data: {
        hashtag: hashtag.text,
        meta: '',
        content: draft.head,
        user: { connect: { id: userId } },
        card: { connect: { id: cardId } },
        bullet: { connect: { id: bullet.id } },
        poll:
          draft.poll && draft.pollChoices
            ? { create: { user: { connect: { id: userId } }, choices: draft.pollChoices, count: { create: {} } } }
            : undefined,
        count: { create: {} },
      },
      include: { poll: true },
    })
  }

  const hashtags =
    draft.hashtags &&
    (await runHastagOpBatch({
      bulletBoardId: board?.id,
      bulletId: bullet.id,
      cardId,
      hashtags: draft.hashtags,
      userId,
    }))

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

  const { draft: _, ...included } = draft
  const node: Bullet | RootBullet = {
    // TODO: 不應該直接copy input
    ...included,
    id: bullet.id,
    boardId: board?.id,
    pollId: board?.poll?.id,
    userIds: [userId],
    timestamp,
    hashtags,
    children: [],
  }
  return _returnOrThrow(node, draft)
}

/**
 * (Recursive)
 * @param current - 沒提供的情況視為第一次創建body
 */
export async function runBulletOp(props: {
  cardId: number
  current?: RootBullet
  draft: RootBulletDraft
  timestamp: number
  userId: string
}): Promise<RootBullet> {
  const { cardId, current, draft, timestamp, userId } = props

  const curDict = current && Node.toDict(current)

  async function _run<T extends BulletDraft | RootBulletDraft>(draft: T): Promise<BulletOrRootBullet<T> | null> {
    if (draft.op === 'CREATE') {
      const childlessNext = await createOneBullet({ cardId, draft, timestamp, userId })
      const children =
        draft.children && (await Promise.all(draft.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
      const next = {
        ...childlessNext,
        draft: undefined,
        children,
      }
      return _returnOrThrow(next, draft)
    }

    // input有對應的current node嗎？
    const cur = draft.id && curDict && curDict[draft.id]

    if (cur) {
      if (cur.op === 'DELETE') {
        return null
      }

      delete cur.path, cur.op
      let _timestamp = cur.timestamp,
        userIds = cur.userIds,
        head = cur.head,
        body = cur.body,
        prevHead: string | undefined,
        prevBody: string | undefined

      switch (draft.op) {
        case 'DELETE':
        case 'UPDATE':
        case 'UPDATE_MOVE': {
          _timestamp = timestamp
          userIds = [...userIds, userId]
          head = draft.head
          body = draft.body
          prevHead = cur.head
          prevBody = cur.body
          break
        }
      }

      // TODO: hashtags需要和先前的做比較
      const hashtags =
        draft.hashtags &&
        (await runHastagOpBatch({
          bulletBoardId: cur.boardId,
          bulletId: cur.id,
          cardId,
          hashtags: draft.hashtags,
          userId,
        }))

      const children = (await Promise.all(draft.children.map(e => _run(e)))).filter((e): e is Bullet => e !== null)
      const next = {
        ...cur,
        draft: undefined,
        timestamp: _timestamp,
        op: draft.op,
        children,
        userIds,
        head,
        body,
        prevHead,
        prevBody,
        hashtags,
      }
      return _returnOrThrow(next, draft)
    }

    // 其他未處理到的情形
    console.error(inspect(draft, { depth: null }))
    console.error(inspect(cur, { depth: null }))
    throw new Error('bullet-input必須是新創("create")，或是已經創建並能在latest card body中用bullet id找到')
  }

  const next = await _run(cloneDeep(draft))

  if (next === null) {
    console.error(inspect(draft, { depth: null }))
    console.error(inspect(current, { depth: null }))
    throw new Error('輸入值有異常')
  }

  return next
}
