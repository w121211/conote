import { BaseEditor, BaseRange } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { BulletDraft, Hashtag, HashtagDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { HashtagGroup, HashtagGroupDraft } from '../../lib/hashtag/types'

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
}

export type LabelInlineElement = {
  type: 'label-inline'
  children: CustomText[]
}

export type MirrorInlineElement = {
  type: 'mirror-inline'
  children: CustomText[]
  mirrorSymbol: string
}

export type CurHashtagsPlacerInlineElement = {
  type: 'cur-hashtags-placer-inline'
  children: CustomText[]
  hashtags: (Hashtag | HashtagGroup)[]
}

export type HashtagInlineElement = {
  type: 'hashtag-inline'
  children: CustomText[]
  hashtagDraft?: HashtagDraft
}

export type HashtagGroupInlineElement = {
  type: 'hashtag-group-inline'
  children: CustomText[]
  hashtagGroupDraft?: HashtagGroupDraft
}

/**
 * li的content，實際文字輸入、操作的element，所以將bullet properties集中在此
 */
export type LcElement = Omit<BulletDraft, 'head' | 'children'> & {
  type: 'lc'
  children: (CustomText | LabelInlineElement)[]

  body?: string
  editingBody?: true

  asAuthor?: true // 若沒有的話視為self author
  banAsOauthor?: true // 此欄位無法以 @oauthor 記錄，例如self card
  // banDeleteBackward?: true
  // banDeleteForward?: true
  // banInsertBreak?: true
  // insertBreakAsIndent?: true

  // rootBullet?: Bullet // query card 取得的 body bullet root，保持靜態不修改

  // comments?: CommentInput[]
  // comment?: CommentInput

  // 新增mirror時需要先暫時存放
  root?: true
  mirror?: true
  symbol?: string
  rootBulletDraft?: RootBulletDraft // 只有 root 會存 root bullet，用此幫助 serialize
  newSymbol?: true // 找不到symbol，視為創新card
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

type CustomInlineElement =
  | LabelInlineElement
  | MirrorInlineElement
  | CurHashtagsPlacerInlineElement
  | HashtagInlineElement
  | HashtagGroupInlineElement

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
