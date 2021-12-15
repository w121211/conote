import { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { ChangeType } from '../../../packages/docdiff/src'
import { Bullet } from '../bullet/bullet'
import { InlineFiltertag, InlineMirror, InlinePoll, InlineRate, InlineSymbol } from '../inline/inline-types'

export type EmptyText = {
  text: string
}

export type CustomText = {
  bold?: true
  italic?: true
  code?: true
  text: string
  type?: string // stream type
  tokenType?: string
  // placeholder?: boolean
}

export type InlineFiltertagElement = InlineFiltertag & {
  children: CustomText[]
}

export type InlineMirrorElement = InlineMirror & {
  children: CustomText[]
}

export type InlinePollElement = InlinePoll & {
  children: CustomText[]
  selected?: boolean
}

export type InlineRateElement = InlineRate & {
  children: CustomText[]
}

export type InlineSymbolElement = InlineSymbol & {
  children: CustomText[]
}

export type LcElement = {
  type: 'lc'
  children: (CustomText | CustomInlineElement)[]

  cid: string // client-side temporary id, not real bullet id
  bulletCopy?: Bullet // keeps original copy
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

export type LiElement = {
  type: 'li'
  children: [LcElement, UlElement?]
}

export type UlElement = {
  type: 'ul'
  children: LiElement[]
  folded?: true
}

export type CustomInlineElement =
  | InlineFiltertagElement
  | InlineMirrorElement
  | InlinePollElement
  | InlineRateElement
  | InlineSymbolElement

type CustomElement = CustomInlineElement | LcElement | LiElement | UlElement

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

type CustomRange = BaseRange & {
  tokenType?: string
  // placeholder?: boolean
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
