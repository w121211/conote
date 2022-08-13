import React, { useState } from 'react'
// import { Transforms } from 'slate'
// import { ReactEditor, RenderElementProps, useSlateStatic } from 'slate-react'
// import { DiscussFragment } from '../../apollo/query.graphql'
// import { InlineDiscussElement } from '../editor/slate-custom-types'
// import Modal from '../modal/modal'
// import { InlineItemService } from './inline-item-service'
// import CreateDiscussForm from '../discuss/create-discuss-form'
// import Link from 'next/link'
// import { DiscussModalPage } from '../discuss/_modal-page/modal-page'

// const InlineDiscuss = ({
//   children,
//   attributes,
//   element,
//   noteId,
// }: RenderElementProps & {
//   element: InlineDiscussElement
//   noteId?: string
// }): JSX.Element => {
//   const editor = useSlateStatic()
//   const [showModal, setShowModal] = useState(false)

//   const onCreate = (data: DiscussFragment) => {
//     const path = ReactEditor.findPath(editor, element)
//     const inlineDiscussStr = InlineItemService.toInlineDiscussString({
//       id: data.id,
//       title: data.title,
//     })
//     Transforms.setNodes<InlineDiscussElement>(
//       editor,
//       { id: data.id },
//       { at: path },
//     )
//     Transforms.insertText(editor, inlineDiscussStr, { at: path }) // replace existing text
//     setShowModal(false)
//   }

//   const isDiscussCreated = element.id !== undefined
//   const modalButtons = !isDiscussCreated && (
//     <button
//       form="create-discuss-form"
//       className="btn-primary h-10 w-24 "
//       type="submit"
//     >
//       Submit
//     </button>
//   )
//   const modalTopRightBtn = isDiscussCreated && (
//     <Link
//       href={{
//         pathname: '/discuss/[discussId]',
//         query: { discussId: element.id },
//       }}
//     >
//       <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
//         <span className="material-icons-outlined text-lg text-gray-500 hover:text-gray-700">
//           open_in_full
//         </span>
//       </a>
//     </Link>
//   )

//   return (
//     <span {...attributes}>
//       <span contentEditable={false}>
//         {isDiscussCreated ? (
//           <button
//             className=" hover:bg-gray-100"
//             onClick={() => {
//               setShowModal(true)
//             }}
//           >
//             {children}
//           </button>
//         ) : (
//           <button
//             className=" hover:bg-gray-100"
//             onClick={() => {
//               setShowModal(true)
//             }}
//           >
//             {children}
//             <span>(click to create)</span>
//           </button>
//         )}
//         <Modal
//           visible={showModal}
//           onClose={() => {
//             setShowModal(false)
//           }}
//           topRightBtn={modalTopRightBtn}
//           buttons={modalButtons}
//         >
//           {element.id ? (
//             <DiscussModalPage id={element.id} title={element.title} />
//           ) : (
//             <CreateDiscussForm
//               noteId={noteId}
//               title={element.title}
//               onCreate={onCreate}
//             />
//           )}
//         </Modal>
//       </span>
//       <span className={'text-[0px]'}>{children}</span>
//     </span>
//   )
// }

// export default InlineDiscuss
