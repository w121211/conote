import React, { useState, useEffect, CSSProperties, useCallback } from 'react'
// import { Editor, Range, Transforms } from 'slate'
// import { SearchDiscussSelect } from '../search-discuss-select'
// import Modal from '../modal/modal'
// import { ReactEditor } from 'slate-react'

// const trigger = ['#', '##'] // char trigger, term trigger

// export const useSearchDiscussModal = (
//   editor: Editor,
// ): {
//   searchDiscussSelectModal: JSX.Element
//   onKeyUp: (event: React.KeyboardEvent, editor: Editor) => void
// } => {
//   const [showModal, setShowModal] = useState(false)
//   const [selection, setSelection] = useState<Range | null>(null)
//   // const [selection, setSelection] = useState<Selection | null>(null)

//   const onKeyUp = (event: React.KeyboardEvent, editor: Editor) => {
//     const [charTrigger, termTrigger] = trigger
//     if (event.key === charTrigger) {
//       const { selection } = editor

//       if (selection && Range.isCollapsed(selection)) {
//         const { anchor, focus } = selection
//         const termSelection = { anchor: { ...anchor, offset: anchor.offset - termTrigger.length }, focus }
//         const termStr = Editor.string(editor, termSelection)

//         if (termStr === termTrigger) {
//           setSelection(termSelection)
//           setShowModal(true)
//         }
//       }
//     }
//   }

//   const searchDiscussSelectModal = (
//     <Modal
//       visible={showModal}
//       mask={false}
//       onClose={() => {
//         ReactEditor.focus(editor)
//         setShowModal(false)
//         // if (selection) {
//         //   Transforms.select(editor, selection) // select current text
//         // }
//       }}
//     >
//       <SearchDiscussSelect
//         onOptionSelected={option => {
//           // if (selection) {
//           const [, termTrigger] = trigger
//           ReactEditor.focus(editor)
//           // Transforms.select(editor, selection)
//           Transforms.delete(editor, {
//             distance: termTrigger.length,
//             unit: 'character',
//             reverse: true,
//           })
//           Transforms.insertText(editor, `#${option.label}-${option.id}#`)
//           // }
//           setSelection(null)
//           setShowModal(false)
//         }}
//         onCreateOptionSelected={() => {
//           // ReactEditor.focus(editor)
//           // Transforms.insertText(editor, 'hello world')
//           setSelection(null)
//           setShowModal(false)
//         }}
//       />
//     </Modal>
//   )

//   return { searchDiscussSelectModal, onKeyUp }
// }
