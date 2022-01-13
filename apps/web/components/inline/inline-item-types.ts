/**
 * Bullet operation flow:
 * - Create: draft: BulletDraft {op: 'CREATE', ....}  -> next: Bullet {op: 'CREATE', draft, id, ....}
 * - Update: current: Bullet {id, ....} -> draft: BulletDraft {id, draft, op: 'UPDATE', ....}  -> next: Bullet {id, op: 'UPDATE', ....}
 * - Non-op: current: Bullet {id, op, ....} -> draft: BulletDraft {id, op, ....}  -> next: Bullet {id, op, ....} (會和 current 值相同)
 */

import { RateChoice } from 'graphql-let/__generated__/__types__'
import { PollFragment, RateFragment } from '../../apollo/query.graphql'

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
  pollCopy?: PollFragment
  // vote?: author vote
}

export type InlineRate = {
  type: 'rate'
  str: string
  id?: string
  params: string[]
  rateCopy?: RateFragment
  authorName?: string
  targetSymbol?: string
  choice?: RateChoice
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
  | InlineRate
  | InlineSymbol

function isInlinePoll(item: InlineItem): item is InlinePoll {
  return item.type === 'poll'
}

function isInlineRate(item: InlineItem): item is InlineRate {
  return item.type === 'rate'
}
