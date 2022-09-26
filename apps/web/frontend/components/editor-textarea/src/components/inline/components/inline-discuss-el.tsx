import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { DiscussFragment } from '../../../../../../../apollo/query.graphql'
import DiscussCreateForm from '../../../../../discuss/DiscussCreateForm'
import Modal from '../../../../../modal/modal'
import { blockStrReplace, docSave } from '../../../events'
import { Doc, InlineDiscuss } from '../../../interfaces'
import { inlineService } from '../../../services/inline.service'
import { InlineElProps } from '../inline-el'
import DiscussModalPageEl from '../../../../../discuss/discuss-modal-page-el'
import { PopperTooltip } from '../../../../../ui/tooltip/popper-tooltip'
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

const InlineDiscussViewer = ({ children, inlineItem }: Props): JSX.Element => {
  const { id, title, str } = inlineItem
  if (id) {
    return (
      <Link
        href={{
          pathname: '/discuss/[discussId]',
          query: { discussId: id },
        }}
      >
        <a className="relative symbol-input text-blue-600">{children}</a>
      </Link>
    )
  }
  return (
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
  )
}

interface Props extends InlineElProps {
  inlineItem: InlineDiscuss
}

/**
 *
 */
const InlineDiscussEl = (props: Props): JSX.Element => {
  const { children, blockUid, inlineItem, isViewer } = props
  const { id, title, str } = inlineItem
  const [showModal, setShowModal] = useState(false)
  // [showWarnTooltip, setShowWarnTooltip] = useState(false),
  const isDiscussCreated = id !== undefined
  const modalTopRightBtn = isDiscussCreated && (
    <Link
      href={{
        pathname: '/discuss/[discussId]',
        query: { discussId: id },
      }}
    >
      <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
        <span className="material-icons-outlined text-lg text-gray-500 hover:text-gray-700">
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
          <DiscussCreateForm
            noteDraftId={doc.noteDraftCopy.id}
            title={title}
            onCreate={d => onCreateDiscuss(blockUid, inlineItem, d, doc)}
          />
        ) : (
          <div>You</div>
        )}
      </Modal>

      {isDiscussCreated ? (
        <span
          className="relative symbol-input text-red-600"
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
