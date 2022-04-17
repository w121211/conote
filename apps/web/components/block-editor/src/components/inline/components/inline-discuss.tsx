import React, { useState } from 'react'
import Link from 'next/link'
import CreateDiscussForm from '../../../../../discuss/create-discuss-form'
import { DiscussModalPage } from '../../../../../discuss/modal-page/modal-page'
import Modal from '../../../../../modal/modal'
import { Discuss, InlineDiscuss } from '../../../interfaces'
import { InlineElProps } from '../inline-el'
import { blockStrReplace } from '../../../events'
import { inlineService } from '../../../services/inline.service'

/**
 * Update block string when discuss is created
 */
function discussOnCreate(
  blockUid: string,
  inlineDiscuss: InlineDiscuss,
  discuss: Discuss,
): void {
  blockStrReplace(
    blockUid,
    inlineDiscuss.str,
    inlineService.toInlineDiscussString(discuss.id, discuss.title),
  )
}

const InlineDiscussEl = ({
  children,
  blockUid,
  inline,
}: {
  inline: InlineDiscuss
} & InlineElProps): JSX.Element => {
  const { id, title, str } = inline,
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
        {id ? (
          <DiscussModalPage id={id} title={title} />
        ) : (
          <CreateDiscussForm
            title={title}
            onCreate={data => discussOnCreate(blockUid, inline, data)}
          />
        )}
      </Modal>
      {isDiscussCreated ? (
        <button
          className="btn-reset-style hover:bg-gray-100"
          onClick={() => setShowModal(true)}
        >
          {children}
        </button>
      ) : (
        <button
          className="btn-reset-style hover:bg-gray-100"
          onClick={() => setShowModal(true)}
        >
          {children}
          <span>(click to create)</span>
        </button>
      )}
    </>
  )
}

export default InlineDiscussEl
