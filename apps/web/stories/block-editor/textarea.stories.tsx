import React, { useEffect, useMemo, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { UndoManager } from '../../components/block-editor/src/utils/undo-manager'
import {
  destructKeyDown,
  isShortcutKey,
} from '../../components/block-editor/src/utils'

const UndoableTextarea = () => {
  const undoManager = useMemo(() => new UndoManager(''), []),
    [value, setValue] = useState('')

  useEffect(() => {
    console.log('UndoableTextarea mount')
    return () => console.log('UndoableTextarea unmount')
  }, [])

  function undo() {
    const s = undoManager.undo()
    if (s === null) {
      console.log('undo stack is empty')
    } else {
      setValue(s)
    }
  }

  function redo() {
    const s = undoManager.redo()
    if (s === null) {
      console.log('redo stack is empty')
    } else {
      setValue(s)
    }
  }

  return (
    <textarea
      value={value}
      onKeyDown={e => {
        const dKeyDown = destructKeyDown(e),
          { key, ctrl, meta, shift } = dKeyDown

        if (isShortcutKey(meta, ctrl) && key === 'z') {
          e.preventDefault()
          if (shift) {
            redo()
          } else {
            undo()
          }
        }
      }}
      onChange={e => {
        const { value } = e.currentTarget
        setValue(value)
        undoManager.nextValue(value)
      }}
    />
  )
}

const Playground = () => {
  const [show, setShow] = useState(true)
  return (
    <div>
      {show && <UndoableTextarea />}
      <button onClick={() => setShow(!show)}>Show</button>
      <hr />
      <UndoableTextarea />
    </div>
  )
}

export default {
  title: 'BlockEditor/Textarea',
  component: Playground,
} as ComponentMeta<typeof Playground>

const Template: ComponentStory<typeof Playground> = args => <Playground />

export const Undo = Template.bind({})

export const Textarea = () => {
  const value = '012345678\n012345678\n012345678\n'
  return (
    <textarea
      rows={4}
      value={value}
      onKeyUp={e => {
        const { currentTarget, target } = e
        const t = target as HTMLTextAreaElement
        console.log(
          'keyup',
          currentTarget.selectionStart,
          currentTarget.selectionDirection,
        )
      }}
      onKeyDown={e => {
        const { currentTarget, target } = e
        const t = target as HTMLTextAreaElement
        console.log(
          'keydown',
          currentTarget.selectionStart,
          currentTarget.selectionDirection,
        )
      }}
    ></textarea>
  )
}
