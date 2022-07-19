import type { BaseEditor } from 'slate'
import type { ReactEditor } from 'slate-react'
import type { HistoryEditor } from 'slate-history'
import type {
  ElementLc,
  ElementLi,
  ElementUl,
  InlineElementCustom,
  TextCustom,
} from './interfaces'

type CustomElement = ElementLc | ElementLi | ElementUl | InlineElementCustom

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
    Text: TextCustom
    Range: CustomRange
  }
}
