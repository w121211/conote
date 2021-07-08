import { Board, BoardStatus } from '@prisma/client'
import prisma from '../prisma'
import { Bullet, BulletInput, Hashtag, HashtagInput } from './types'

function isHashtagInput(value: Hashtag | HashtagInput): value is HashtagInput {
  return 'op' in value
}

async function runHastagOp({
  bulletBoardId,
  bulletId,
  cardId,
  input,
  userId,
}: {
  bulletBoardId?: number
  bulletId: number
  cardId: number
  input: Hashtag | HashtagInput
  userId: string
}): Promise<Hashtag | null> {
  if (!isHashtagInput(input)) {
    return input
  }

  let board: Board | null
  if (input.boardId) {
    board = await prisma.board.findUnique({ where: { id: input.boardId } })
    if (board?.userId !== userId) {
      throw new Error('權限不足: 只可以修改自己創的hashtag/board')
    }
  }

  switch (input.op) {
    case 'DELETE':
      prisma.board.update({
        data: { status: BoardStatus.DELETE },
        where: { id: input.boardId },
      })
      return null
    case 'UPDATE':
      board = await prisma.board.update({
        data: { hashtag: input.text },
        where: { id: input.boardId },
      })
      break
    case 'CREATE':
      if (input.linkBullet && bulletBoardId) {
        board = await prisma.board.findUnique({ where: { id: bulletBoardId } })
        if (board === null) {
          throw new Error('找不到連結的bullet board')
        }
      } else {
        board = await prisma.board.create({
          data: {
            hashtag: input.text,
            meta: '',
            content: '', // TODO:
            bullet: { connect: { id: bulletId } },
            card: { connect: { id: cardId } },
            user: { connect: { id: userId } },
            count: { create: {} },
          },
        })
      }
      break
  }
  return {
    userId,
    boardId: board.id,
    boardStatus: board.status,
    text: input.text,
  }
}

export async function runHastagOpBatch({
  bulletBoardId,
  bulletId,
  cardId,
  hashtags,
  userId,
}: {
  bulletBoardId?: number
  bulletId: number
  cardId: number
  hashtags: (Hashtag | HashtagInput)[]
  userId: string
}): Promise<Hashtag[]> {
  return (
    await Promise.all(hashtags.map(input => runHastagOp({ bulletBoardId, bulletId, cardId, input, userId })))
  ).filter((e): e is Hashtag => e !== null)
}

export function getLinkHashtag(bullet: Bullet | BulletInput) {
  return bullet.hashtags?.find(e => e.linkBullet)
}
