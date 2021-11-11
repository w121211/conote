import { Poll as GQLPoll, Shot as GQLShot, ShotChoice } from '../../apollo/query.graphql'

/**
 * Bullet operation flow:
 * - Create: draft: BulletDraft {op: 'CREATE', ....}  -> next: Bullet {op: 'CREATE', draft, id, ....}
 * - Update: current: Bullet {id, ....} -> draft: BulletDraft {id, draft, op: 'UPDATE', ....}  -> next: Bullet {id, op: 'UPDATE', ....}
 * - Non-op: current: Bullet {id, op, ....} -> draft: BulletDraft {id, op, ....}  -> next: Bullet {id, op, ....} (會和 current 值相同)
 */

type SymbolType = 'ticker' | 'title' | 'url'

export type InlineText = {
  type: 'text'
  str: string
}

// export type InlineAuthor = {
//   type: 'author'
//   str: string
//   authorName: string
// }

export type InlineFiltertag = {
  type: 'filtertag'
  str: string
}

export type InlineMirror = {
  type: 'mirror'
  str: string
  // symbolType: SymbolType
  mirrorSymbol: string
  author?: string // 需要 parse 取得，eg ::$XX @cnyes
}

// export type InlineEmoji = {
//   type: 'emoji'
//   str: string
//   id: number
//   hashtag?: GQLHashtag
// }

// export type InlineNewHashtag = {
//   type: 'new-hashtag'
//   str: string
// }

export type InlinePoll = {
  type: 'poll'
  str: string
  id?: string
  choices: string[]
  poll?: GQLPoll
  // vote?: author vote
}

export type InlineShot = {
  type: 'shot'
  str: string
  id?: string
  params: string[]
  shot?: GQLShot
  authorName?: string
  targetSymbol?: string
  choice?: ShotChoice
  // vote?: author vote
}

export type InlineSymbol = {
  type: 'symbol'
  str: string
  // symbolType: SymbolType
  symbol: string
}

export type InlineItem =
  | InlineText
  // | InlineAuthor
  | InlineFiltertag
  | InlineMirror
  // | InlineHashtag
  // | InlineNewHashtag
  | InlinePoll
  | InlineShot
  | InlineSymbol

export type BulletOperation = 'CREATE' | 'MOVE' | 'UPDATE' | 'DELETE' | 'UPDATE_MOVE'

export type Bullet = {
  id: string
  cid?: string // 若沒有 id 時會生成一個 id

  // timestamp: number // commit 的時間點，有修改時才會更新，沒修改時會沿用之前的時間，用於判斷本次 commit 包含哪些 bullet
  // commitId: string
  // userIds: string[] // 最新修改此 bullet 的 user id 放在最後

  head: string
  body?: string
  // children: Bullet[] // 空 array 表示為無children

  // author?: { id: string; name: string }
  // source?: { id: string; url: string }
  authorId?: string
  sourceCardId?: string
  sourceLinkId?: string

  symbols?: { cardId: string; str: string }[] // 在此 bullet 中所提到的 symbols，當 symbol 改名時，仍可以靠 id 修正成新名字

  placeholder?: string
  freeze?: true // 無法變動
  freezeChildren?: true // 無法新增child

  // Next
  // headValueChecker?: string
  // bodyValueChecker?: string
  // hashtagIds?: number[] // 屬 self-objects，若內文遭到刪除可透過此偵測

  // Consider to remove
  // op?: BulletOperation // 記錄編輯狀態，用於 revision TODO: 若沒修改時 op 會移除嗎？？？
  // prevHead?: string
  // prevBody?: string
  // keyvalue?: true // 用key-value的方式呈現
  // valueBoolean?: true // body必須是boolean
  // valueArray?: true // body必須是string array
  // board?: true
  // poll?: true
  // pollChoices?: string[]
  // pin?: true
  // pinCode?: PinBoardCode
  // boardId?: number // 連結到一個board，例如提問
  // pollId?: number // 連結到一個poll
  // commentId?: number // 連結到一個comment
  // voteId?: number // 連結到一個vote
  // childTemplate?: Omit<Bullet, 'id'>
  // path?: number[] // node位置，計算時使用，不儲存
}

export type BulletDraft = Omit<Partial<Bullet>, 'children'> & {
  head: string
  children: BulletDraft[] // 視所有的 tree 都為 BulletDraft，好處是在 type 上可以更容易處理，壞處是無法區分哪個有修改哪個沒有 TODO: 更好的區分
  parsed?: InlineItem[]

  // 用於輔助顯示，不會直接影響
  // emojis?: GQLHashtag[] // injected existing hashtags
  draft?: true // 表示此 bullet 有被修改，搭配 op 做更新，用於區隔沒有修改的 bullet（因為即便是未修改的 bullet，type 仍然是 BulletDraft)
  error?: string
  createCard?: true // 為新創的card
}

type RootBulletBase = {
  root: true
  symbol: string // 記錄此 card symbol
}

export type RootBullet = RootBulletBase & Bullet

export type RootBulletDraft = RootBulletBase & BulletDraft

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

// export function toInlineHashtag(hashtag: GQLHashtag | Hashtag): InlineHashtag {
//   const isGQLHashtag = (obj: GQLHashtag | Hashtag): obj is GQLHashtag => {
//     return typeof obj.id === 'string'
//   }
//   if (isGQLHashtag(hashtag)) {
//     return {
//       type: 'hashtag',
//       str: hashtag.text,
//       id: parseInt(hashtag.id),
//       hashtag,
//     }
//   }
//   return {
//     type: 'hashtag',
//     str: hashtag.text,
//     id: hashtag.id,
//   }
// }

export function toInlinePoll({ id, choices }: { id: string | number; choices: string[] }): InlinePoll {
  const _id = typeof id === 'number' ? id.toString() : id
  return {
    type: 'poll',
    str: `!((poll:${_id}))(${choices.join(' ')})`,
    id: _id,
    choices: choices,
  }
}
