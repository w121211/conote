import React, { useEffect, useRef, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import SlateEditorEl from '../../frontend/components/slate-editor/src/components/slate-editor-el'
import { mockDocs } from '../../frontend/components/block-editor/test/__mocks__/mock-doc'
import ModalProvider from '../../frontend/components/modal/modal-context'

import { offset, useFloating } from '@floating-ui/react-dom'

export default {
  title: 'SlateEditor/SlateEditorEl',
  component: SlateEditorEl,
} as ComponentMeta<typeof SlateEditorEl>

export const List = () => {
  return (
    <ModalProvider>
      <SlateEditorEl doc={mockDocs[0]} />
    </ModalProvider>
  )
}

export const MultiEditor = () => {
  return (
    <ModalProvider>
      <SlateEditorEl doc={mockDocs[0]} />
      <SlateEditorEl doc={mockDocs[0]} />
    </ModalProvider>
  )
}

// export const QueryNoteNotExisted = () => {
//   useEffect(() => {
//     editorOpenSymbolInMain('[[Note not existed]]')
//   }, [])
//   return (
//     <ModalProvider>
//       <EditorEl />
//     </ModalProvider>
//   )
// }

// export const QueryNoteAAPL = () => {
//   useEffect(() => {
//     editorOpenSymbolInMain('$AAPL')
//   }, [])
//   return (
//     <ModalProvider>
//       <EditorEl />
//     </ModalProvider>
//   )
// }

// export const Toolbar = () => {
//   useEffect(() => {
//     editorOpenSymbolInMain('$AAPL')
//   }, [])
//   return (
//     <ModalProvider>
//       <EditorToolbar />
//       <EditorEl />
//     </ModalProvider>
//   )
// }
