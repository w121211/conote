import React, { useEffect, useMemo, useState } from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { UndoManager } from '../../components/block-editor/src/utils/undo-manager'

const UndoableTextarea = () => {
  const undoManager = useMemo(() => new UndoManager(''), []),
    [value, setValue] = useState('')

  useEffect(() => {
    console.log('UndoableTextarea mount')
    return () => console.log('UndoableTextarea unmount')
  }, [])

  return (
    <div>
      <textarea
        value={value}
        onChange={e => {
          const { value } = e.currentTarget
          setValue(value)
          undoManager.nextValue(value)
        }}
      ></textarea>
      <button
        onClick={e => {
          // console.log(undoManager.undo())
          const s = undoManager.undo()
          if (s === null) {
            console.log('undo stack is empty')
          } else {
            setValue(s)
          }
        }}
      >
        Undo
      </button>
      <button
        onClick={e => {
          // console.log(undoManager.undo())
          const s = undoManager.redo()
          if (s === null) {
            console.log('redo stack is empty')
          } else {
            setValue(s)
          }
        }}
      >
        Redo
      </button>
    </div>
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
