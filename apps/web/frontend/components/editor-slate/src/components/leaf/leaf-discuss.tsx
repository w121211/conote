import React, { useEffect, useState } from 'react'
import {
  autoPlacement,
  autoUpdate,
  computePosition,
  FloatingPortal,
  hide,
  useFloating,
} from '@floating-ui/react-dom-interactions'
import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import { RenderLeafProps, useSlateStatic } from 'slate-react'
import DiscussForm from '../../../../discuss/discuss-form'
import DiscussModalPageEl from '../../../../discuss/discuss-modal-page-el'
import Modal from '../../../../modal/modal'
import { slateEditorRepo } from '../../stores/editor.repository'
import { LeafPopoverProps } from '../../interfaces'
import { InlineDiscuss } from '../../../../editor-textarea/src/interfaces'
import { DiscussFragment } from '../../../../../../apollo/query.graphql'
import { indenterTextReplace } from '../../indenter/transforms'
import type { Editor } from 'slate'
import { inlineService } from '../../../../editor-textarea/src/services/inline.service'
import { slateDocSave } from '../../events'
// import { DropdownListItem } from '../../../../ui-component/dropdown-list-item'

/**
 * Update block string when discuss is created
 */
function discussOnCreate(
  editor: Editor,
  blockUid: string,
  inlineDiscuss: InlineDiscuss,
  discuss: DiscussFragment,
  docUid: string,
): void {
  indenterTextReplace(
    editor,
    blockUid,
    inlineDiscuss.str,
    inlineService.toInlineDiscussString(discuss.id, discuss.title),
  )
  slateDocSave(docUid)
}

const LeafDiscuss = ({
  leafProps,
  popoverProps,
}: {
  leafProps: RenderLeafProps
  popoverProps: LeafPopoverProps<InlineDiscuss>
}) => {
  const { attributes, leaf, children } = leafProps,
    { id, blockUid, docUid, draftId, inlineItem } = popoverProps,
    { id: discussId, title, str } = inlineItem

  const updateFloating = () => {
    const referenceEl = refs.reference.current
    const floatingEl = refs.floating.current
    if (referenceEl && floatingEl) {
      autoUpdate(referenceEl, floatingEl, () => {
        computePosition(referenceEl, floatingEl, {
          middleware: [hide()],
        }).then(({ middlewareData }) => {
          if (middlewareData.hide) {
            const { referenceHidden } = middlewareData.hide
            referenceHidden ? setShowPopover(false) : false
          }
        })
        update()
      })
    }
  }

  const [curSelectedElId] = useObservable(slateEditorRepo.curSelectedElId$),
    { x, y, reference, floating, strategy, refs, update } = useFloating({
      middleware: [autoPlacement({ allowedPlacements: ['top', 'bottom'] })],
      whileElementsMounted: updateFloating,
    }),
    [showPopover, setShowPopover] = useState(false)

  const editor = useSlateStatic()

  const [showModal, setShowModal] = useState(false),
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
    // Delay 100 ms to avoid the flashing of popover (which is caused by the quick destroy of this element during typing)
    setTimeout(() => {
      if (curSelectedElId === id) {
        setShowPopover(true)
      } else {
        setShowPopover(false)
      }
    }, 100)
  }, [curSelectedElId])

  return (
    <>
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
            onCreate={d =>
              discussOnCreate(editor, blockUid, inlineItem, d, docUid)
            }
          />
        )}
      </Modal>

      <FloatingPortal>
        {showPopover && (
          <div
            className="details-menu opacity-100 scale-100 "
            ref={floating}
            style={{
              display: 'block',

              position: strategy,
              top: y ?? 0,
              left: x ?? 0,
            }}
          >
            <button
              className="dropdown-list-item"
              onClick={() => setShowModal(true)}
            >
              {discussId ? 'View' : 'Create'}
            </button>

            <button
              className="dropdown-list-item"
              onClick={() => {
                indenterTextReplace(
                  editor,
                  blockUid,
                  inlineItem.str,
                  '#hello world!!!#',
                )
                setShowPopover(false)
              }}
            >
              Replace
            </button>
          </div>
        )}
      </FloatingPortal>

      <span
        {...attributes}
        id={id}
        ref={reference}
        className="symbol-link"
        // className={className}
        data-inline-item={inlineItem.type}
      >
        {children}
      </span>
    </>
  )
}

export default LeafDiscuss
