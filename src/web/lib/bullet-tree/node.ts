import { inspect } from 'util'
import { Board, Poll } from '@prisma/client'
import { getBotId } from '../models/user'
import prisma from '../prisma'
import { Bullet, BulletInput, BulletOmitChildren, BulletOmitOp } from './types'
import { getLinkHashtag, runHastagOpBatch } from './hashtag'

async function createBulletLeaf({
  cardId,
  input,
  timestamp,
  userId,
}: {
  cardId: number
  input: BulletInput
  timestamp: number
  userId: string
}): Promise<Bullet> {
  if (input.freeze && userId !== (await getBotId())) {
    throw new Error('權限不足: 無法創freeze bullet')
  }
  const bullet = await prisma.bullet.create({
    data: {
      card: { connect: { id: cardId } },
      count: { create: {} },
    },
  })

  let board: (Board & { poll: Poll | null }) | undefined
  if (input.board || input.poll) {
    const hashtag = getLinkHashtag(input)
    if (hashtag === undefined) {
      throw new Error('創bullet-board需要有搭配的link-hashtag')
    }
    board = await prisma.board.create({
      data: {
        hashtag: hashtag.text,
        meta: '',
        content: input.head,
        user: { connect: { id: userId } },
        card: { connect: { id: cardId } },
        bullet: { connect: { id: bullet.id } },
        poll:
          input.poll && input.pollChoices
            ? { create: { user: { connect: { id: userId } }, choices: input.pollChoices, count: { create: {} } } }
            : undefined,
        count: { create: {} },
      },
      include: { poll: true },
    })
  }

  const hashtags =
    input.hashtags &&
    (await runHastagOpBatch({
      bulletBoardId: board?.id,
      bulletId: bullet.id,
      cardId,
      hashtags: input.hashtags,
      userId,
    }))

  return {
    ...input,
    id: bullet.id,
    boardId: board?.id,
    pollId: board?.poll?.id,
    userIds: [userId],
    timestamp,
    hashtags,
    children: undefined,
  }
}

export async function runBulletInputOp({
  cardId,
  input,
  curDict,
  timestamp,
  userId,
}: {
  cardId: number
  input: BulletInput
  curDict?: Record<string, BulletOmitChildren>
  timestamp: number
  userId: string
}): Promise<Bullet | null> {
  const cur = input.id && curDict ? curDict[input.id] : undefined

  if (input.op === 'CREATE') {
    const next = await createBulletLeaf({ cardId, input, timestamp, userId })
    const children = (
      await Promise.all(
        input.children?.map(e => runBulletInputOp({ input: e, cardId, curDict, timestamp, userId })) ?? [],
      )
    ).filter((e): e is Bullet => e !== null)

    return {
      ...next,
      children: children.length > 0 ? children : undefined,
    }
  }

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

    switch (input.op) {
      case 'DELETE':
      case 'UPDATE':
      case 'UPDATE_MOVE': {
        _timestamp = timestamp
        userIds = [...userIds, userId]
        head = input.head
        body = input.body
        prevHead = cur.head
        prevBody = cur.body
        break
      }
    }

    // TODO: hashtags需要和先前的做比較
    const hashtags =
      input.hashtags &&
      (await runHastagOpBatch({
        bulletBoardId: cur.boardId,
        bulletId: cur.id,
        cardId,
        hashtags: input.hashtags,
        userId,
      }))
    const children = (
      await Promise.all(
        input.children?.map(e => runBulletInputOp({ input: e, cardId, curDict, timestamp, userId })) ?? [],
      )
    ).filter((e): e is Bullet => e !== null)

    return {
      ...cur,
      timestamp: _timestamp,
      op: input.op,
      children: children.length > 0 ? children : undefined,
      userIds,
      head,
      body,
      prevHead,
      prevBody,
      hashtags,
    }
  }
  console.error(inspect(input, { depth: null }))
  console.error(inspect(cur, { depth: null }))
  throw new Error('bullet-input必須是新創("create")，或是已經創建並能在latest card body中用bullet id找到')
}

function flattenBullet(node: Bullet, path: number[] = [0]): BulletOmitChildren[] {
  if (node.children) {
    const children = node.children.reduce<BulletOmitChildren[]>((acc, cur, i) => {
      const flats = flattenBullet(cur, [...path, i])
      return acc.concat(flats)
    }, [])
    delete node.children
    return [{ ...node, path }, ...children]
  } else {
    return [{ ...node, path }]
  }
}

export function bulletToDict(node: Bullet): Record<string, BulletOmitChildren> {
  const record: Record<string, BulletOmitChildren> = {}
  for (const e of flattenBullet(node)) {
    record[e.id] = e
  }
  return record
}

/**
 * Remove bullet op recursively
 */
export function cleanOp(node: Bullet): BulletOmitOp {
  delete node.op
  return {
    ...node,
    children: node.children?.map(e => cleanOp(e)),
  }
}

/**
 * Compare previouse bullet node with current one, and update the current node information in-place
 * TODO:
 * - bullet cut/paste
 * - validation
 */
export function addOp(cur: BulletInput, prev: Bullet, sourceUrl?: string, oauthorName?: string): BulletInput {
  const prevDict = bulletToDict(cleanOp(prev))

  function _diff(cur: BulletInput): BulletInput {
    let node: BulletInput
    if (cur.id) {
      const prev = prevDict[cur.id]
      delete prev.path
      if (cur.head !== prev.head || cur.body !== prev.body) {
        node = {
          ...prev,
          head: cur.head,
          body: cur.body,
          op: 'UPDATE',
        }
      } else {
        node = { ...prev }
      }
    } else {
      node = {
        head: cur.head,
        body: cur.body,
        sourceUrl,
        oauthorName,
        op: 'CREATE',
      }
    }
    return {
      ...node,
      children: cur.children?.map(e => _diff(e)),
    }
  }

  return _diff(cur)
}
