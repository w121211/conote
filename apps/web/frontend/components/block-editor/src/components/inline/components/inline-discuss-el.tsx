import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { DiscussFragment } from '../../../../../../../apollo/query.graphql'
import DiscussForm from '../../../../../discuss/discuss-form'
import Modal from '../../../../../modal/modal'
import { blockStrReplace, docSave } from '../../../events'
import { Doc, InlineDiscuss } from '../../../interfaces'
import { inlineService } from '../../../services/inline.service'
import { InlineElProps } from '../inline-el'
import DiscussModalPageEl from '../../../../../discuss/discuss-modal-page-el'
import { PopperTooltip } from '../../../../../ui-component/tooltip/popper-tooltip'
import { getDocByBlock } from '../../../stores/doc.repository'

/**
 * Update block string when discuss is created
 */
function onCreateDiscuss(
  blockUid: string,
  inlineDiscuss: InlineDiscuss,
  discuss: DiscussFragment,
  doc: Doc,
): void {
  blockStrReplace(
    blockUid,
    inlineDiscuss.str,
    inlineService.toInlineDiscussString(discuss.id, discuss.title),
  )
  docSave(doc.uid)
}

const InlineDiscussViewer = ({
  children,
  blockUid,
  inline,
  isViewer,
}: {
  inline: InlineDiscuss
} & InlineElProps): JSX.Element => {
  const { id, title, str } = inline,
    [showModal, setShowModal] = useState(false),
    isDiscussCreated = id !== undefined,
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
      {id && (
        <Modal
          visible={showModal}
          onClose={() => setShowModal(false)}
          topRightBtn={modalTopRightBtn}
          // buttons={modalButtons}
        >
          <div className="px-10">
            <DiscussModalPageEl id={id} />
          </div>
        </Modal>
      )}
      {isDiscussCreated ? (
        <span
          className="relative symbol-link"
          onClick={() => setShowModal(true)}
          role="button"
        >
          {children}
        </span>
      ) : (
        <PopperTooltip
          label="⚠ Discuss has not created yet"
          // visible={showWarnTooltip}
          // visible={showWarnTooltip}
          // onClose={() => setShowWarnTooltip(false)}
          size="sm"
          type="warning"
        >
          <span
            // 'relative' is required for clickable and hover effect
            className="relative text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800 "
            // onClick={() => setShowModal(true)}
            // role="button"
          >
            {children}
            {/* <span>(click to create)</span> */}
          </span>
        </PopperTooltip>
      )}
    </>
  )
}

/**
 *
 */
const InlineDiscussEl = (
  props: {
    inline: InlineDiscuss
  } & InlineElProps,
): JSX.Element => {
  const { children, blockUid, inline, isViewer } = props,
    { id, title, str } = inline,
    [showModal, setShowModal] = useState(false),
    // [showWarnTooltip, setShowWarnTooltip] = useState(false),
    isDiscussCreated = id !== undefined,
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

  if (isViewer) {
    return <InlineDiscussViewer {...props} />
  }

  const doc = useMemo(() => getDocByBlock(blockUid), [blockUid])
  // if (doc.noteDraftCopy === undefined)
  //   throw new Error('doc.noteDraftCopy === undefined')

  return (
    <>
      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        topRightBtn={modalTopRightBtn}
        // buttons={modalButtons}
      >
        {id ? (
          <div className="px-10">
            <DiscussModalPageEl id={id} />
          </div>
        ) : doc ? (
          <DiscussForm
            noteDraftId={doc.noteDraftCopy.id}
            title={title}
            onCreate={d => onCreateDiscuss(blockUid, inline, d, doc)}
          />
        ) : (
          <div>You</div>
        )}
      </Modal>

      {isDiscussCreated ? (
        <span
          className="relative symbol-link"
          onClick={() => setShowModal(true)}
          role="button"
        >
          {children}
        </span>
      ) : (
        <PopperTooltip
          label="⚠ Click to create the discuss"
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
          </span>
        </PopperTooltip>
      )}
    </>
  )
}

export default InlineDiscussEl
