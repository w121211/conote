import { cloneDeep } from 'lodash'
import { BasePoint, Editor, Range, Transforms } from 'slate'

const defaultCompletes: Record<string, string> = {
  '[': '[]',
  '(': '()',
  // '#': '##',
}

const defaultSelectionCompletes: Record<string, [string, string]> = {
  '[': ['[', ']'],
  '(': ['(', ')'],
  '#': ['#', '#'],
}

// { [trigger]: [term, replacer] }
const defaultReplacers: Record<string, [string, string]> = {
  '>': ['->', '→'],
  '-': ['<-', '←'],
}

export const withAutoComplete = (editor: Editor): Editor => {
  const { insertText } = editor

  editor.insertText = (text: string) => {
    const { selection } = editor

    if (selection) {
      if (Range.isCollapsed(selection)) {
        if (defaultCompletes[text]) {
          const replacer = defaultCompletes[text]
          Transforms.insertText(editor, replacer)
          Transforms.move(editor, { reverse: true })
          return
        }
        if (defaultCompletes[text]) {
          const { anchor, focus } = selection
          const [term, replacer] = defaultCompletes[text]
          const tempSelection = { anchor: { ...anchor, offset: anchor.offset - term.length + 1 }, focus }
          const tempStr = Editor.string(editor, tempSelection) + text

          // term matched, replace original term & config undos
          if (tempStr === term) {
            Transforms.insertText(editor, text)
            Transforms.delete(editor, { distance: term.length, reverse: true })
            Transforms.insertText(editor, replacer)

            const lastBatch = editor.history.undos[editor.history.undos.length - 1]
            if (lastBatch[lastBatch.length - 1] && lastBatch[lastBatch.length - 2]) {
              const lastOps = lastBatch.splice(-2, 2)
              editor.history.undos.push(lastOps)
            }
            return
          }
        }
      } else {
        // get current selection
        const [anchor, focus] = Range.edges(selection)

        if (defaultSelectionCompletes[text]) {
          const [startComplete, endComplete] = defaultSelectionCompletes[text]
          const selectionAnchor: BasePoint = {
            path: anchor.path,
            offset: anchor.offset + startComplete.length,
          }
          const selectionFocus: BasePoint = {
            path: focus.path,
            offset: focus.offset + startComplete.length,
          }
          Transforms.deselect(editor)
          Transforms.insertText(editor, startComplete, { at: anchor })
          Transforms.insertText(editor, endComplete, {
            at: { path: selectionFocus.path, offset: selectionFocus.offset + endComplete.length },
          })
          Transforms.select(editor, { anchor: selectionAnchor, focus: selectionFocus })
          return
        }

        // if (start.path === end.path) {
        //   const text = Editor.string(editor, selection)
        // }
      }
    }
    insertText(text)
  }

  return editor
}
