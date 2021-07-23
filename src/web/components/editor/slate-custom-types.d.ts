import { Descendant, BaseEditor, BaseRange, Node } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'
import { CardType } from '@prisma/client'
import { BulletDraft, RootBullet } from '../../lib/bullet/types'

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

// export type BlockQuoteElement = { type: 'block-quote'; children: Descendant[] }

// export type BulletedListElement = {
//   type: 'bulleted-list'
//   children: Descendant[]
// }

// export type CheckListItemElement = {
//   type: 'check-list-item'
//   checked: boolean
//   children: Descendant[]
// }

// export type EditableVoidElement = {
//   type: 'editable-void'
//   children: EmptyText[]
// }

// // export type HeadingElement = { type: 'heading'; children: Descendant[] }

// export type HeadingTwoElement = { type: 'heading-two'; children: Descendant[] }

// export type ImageElement = {
//   type: 'image'
//   url: string
//   children: EmptyText[]
// }

// export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

// export type MentionElement = {
//   type: 'mention'
//   character: string
//   children: CustomText[]
// }

// export type ParagraphElement = { type: 'paragraph'; children: Descendant[] }

// export type TableElement = { type: 'table'; children: TableRow[] }

// export type TableCellElement = { type: 'table-cell'; children: CustomText[] }

// export type TableRowElement = { type: 'table-row'; children: TableCell[] }

// export type TitleElement = { type: 'title'; children: Descendant[] }

// export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

// export type ListElement = { type: 'list'; children: Descendant[] }

// export type ListItemElement = {
//   type: 'list-item'
//   body: string | null
//   children: Descendant[]
// }

// export type BulletElement = {
//   type: 'bullet'
//   children: Descendant[]
//   id?: number
//   onEdit?: true
// }

// export type BulletHeadElement = {
//   type: 'bullet-head'
//   children: Descendant[]
//   root?: true
//   warning?: string
//   body?: string
// }

// export type BulletBodyElement = {
//   type: 'bullet-body'
//   children: Descendant[]
// }

// export type HeadingElement = {
//   type: 'heading'
//   children: Descendant[]
//   // root: true
//   clicked?: string
//   input?: string
// }

// export type HeadingInputElement = {
//   type: 'heading-input'
//   children: Descendant[]
//   // root: true
//   clicked?: string
//   input?: string
//   symbol?: string
// }

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

export type CommentInput = {
  boardCode: !PinBoardCode
  oauthorVote?: !number
  oauthorComment?: string
}

export type LabelInlineElement = {
  type: 'label'
  symbol: string
  children: CustomText[]
}

export type UlElement = {
  type: 'ul'
  children: LiElement[]

  fold?: true
}

export type LiElement = {
  type: 'li'
  children: [LcElement, UlElement?]

  // fold?: true
}

/**
 * li的content，實際的input地方
 */
export type LcElement = Omit<BulletDraft, 'head' | 'children'> & {
  type: 'lc'
  children: CustomText[]

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

type CustomElement =
  // | BlockQuoteElement
  // | BulletedListElement
  // | CheckListItemElement
  // | EditableVoidElement
  // | HeadingElement
  // | HeadingTwoElement
  // | ImageElement
  // | LinkElement
  // | MentionElement
  // | ParagraphElement
  // | TableElement
  // | TableRowElement
  // | TableCellElement
  // | TitleElement
  // | VideoElement
  // | ListElement
  // | ListItemElement
  // | BulletElement
  // | BulletHeadElement
  // | BulletBodyElement
  // | HeadingElement
  // | HeadingInputElement
  LabelInlineElement | UlElement | LiElement | LcElement

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type CustomRange = BaseRange & {
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
