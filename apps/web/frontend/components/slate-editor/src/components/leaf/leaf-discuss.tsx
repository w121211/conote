import {
  FloatingPortal,
  useFloating,
} from '@floating-ui/react-dom-interactions'
import { useObservable } from '@ngneat/react-rxjs'
import { nanoid } from 'nanoid'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RenderLeafProps } from 'slate-react'
import { InlineDiscuss } from '../../../../block-editor/src/interfaces'
import DiscussForm from '../../../../discuss/discuss-form'
import DiscussModalPageEl from '../../../../discuss/discuss-modal-page-el'
import Modal from '../../../../modal/modal'
import { slateEditorRepo } from '../../stores/editor.repository'

const PopoverPanel = (props: {
  blockUid: string
  draftId: string
  inlineItem: InlineDiscuss
}) => {
  const { blockUid, draftId, inlineItem } = props,
    { id, title, str } = inlineItem,
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

  //   if (isViewer) {
  //     return <InlineDiscussViewer {...props} />
  //   }
  return (
    <>
      <button onClick={() => setShowModal(true)}>
        {id ? 'View' : 'Create'}
      </button>
    </>
  )
}

const PopoverLeafDiscuss = ({
  leafProps,
  id,
  inlineItem,
  draftId,
}: {
  leafProps: RenderLeafProps
  id: string
  blockUid: string
  draftId: string
  inlineItem: InlineDiscuss
}) => {
  const { attributes, leaf, children } = leafProps
  const [curSelectedElId] = useObservable(slateEditorRepo.curSelectedElId$),
    { x, y, reference, floating, strategy } = useFloating({ placement: 'top' }),
    [show, setShow] = useState(false)

  const { id: discussId, title, str } = inlineItem,
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

  useEffect(() => {
    console.log('curSelectedElId', curSelectedElId, id, curSelectedElId === id)
    // Delay 100 ms to avoid the flashing of popover (which is caused by the quick destroy of this element during typing)
    setTimeout(() => {
      if (curSelectedElId === id) {
        setShow(true)
      } else {
        setShow(false)
      }
    }, 100)
  }, [curSelectedElId])

  return (
    <>
      <span
        {...attributes}
        id={id}
        ref={reference}
        className="text-blue-600"
        // className={className}
        data-inline-item={leaf.inlineItem.type}
      >
        {children}
      </span>

      <Modal
        visible={showModal}
        onClose={() => setShowModal(false)}
        topRightBtn={modalTopRightBtn}
        // buttons={modalButtons}
      >
        {discussId ? (
          <div className="px-10">
            <DiscussModalPageEl id={discussId} />
          </div>
        ) : (
          <DiscussForm
            noteDraftId={draftId}
            title={title}
            // onCreate={d => onCreateDiscuss(blockUid, inline, d, doc)}
            onCreate={d => d}
          />
        )}
      </Modal>

      <FloatingPortal>
        {show && (
          <div
            ref={floating}
            style={{
              display: 'block',
              background: 'cyan',
              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
          >
            {/* <PopoverPanel {...restProps} /> */}
            <>
              <button onClick={() => setShowModal(true)}>
                {id ? 'View' : 'Create'}
              </button>
            </>
          </div>
        )}
      </FloatingPortal>
    </>
  )
}

export default PopoverLeafDiscuss
