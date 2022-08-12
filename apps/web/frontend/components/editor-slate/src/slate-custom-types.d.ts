import type { BaseEditor } from 'slate'
import type { ReactEditor } from 'slate-react'
import type { HistoryEditor } from 'slate-history'
import type { ElementCustom, RangeCustom, TextCustom } from './interfaces'

type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: ElementCustom
    Text: TextCustom
    Range: RangeCustom
  }
}
