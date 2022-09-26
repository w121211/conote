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
} from '../../editor-textarea/src/interfaces'
import { IndenterFormatErrorCode } from './indenter/normalizers'

//
// Component props
//
//
//
//
//
//

export type LeafPopoverProps<T extends InlineItem> = {
  // Element's dom id, used to identify the caret sitting (on-select-event) element
  id: string

  blockUid: string
  docUid: string
  draftId: string
  inlineItem: T
}

//
// Slate types
//
//
//
//
//
//

export type ElementIndenter = {
  type: 'indenter'
  children: TextCustom[]

  // Indicate the current level of indent, start from 1, since 0 represent no indent
  indent: number

  errorCode?: IndenterFormatErrorCode

  // Client-side id
  uid: string

  // Keep the original copy
  blockCopy?: Omit<Block, 'childrenUids'>

  // Record change-event lively
  change?: TreeNodeChangeType

  // For markdown render
  markdownIndent?: number
}

export type ElementLic = {
  type: 'lic'
  children: (TextCustom | InlineElementCustom)[]

  // Client-side id
  uid: string

  // Keep the original copy
  blockCopy?: Block

  // Record change-event lively
  change?: TreeNodeChangeType

  // editingBody?: true
  // selected?: boolean
  // asAuthor?: true
  // banAsOauthor?: true
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true
}

export type ElementLi = {
  type: 'li'
  children: [ElementLic, ElementUl?]
}

export type ElementUl = {
  type: 'ul'
  children: ElementLi[]
  folded?: true
}

export type ElementCustom =
  // | ElementLic
  // | ElementLi
  // | ElementUl
  // | InlineElementCustom
  ElementIndenter

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
  blockUid?: string
  inlineItem?: InlineItem
}

export type TextCustom = {
  text: string

  bold?: true
  italic?: true
  code?: true

  // Received from 'RangeCustom' during decorate
  blockUid?: string
  inlineItem?: InlineItem
}

export type TextEmpty = {
  text: string
}
