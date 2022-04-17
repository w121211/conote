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

export type InlineDiscuss = {
  type: 'inline-discuss'
  str: string
  title: string
  id?: string
}

export type InlineFiltertag = {
  type: 'inline-filtertag'
  str: string
}

export type InlineMirror = {
  type: 'inline-mirror'
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
  type: 'inline-poll'
  str: string
  id?: string
  choices: string[]
  pollCopy?: PollFragment
  // vote?: author vote
}

export type InlineRate = {
  type: 'inline-rate'
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
  type: 'inline-symbol'
  str: string
  // symbolType: SymbolType
  symbol: string
}

export type InlineComment = {
  type: 'inline-comment'
  str: string
}

export type InlineItem =
  | InlineText
  // | InlineAuthor
  | InlineDiscuss
  | InlineFiltertag
  | InlineMirror
  // | InlineHashtag
  // | InlineNewHashtag
  | InlinePoll
  | InlineRate
  | InlineSymbol
  | InlineComment

const isInlinePoll = (item: InlineItem): item is InlinePoll => {
  return item.type === 'inline-poll'
}

const isInlineRate = (item: InlineItem): item is InlineRate => {
  return item.type === 'inline-rate'
}
