import type { TreeNodeChangeType } from '@conote/docdiff'
import type {
  Block,
  InlineComment,
  InlineDiscuss,
  InlineFiltertag,
  InlinePoll,
  InlineRate,
  InlineSymbol,
} from '../../block-editor/src/interfaces'

//
// Slate element
//
//
//
//
//
//

export type ElementLc = {
  type: 'lc'
  children: (TextCustom | InlineElementCustom)[]

  // Client-side id
  uid: string

  // Keep the original copy
  blockCopy?: Block

  // Record change-event lively
  change?: TreeNodeChangeType

  // editingBody?: true
  // selected?: boolean
  // asAuthor?: true // 若沒有的話視為self author
  // banAsOauthor?: true // 此欄位無法以 @oauthor 記錄，例如self card
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true
}

export type ElementLi = {
  type: 'li'
  children: [ElementLc, ElementUl?]
}

export type ElementUl = {
  type: 'ul'
  children: ElementLi[]
  folded?: true
}

//
//
//
//
//
//
//
//

export type InlineElementDiscuss = InlineDiscuss & {
  children: TextCustom[]
  // children: Descendant[]
}

export type InlineElementFiltertag = InlineFiltertag & {
  children: TextCustom[]
}

// export type InlineMirrorElement = InlineMirror & {
//   children: CustomText[]
// }

export type InlineElementPoll = InlinePoll & {
  children: TextCustom[]
  selected?: boolean
}

export type InlineElementRate = InlineRate & {
  children: TextCustom[]
}

export type InlineElementSymbol = InlineSymbol & {
  children: TextCustom[]
}

export type InlineElementComment = InlineComment & {
  children: TextCustom[]
}

export type InlineElementCustom =
  | InlineElementDiscuss
  | InlineElementFiltertag
  // | InlineMirrorElement
  | InlineElementPoll
  | InlineElementRate
  | InlineElementSymbol
  | InlineElementComment

//
//
//
//
//
//
//
//

export type TextCustom = {
  bold?: true
  italic?: true
  code?: true
  text: string

  // Stream type
  type?: string

  tokenType?: string
  // placeholder?: boolean
}

export type TextEmpty = {
  text: string
}
