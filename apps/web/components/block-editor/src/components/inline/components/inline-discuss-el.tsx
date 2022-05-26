import React, { useState } from 'react'
import Link from 'next/link'
import { DiscussFragment } from '../../../../../../apollo/query.graphql'
import CreateDiscussForm from '../../../../../discuss/create-discuss-form'
// import { DiscussModalPage } from '../../../../../discuss/modal-page/modal-page'
import Modal from '../../../../../modal/modal'
import { blockStrReplace } from '../../../events'
import { InlineDiscuss } from '../../../interfaces'
import { inlineService } from '../../../services/inline.service'
import { InlineElProps } from '../inline-el'
import { DiscussPageComponent } from '../../../../../discuss/discuss-page'
import { Tooltip } from '../../../../../ui-component/tooltip/tooltip'

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
        Submint
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

  console.log(id)

  return (
    <>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        topRightBtn={modalTopRightBtn}
        buttons={modalButtons}
      >
        {id ? (
          <div className="px-10">
            <DiscussPageComponent id={id} />
          </div>
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
          title="⚠ Discuss is not created yet"
          // visible={showWarnTooltip}
          // visible={showWarnTooltip}
          // onClose={() => setShowWarnTooltip(false)}
          size="sm"
          type="warning"
        >
          <span
            // 'relative' is required for clickable and hover effect
            className="relative text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 "
            onClick={() => setShowModal(true)}
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
