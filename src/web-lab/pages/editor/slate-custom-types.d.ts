import { BaseEditor, BaseRange } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import {
  Bullet,
  BulletDraft,
  RootBullet,
  RootBulletDraft,
} from '../../../web/lib/bullet/types'

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
}

// export type BulletBodyInlineElement = {
//   type: 'bullet-body-inline'
//   children: CustomText[]
// }

// export type BulletBodyInlineStopElement = {
//   type: 'bullet-body-inline-stop'
//   children: CustomText[]
// }

// export type TickerElement = {
//   type: 'bullet-body'
//   children: Descendant[]
// }

export type LabelInlineElement = {
  type: 'label'
  children: CustomText[]
}

export type MirrorInlineElement = {
  type: 'mirror'
  children: CustomText[]
  root?: RootBulletDraft
}

export type PopupInlineElement = {
  type: 'popup'
  children: CustomText[]
  str: string
  id?: string
}

export type LcBodyElement = {
  type: 'lc-body'
  children: CustomText[]
}

export type LcHeadElement = Omit<BulletDraft, 'head' | 'children'> & {
  type: 'lc-head'
  children: (
    | CustomText
    | LabelInlineElement
    | MirrorInlineElement
    | PopupInlineElement
  )[]

  body?: string
  isEditingBody?: true

  asOauthor?: true // 若沒有的話視為self author
  banAsOauthor?: true // 此欄位無法以 @oauthor 記錄，例如self card
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true

  // rootBullet?: Bullet // query card 取得的 body bullet root，保持靜態不修改

  // comments?: CommentInput[]
  comment?: CommentInput

  // 新增mirror時需要先暫時存放
  root?: true
  mirror?: true
  symbol?: string
  rootBullet?: RootBullet // 只有root會存root bullet，用此幫助serialize
  newSymbol?: true // 找不到symbol，視為創新card
}

export type LcHeadBodyElement = {
  type: 'lc-head-body'
  children: [LcHeadElement, LcBodyElement?]
}

export type LcElement = Omit<BulletDraft, 'head' | 'children'> & {
  type: 'lc'
  children: (CustomText | LabelInlineElement | MirrorInlineElement)[]

  body?: string
  editingBody?: true

  // asAuthor?: true // 若沒有的話視為self author
  // banAsOauthor?: true // 此欄位無法以 @oauthor 記錄，例如self card
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true

  // rootBullet?: Bullet // query card 取得的 body bullet root，保持靜態不修改

  // comments?: CommentInput[]
  // comment?: CommentInput

  // 新增mirror時需要先暫時存放
  // root?: true
  // mirror?: true
  // symbol?: string
  // newSymbol?: true // 找不到symbol，視為創新card

  rootBulletDraft?: RootBulletDraft // 只有 root 會存 root bullet，用此幫助 serialize
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
  fold?: true
}

type CustomElement =
  | LabelInlineElement
  | MirrorInlineElement
  | UlElement
  | LiElement
  | LcElement
  | LcHeadElement
  | LcBodyElement
  | PopupInlineElement

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

type CustomRange = BaseRange & {
  type?: string
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
