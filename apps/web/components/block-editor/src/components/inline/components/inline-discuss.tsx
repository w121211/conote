import React, { useState } from 'react'
import Link from 'next/link'
import { inlineService } from '../../../services/inline.service'
import { Discuss, InlineDiscuss } from '../../../interfaces'
import CreateDiscussForm from '../../../../../discuss/create-discuss-form'
import { DiscussModalPage } from '../../../../../discuss/modal-page/modal-page'
import Modal from '../../../../../modal/modal'

// const onCreate = (data: DiscussFragment) => {
//   const path = ReactEditor.findPath(editor, element)
//   const inlineDiscussStr = InlineItemService.toInlineDiscussString({
//     id: data.id,
//     title: data.title,
//   })
//   Transforms.setNodes<InlineDiscussElement>(
//     editor,
//     { id: data.id },
//     { at: path },
//   )
//   Transforms.insertText(editor, inlineDiscussStr, { at: path }) // replace existing text
//   setShowModal(false)
// }

const InlineDiscussEl = ({
  // discussModal,
  item,
}: {
  // discussModal: React.ReactNode
  item: InlineDiscuss
}): JSX.Element => {
  const { id, title, str } = item,
    [showModal, setShowModal] = useState(false),
    isDiscussCreated = id !== undefined,
    modalButtons = !isDiscussCreated && (
      <button
        form="create-discuss-form"
        className="btn-primary h-10 w-24 "
        type="submit"
      >
        提交
      </button>
    ),
    modalTopRightBtn = isDiscussCreated && (
      <Link
        href={{
          pathname: '/discuss/[discussId]',
          query: { discussId: id },
        }}
      >
        <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
          <span className="material-icons text-lg text-gray-500 hover:text-gray-700">
            open_in_full
          </span>
        </a>
      </Link>
    )

  return (
    <>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        topRightBtn={modalTopRightBtn}
        buttons={modalButtons}
      >
        {item.id ? (
          <DiscussModalPage id={item.id} title={item.title} />
        ) : (
          <CreateDiscussForm
            noteId={noteId}
            title={element.title}
            onCreate={onCreate}
          />
        )}
      </Modal>
      <span contentEditable={false}>
        {isDiscussCreated ? (
          <button
            className="btn-reset-style hover:bg-gray-100"
            onClick={() => setShowModal(true)}
          >
            {item.str}
          </button>
        ) : (
          <button
            className="btn-reset-style hover:bg-gray-100"
            onClick={() => setShowModal(true)}
          >
            {item.str}
            <span>(click to create)</span>
          </button>
        )}
      </span>
    </>
  )
}

export default InlineDiscussEl
