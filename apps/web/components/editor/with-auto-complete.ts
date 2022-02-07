import { cloneDeep } from 'lodash'
import { Editor, Range, Transforms } from 'slate'

const DEFINED_COMPLETES: Record<string, string> = {
  '[': '[]',
  '(': '()',
  '#': '##',
}

// { [trigger]: [term, replacer] }
const DEFINED_REPLACERS: Record<string, [string, string]> = {
  '>': ['->', '→'],
  '-': ['<-', '←'],
}

export const withAutoComplete = (editor: Editor): Editor => {
  const { insertText } = editor

  editor.insertText = (text: string) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      if (DEFINED_COMPLETES[text]) {
        const replacer = DEFINED_COMPLETES[text]
        Transforms.insertText(editor, replacer)
        Transforms.move(editor, { reverse: true })
        return
      }

      if (DEFINED_REPLACERS[text]) {
        const { anchor, focus } = selection
        const [term, replacer] = DEFINED_REPLACERS[text]
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
    }
    insertText(text)
  }

  return editor
}
