import { BoardStatus } from '@prisma/client'

export type HashtagOperation = 'CREATE' | 'UPDATE' | 'DELETE'

export type BulletPinCode = 'BUYSELL' | 'VS'

export type BulletOperation = 'CREATE' | 'MOVE' | 'UPDATE' | 'DELETE' | 'UPDATE_MOVE'

export type Hashtag = {
  userId: string
  boardId: number
  boardStatus: BoardStatus
  text: string
  linkBullet?: true // 特殊hashtag，用於表示bullet的board/poll
}

export type HashtagInput = Partial<Hashtag> & {
  text: string
  op: HashtagOperation // 編輯狀態
}

export type Bullet = {
  id: number
  timestamp: number // 該次的commit時間點，用於判斷哪些是本次的commit
  userIds: string[] // 最後一個為目前的user

  head: string
  body?: string
  hashtags?: Hashtag[]
  placeholder?: string
  children?: Bullet[]
  prevHead?: string
  prevBody?: string
  op?: BulletOperation // 記錄編輯狀態，用於提醒

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

  mirror?: true // mirror的bullet id是原始id

  pin?: true
  pinCode?: BulletPinCode

  childTemplate?: Omit<Bullet, 'id'>

  headValidator?: string
  bodyValidator?: string
}

// type Nullable<T> = {
//   [P in keyof T]?: T[P] | null
// }

export type BulletInput = Omit<Partial<Bullet>, 'children' | 'hashtags'> & {
  head: string
  hashtags?: (Hashtag | HashtagInput)[]
  children?: BulletInput[] | null
}

export type BulletOmitChildren = Omit<Bullet, 'children'> & {
  path?: number[]
}

export type BulletOmitOp = Omit<Bullet, 'children' | 'op'> & {
  children?: BulletOmitOp[]
}
