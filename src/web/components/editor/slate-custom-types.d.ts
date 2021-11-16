import { BaseEditor, BaseRange } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import {
  InlineMirror,
  InlinePoll,
  InlineSymbol,
  RootBulletDraft,
  InlineFiltertag,
  InlineShot,
  Bullet,
} from '../bullet/types'
import { ChangeType } from '../../../packages/docdiff/src'

export type CommentInput = {
  boardCode: !PinBoardCode
  oauthorVote?: !number
  oauthorComment?: string
}

export type EmptyText = {
  text: string
}

export type CustomText = {
  bold?: true
  italic?: true
  code?: true
  text: string
  type?: string // stream type
  placeholder?: boolean
  shift?: boolean
}

export type InlineSymbolElement = InlineSymbol & {
  children: CustomText[]
  shift?: boolean
}

export type InlineMirrorElement = InlineMirror & {
  children: CustomText[]
  root?: RootBulletDraft
  shift?: boolean
}

// export type InlineHashtagElement = InlineHashtag & {
//   children: CustomText[]
// }
export type InlineFiltertagElement = InlineFiltertag & {
  children: CustomText[]
  shift?: boolean
}

export type InlinePollElement = InlinePoll & {
  children: CustomText[]
  shift?: boolean
  selected?: boolean
}
export type InlineShotElement = InlineShot & {
  children: CustomText[]
  shift?: boolean
}

/**
 * li的content，實際文字輸入、操作的element，所以將bullet properties集中在此
 */
export type LcElement = {
  type: 'lc'
  children: (CustomText | LabelInlineElement)[]

  bulletSnapshot?: Bullet // keeps original copy
  change?: ChangeType // record change-event lively

  // editingBody?: true
  // selected?: boolean
  // asAuthor?: true // 若沒有的話視為self author
  // banAsOauthor?: true // 此欄位無法以 @oauthor 記錄，例如self card
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true
}

/**
 * li只允許包2個child：[lc, ul?]
 */
export type LiElement = {
  type: 'li'
  children: [LcElement, UlElement?]
}

/**
 * ul只允許包li child
 */
export type UlElement = {
  type: 'ul'
  children: LiElement[]
  folded?: true
}

export type CustomInlineElement =
  | InlineSymbolElement
  | InlineMirrorElement
  | InlinePollElement
  | InlineFiltertagElement
  | InlineShotElement

type CustomElement = CustomInlineElement | LcElement | LiElement | UlElement

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

type CustomRange = BaseRange & {
  type?: string
  placeholder?: boolean
}

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    // Text: CustomText | EmptyText
    Text: CustomText
    Range: CustomRange
  }
}
