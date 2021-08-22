import { Hashtag as PrismaHashtag, HashtagStatus, Poll, PollCount } from '@prisma/client'
import prisma from '../prisma'

/**
 * Hashtag 類型
 * - plain text：用於 filter 時可以被搜尋，不會在資料庫裡建立，eg (#buy)
 * - by system: 系統預設，可+1、可 filter，可從功能列上增加，eg #up #down #pin
 * - by user: 使用者建立，可+1/-1（-1表答對此 hashtag 不認同）、可 filter，可從功能列上增加，eg #黑馬
 * - hashtag group：本質上是 poll，eg (#多 #空)，用括號包住投票的選項，可點擊投票（類似+1）、filter、可對整個 group +1/-1、可查看當前投票情形
 */

export type HashtagOperation = 'CREATE' | 'UPDATE' | 'DELETE'

export type Hashtag = Omit<PrismaHashtag, 'status' | 'pollId' | 'createdAt' | 'updatedAt'> & {
  type: 'hashtag'
}

export type HashtagDraft = Partial<Omit<Hashtag, 'type'>> & {
  type: 'hashtag-draft'
  op: HashtagOperation // 編輯狀態
  text: string
}

/** eg (#buy #sell #hold) */
export type HashtagGroup = Omit<Hashtag, 'type'> & {
  type: 'hashtag-group'
  poll: Omit<Poll, 'type' | 'status' | 'createdAt' | 'updatedAt'> & {
    count: Omit<PollCount, 'pollId' | 'nJudgments' | 'createdAt' | 'updatedAt'>
  }
}

export type HashtagGroupDraft = Partial<Omit<HashtagGroup, 'type'>> & {
  type: 'hashtag-group-draft'
  op: HashtagOperation // 編輯狀態
  pollChoices: string[]
}

// class HashtagOperation {
//   public static check() {}
//   public static parse() {}
//   pubkic static
// }

const reHashtag = /ab+c/

function isHashtagText(text: string): boolean {
  return reHashtag.test(text)
}

function toText(group: HashtagGroupDraft): string {
  return `(${group.pollChoices.join(' ')})`
}

/**
 * 檢查 hashtag
 * @throw 檢查有問題時丟相關錯誤
 */
// async function checkHashtag(draft: HashtagDraft, bulletHashtags: Hashtag[]) {}

function checkHashtagGroup(draft: HashtagGroupDraft): draft is HashtagGroupDraft {
  if (draft.pollChoices.length === 0) {
    throw 'poll choices 的數量需大於0'
  }
  for (const e of draft.pollChoices) {
    if (!isHashtagText(e)) {
      throw `poll choice 格式不符 hashtag: ${e}`
    }
  }
  return true
}

async function runHashtagGroupOp(props: {
  draft: HashtagGroupDraft
  bulletId: number
  cardId: number
  userId: string
}): Promise<HashtagGroup> {
  const { draft, bulletId, cardId, userId } = props

  switch (draft.op) {
    // case 'DELETE':
    //   throw 'Not implemented'
    // case 'UPDATE':
    //   throw 'Not implemented'
    case 'CREATE': {
      const hashtag = await prisma.hashtag.create({
        data: {
          bullet: { connect: { id: bulletId } },
          card: { connect: { id: cardId } },
          user: { connect: { id: userId } },
          count: { create: {} },
          poll: { create: { user: { connect: { id: userId } }, choices: draft.pollChoices, count: { create: {} } } },
          text: toText(draft),
        },
        include: { poll: { include: { count: true } } },
      })
      if (hashtag.poll && hashtag.poll.count) {
        return {
          type: 'hashtag-group',
          ...hashtag,
          poll: { ...hashtag.poll, count: { ...hashtag.poll.count } },
        }
      }
      throw 'Database unexpected error'
    }
  }
  throw 'Not implemented'
}

async function runHashtagOp(props: {
  draft: HashtagDraft
  bulletId: number
  cardId: number
  userId: string
}): Promise<Hashtag> {
  const { draft, bulletId, cardId, userId } = props

  let hashtag = draft.id ? await prisma.hashtag.findUnique({ where: { id: draft.id } }) : undefined

  if (hashtag === null) {
    throw new Error('給予的 id 找不到 hashtag')
  }
  if (hashtag !== undefined && hashtag !== null && hashtag.userId !== userId) {
    throw new Error('權限不足: 只可以修改自己創的 hashtag')
  }

  switch (draft.op) {
    case 'DELETE':
      if (hashtag) {
        hashtag = await prisma.hashtag.update({
          data: { status: HashtagStatus.DELETE },
          where: { id: hashtag.id },
        })
      }
      break
    case 'UPDATE':
      if (hashtag) {
        hashtag = await prisma.hashtag.update({
          data: { text: draft.text },
          where: { id: hashtag.id },
        })
      }
      break
    case 'CREATE':
      hashtag = await prisma.hashtag.create({
        data: {
          bullet: { connect: { id: bulletId } },
          card: { connect: { id: cardId } },
          user: { connect: { id: userId } },
          count: { create: {} },
          text: draft.text,
        },
      })
      break
  }

  if (hashtag) {
    return {
      type: 'hashtag',
      ...hashtag,
    }
  }
  throw 'unexpected error'
}

// export function getLinkHashtag(bullet: Bullet | BulletDraft) {
//   return bullet.hashtags?.find(e => e.linkBullet)
// }

// function toHashtag(board: Board): Hashtag {
//   return {
//     userId: board.userId,
//     boardId: board.id,
//     boardStatus: board.status,
//     text: board.hashtag,
//   }
// }

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
 * 將 hashtag 插入至給予的 root bullet 中，並在資料庫建立 board
 * 步驟：在給予的 root bullet 找欲插入的 bullet id、轉成 bullet draft、插入 hashtag draft、執行 bullet op、返回更新的root
 * @throws 若找到復數個/零個bullet、若hashtag已經在bullet裡
 *
 * TODO: 所有的 bullet editing 應該要透過 operation，而不應允許在其他地方（例如這裡）處理
 */
// export async function createHashtag(props: {
//   draft: HashtagDraft
//   root: RootBullet
//   bulletId: number
//   cardId: number
//   userId: string
// }): Promise<[Hashtag, RootBullet]> {
//   const { draft, root, bulletId, cardId, userId } = props
//   const rootDraft = Node.toDraft(root)
//   const found = Node.find({
//     node: rootDraft,
//     matcher: n => n.id === bulletId,
//   })
//   if (found.length > 1) throw '找到超過1個bullets，無法插入hashtag'
//   if (found.length === 0) throw '找到0個bullets，無法插入hashtag'
//   // In-place 修改node properties
//   const [n] = found
//   if (!isBulletDraft(n)) throw 'bullet需為draft'
//   n.hashtags = [...(n.hashtags ?? []), draft]
//   const updatedRoot = await runBulletOp({
//     current: root,
//     draft: rootDraft,
//     cardId,
//     userId,
//   })
//   // 從更新的bullet tree找回hashtag
//   const [updated] = Node.find({
//     node: updatedRoot,
//     matcher: n => n.id === bulletId,
//   })
//   const hashtag = updated.hashtags?.find(e => e.text === draft.text)
//   if (hashtag === undefined || isHashtagDraft(hashtag)) {
//     throw new Error()
//   }
//   return [hashtag, updatedRoot]
// }

export async function runHastagOpBatch(props: {
  hashtags: (Hashtag | HashtagDraft | HashtagGroup | HashtagGroupDraft)[]
  bulletId: number
  cardId: number
  userId: string
}): Promise<(Hashtag | HashtagGroup)[]> {
  const { hashtags, bulletId, cardId, userId } = props
  return await Promise.all(
    hashtags.map(e => {
      if (e.type === 'hashtag-group-draft') {
        return runHashtagGroupOp({ draft: e, bulletId, cardId, userId })
      }
      if (e.type === 'hashtag-draft') {
        return runHashtagOp({ draft: e, bulletId, cardId, userId })
      }
      return e
    }),
  )
}
