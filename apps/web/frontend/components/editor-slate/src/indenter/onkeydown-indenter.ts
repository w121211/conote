import isHotkey from 'is-hotkey'
import React from 'react'
import { Editor } from 'slate'
import { indent, outdent } from './transforms'

export function indenterOnKeyDown(e: React.KeyboardEvent, editor: Editor) {
  if (isHotkey('tab', e)) {
    e.preventDefault()
    indent(editor)
  }

  if (isHotkey('shift+tab', e)) {
    e.preventDefault()
    outdent(editor)
  }
}
