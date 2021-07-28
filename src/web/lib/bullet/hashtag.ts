import { Board, BoardStatus } from '@prisma/client'
import prisma from '../prisma'
import { Node } from './node'
import { runBulletOp } from './operation'
import { Bullet, BulletDraft, Hashtag, HashtagDraft, isBulletDraft, RootBullet } from './types'

function isHashtagDraft(value: Hashtag | HashtagDraft): value is HashtagDraft {
  return 'op' in value
}

async function runHastagOp(props: {
  draft: HashtagDraft
  bullet: Bullet
  cardId: number
  userId: string
}): Promise<Hashtag> {
  const { draft, bullet, cardId, userId } = props

  let board: Board | null
  if (draft.boardId) {
    board = await prisma.board.findUnique({ where: { id: draft.boardId } })
    if (board !== null && board.userId !== userId) {
      throw new Error('權限不足: 只可以修改自己創的hashtag/board')
    }
  }
  switch (draft.op) {
    case 'DELETE':
      board = await prisma.board.update({
        data: { status: BoardStatus.DELETE },
        where: { id: draft.boardId },
      })
      break
    case 'UPDATE':
      board = await prisma.board.update({
        data: { hashtag: draft.text },
        where: { id: draft.boardId },
      })
      break
    case 'CREATE': {
      if (draft.linkBullet && bullet.boardId) {
        board = await prisma.board.findUnique({ where: { id: bullet.boardId } })
        if (board === null) throw new Error('找不到連結的bullet board')
        break
      }
      if (bullet.hashtags && bullet.hashtags.find(e => e.text === draft.text)) {
        throw '在bullet裡已經有相同text的hashtag，不能重複建立'
      }
      board = await prisma.board.create({
        data: {
          hashtag: draft.text,
          meta: '',
          content: '', // TODO:
          bullet: { connect: { id: bullet.id } },
          card: { connect: { id: cardId } },
          user: { connect: { id: userId } },
          count: { create: {} },
        },
      })
      break
    }
  }
  return {
    userId,
    boardId: board.id,
    boardStatus: board.status,
    text: draft.text,
  }
}

export async function runHastagOpBatch(props: {
  hashtags: (Hashtag | HashtagDraft)[]
  bullet: Bullet
  cardId: number
  userId: string
}): Promise<Hashtag[]> {
  const { hashtags, bullet, cardId, userId } = props
  return await Promise.all(
    hashtags.map(e => {
      if (!isHashtagDraft(e)) {
        return e // 非hashtag draft，返回
      }
      return runHastagOp({ draft: e, bullet, cardId, userId })
    }),
  )
}

export function getLinkHashtag(bullet: Bullet | BulletDraft) {
  return bullet.hashtags?.find(e => e.linkBullet)
}

function toHashtag(board: Board): Hashtag {
  return {
    userId: board.userId,
    boardId: board.id,
    boardStatus: board.status,
    text: board.hashtag,
  }
}

// /**
//  * 給予一個創好的board/hashtag，將他插入至對應的bullet並返回
//  * @throws 若找到復數個/零個bullet、若hashtag已經在bullet裡
//  *
//  * TODO: 所有的bullet editing應該要透過operation，而不應允許在其他地方（例如這裡）處理
//  */
// export function insertHashtag(props: { board: Board; root: RootBullet }): [Hashtag, RootBullet] {
//   const { board, root } = props

//   const _root = cloneDeep(root)
//   const found = Node.find({
//     node: _root,
//     matcher: n => n.id === board.bulletId,
//   })
//   if (found.length > 1) throw '找到超過1個bullets，無法插入hashtag'
//   if (found.length === 0) throw '找到0個bullets，無法插入hashtag'

//   const hashtag = toHashtag(board)

//   const [n] = found
//   if (n.hashtags) {
//     const found = n.hashtags.find(e => e.boardId === hashtag.boardId)
//     if (found) throw 'hashtag已經在bullet裡'
//     n.hashtags.push(hashtag)
//   } else {
//     n.hashtags = [hashtag]
//   }

//   return [hashtag, _root]
// }

/**
 * 將hashtag插入至給予的root bullet中，並在資料庫建立board
 * 步驟：在給予的root bullet找欲插入的bullet id、轉成bullet draft、插入hashtag draft、執行bullet op、返回更新的root
 * @throws 若找到復數個/零個bullet、若hashtag已經在bullet裡
 *
 * TODO: 所有的bullet editing應該要透過operation，而不應允許在其他地方（例如這裡）處理
 */
export async function createHashtag(props: {
  draft: HashtagDraft
  root: RootBullet
  bulletId: number
  cardId: number
  userId: string
}): Promise<[Hashtag, RootBullet]> {
  const { draft, root, bulletId, cardId, userId } = props

  const rootDraft = Node.toDraft(root)
  const found = Node.find({
    node: rootDraft,
    matcher: n => n.id === bulletId,
  })
  if (found.length > 1) throw '找到超過1個bullets，無法插入hashtag'
  if (found.length === 0) throw '找到0個bullets，無法插入hashtag'

  // In-place 修改node properties
  const [n] = found
  if (!isBulletDraft(n)) throw 'bullet需為draft'
  n.hashtags = [...(n.hashtags ?? []), draft]

  const updatedRoot = await runBulletOp({
    current: root,
    draft: rootDraft,
    cardId,
    userId,
  })

  // 從更新的bullet tree找回hashtag
  const [updated] = Node.find({
    node: updatedRoot,
    matcher: n => n.id === bulletId,
  })
  const hashtag = updated.hashtags?.find(e => e.text === draft.text)
  if (hashtag === undefined || isHashtagDraft(hashtag)) {
    throw new Error()
  }
  return [hashtag, updatedRoot]
}
