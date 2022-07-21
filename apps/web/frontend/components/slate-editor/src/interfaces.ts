import type { TreeNodeChangeType } from '@conote/docdiff'
import type { BaseRange } from 'slate'
import type {
  Block,
  InlineComment,
  InlineDiscuss,
  InlineFiltertag,
  InlineItem,
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

export type RangeCustom = BaseRange & {
  blockUid: string
  draftId: string
  inlineItem: InlineItem
}

export type TextCustom = {
  bold?: true
  italic?: true
  code?: true
  text: string

  // Received from 'RangeCustom' during decorate
  blockUid: string
  draftId: string
  inlineItem: InlineItem
}

export type TextEmpty = {
  text: string
}

//
// Component props
//
//
//
//
//
//

export type PopoverPanelProps = {
  // Element id for the popover span, used for query element
  elId: string

  blockUid: string
  draftUid: string
  inlineItem: InlineItem
}
