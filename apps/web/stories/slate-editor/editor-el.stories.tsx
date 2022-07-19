import React, { useEffect, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import SlateEditorEl from '../../frontend/components/slate-editor/src/components/slate-editor-el'
import { mockDocs } from '../../frontend/components/block-editor/test/__mocks__/mock-doc'

export default {
  title: 'SlateEditor/SlateEditorEl',
  component: SlateEditorEl,
} as ComponentMeta<typeof SlateEditorEl>

export const List = () => {
  return <SlateEditorEl doc={mockDocs[0]} />
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
