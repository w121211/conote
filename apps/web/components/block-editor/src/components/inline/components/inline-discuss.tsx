import React, { useState } from 'react'
import Link from 'next/link'
import { DiscussFragment } from '../../../../../../apollo/query.graphql'
import CreateDiscussForm from '../../../../../discuss/create-discuss-form'
import { DiscussModalPage } from '../../../../../discuss/modal-page/modal-page'
import { Tooltip } from '../../../../../../layout/tooltip/tooltip'
import Modal from '../../../../../modal/modal'
import { blockStrReplace } from '../../../events'
import { InlineDiscuss } from '../../../interfaces'
import { inlineService } from '../../../services/inline.service'
import { InlineElProps } from '../inline-el'

/**
 * Update block string when discuss is created
 */
function discussOnCreate(
  blockUid: string,
  inlineDiscuss: InlineDiscuss,
  discuss: DiscussFragment,
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
    // [showWarnTooltip, setShowWarnTooltip] = useState(false),
    isDiscussCreated = id !== undefined,
    modalButtons = !isDiscussCreated && (
      <button
        form="create-discuss-form"
        className={`btn-primary h-10 w-24 `}
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
        <span
          className="relative text-blue-500 hover:bg-gray-100"
          onClick={() => setShowModal(true)}
          role="button"
        >
          {children}
        </span>
      ) : (
        <Tooltip
          title="⚠ 尚未創建"
          // visible={showWarnTooltip}
          // visible={showWarnTooltip}
          // onClose={() => setShowWarnTooltip(false)}
          size="sm"
          state="warn"
        >
          <span
            // relative 為必要 才可點擊到 和 hover 效果

            className="relative text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 "
            onClick={() => setShowModal(true)}
            // onMouseEnter={() => {
            //   setShowWarnTooltip(true)
            // }}
            // onMouseLeave={() => {
            //   setShowWarnTooltip(false)
            // }}
            role="button"
          >
            {children}
            {/* <span>(click to create)</span> */}
          </span>
        </Tooltip>
      )}
    </>
  )
}

export default InlineDiscussEl
