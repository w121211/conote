import { BoardStatus } from '@prisma/client'
import { PinBoardCode } from '../models/card'

// type Nullable<T> = {
//   [P in keyof T]?: T[P] | null
// }

// current Bullet {id, ....} -> BulletDraft {op: 'CREATE', ....}  -> {id: 123, ....}

export type HashtagOperation = 'CREATE' | 'UPDATE' | 'DELETE'

export type Hashtag = {
  userId: string
  boardId: number
  boardStatus: BoardStatus
  text: string
  linkBullet?: true // 特殊hashtag，用於表示bullet的board/poll
}

export type HashtagDraft = Partial<Hashtag> & {
  text: string
  op: HashtagOperation // 編輯狀態
}

export type BulletOperation = 'CREATE' | 'MOVE' | 'UPDATE' | 'DELETE' | 'UPDATE_MOVE'

export type Bullet = {
  id: number
  timestamp: number // 該次的commit時間點，用於判斷哪些是本次的commit
  userIds: string[] // 最後一個為目前的user

  head: string
  body?: string
  hashtags?: Hashtag[]
  children: Bullet[] // 強制要有，空的表示為無children

  op?: BulletOperation // 記錄編輯狀態，用於提醒
  prevHead?: string
  prevBody?: string

  placeholder?: string
  sourceUrl?: string
  oauthorName?: string
  boardId?: number // 連結到一個board，例如提問
  pollId?: number // 連結到一個poll
  commentId?: number // 連結到一個comment
  voteId?: number // 連結到一個vote

  freeze?: true // 無法變動
  freezeChildren?: true // 無法新增child
  keyvalue?: true // 用key-value的方式呈現
  valueBoolean?: true // body必須是boolean
  valueArray?: true // body必須是string array
  board?: true
  poll?: true
  pollChoices?: string[]

  pin?: true
  pinCode?: PinBoardCode

  childTemplate?: Omit<Bullet, 'id'>

  headValidator?: string
  bodyValidator?: string

  path?: number[] // node位置，計算時使用，不儲存
}

// export type BulletChildless = Omit<Bullet, 'children'>

export type BulletDraft = Omit<Partial<Bullet>, 'children' | 'hashtags'> & {
  head: string
  hashtags?: (Hashtag | HashtagDraft)[]
  // children?: BulletDraft[] | null
  children: BulletDraft[]

  // 用於輔助顯示，不會直接影響
  draft?: true // 表示該值有修改（搭配op）
  error?: string
  createCard?: true // 為新創的card
}

type BaseRoot = {
  root: true
  symbol: string // 用於記錄這個card
  self?: true // 非mirror
  mirror?: true // 是mirror
  cardBodyId?: number // mirror時，可能不是最新的card body
}

export type RootBullet = BaseRoot & Bullet

export type RootBulletChildless = Omit<RootBullet, 'children'> & {
  children: []
}

export type RootBulletDraft = BaseRoot & BulletDraft

// export function hasCardSymbol(node: BulletDraft): node is BulletDraft & Required<Pick<BulletDraft, 'cardSymbol'>> {
//   return 'cardSymbol' in node
// }

// export function hasCardSymbolEach(
//   nodes: BulletDraft[],
// ): nodes is (BulletDraft & Required<Pick<BulletDraft, 'cardSymbol'>>)[] {
//   for (const e of nodes) {
//     if (!hasCardSymbol(e)) return false
//   }
//   return true
// }

export function isRootBullet(node: Bullet | RootBullet): node is RootBullet {
  if ('root' in node && node.root && 'symbol' in node && node.symbol.length > 0) {
    return true
  }
  return false
}

export function isRootBulletDraft(node: BulletDraft | RootBulletDraft): node is RootBulletDraft {
  if ('root' in node && node.root && 'symbol' in node && node.symbol.length > 0) {
    return true
  }
  return false
}

export function isBullet(node: Bullet | RootBullet): node is Bullet {
  return !isRootBullet(node)
}

export function isBulletDraft(node: BulletDraft | RootBulletDraft): node is BulletDraft {
  return !isRootBulletDraft(node)
}
