import { Descendant, BaseEditor, BaseRange } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

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

export type BlockQuoteElement = { type: 'block-quote'; children: Descendant[] }

export type BulletedListElement = {
  type: 'bulleted-list'
  children: Descendant[]
}

export type CheckListItemElement = {
  type: 'check-list-item'
  checked: boolean
  children: Descendant[]
}

export type EditableVoidElement = {
  type: 'editable-void'
  children: EmptyText[]
}

export type HeadingElement = { type: 'heading'; children: Descendant[] }

export type HeadingTwoElement = { type: 'heading-two'; children: Descendant[] }

export type ImageElement = {
  type: 'image'
  url: string
  children: EmptyText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type ParagraphElement = { type: 'paragraph'; children: Descendant[] }

export type TableElement = { type: 'table'; children: TableRow[] }

export type TableCellElement = { type: 'table-cell'; children: CustomText[] }

export type TableRowElement = { type: 'table-row'; children: TableCell[] }

export type TitleElement = { type: 'title'; children: Descendant[] }

export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

export type ListElement = { type: 'list'; children: Descendant[] }

export type ListItemElement = {
  type: 'list-item'
  body: string | null
  children: Descendant[]
}

export type BulletElement = {
  type: 'bullet'
  onEdit?: true
  children: Descendant[]
}

export type BulletHeadElement = {
  type: 'bullet-head'
  children: Descendant[]
}

export type BulletBodyElement = {
  type: 'bullet-body'
  children: Descendant[]
}

// export type TickerElement = {
//   type: 'bullet-body'
//   children: Descendant[]
// }

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | ImageElement
  | LinkElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement
  | ListElement
  | ListItemElement
  | BulletElement
  | BulletHeadElement
  | BulletBodyElement

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
