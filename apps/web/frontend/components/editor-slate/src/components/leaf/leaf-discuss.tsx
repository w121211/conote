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
import DiscussCreateForm from '../../../../discuss/DiscussCreateForm'
import DiscussModalPageEl from '../../../../discuss/discuss-modal-page-el'
import Modal from '../../../../modal/modal'
import { slateEditorRepo } from '../../stores/editor.repository'
import { LeafPopoverProps } from '../../interfaces'
import { InlineDiscuss } from '../../../../editor-textarea/src/interfaces'
import {
  DiscussFragment,
  useSearchDiscussQuery,
} from '../../../../../../apollo/query.graphql'
import { indenterTextReplace } from '../../indenter/transforms'
import type { Editor } from 'slate'
import { inlineService } from '../../../../editor-textarea/src/services/inline.service'
import { slateDocSave } from '../../events'
import { PopperTooltip } from '../../../../ui/tooltip/popper-tooltip'
import { usePrevious } from 'react-use'

// import { DropdownListItem } from '../../../../ui-component/dropdown-list-item'

/**
 * Update block string when discuss is created
 */
function discussOnCreate(
  editor: Editor,
  blockUid: string,
  inlineDiscuss: InlineDiscuss,
  discuss: DiscussFragment | { id: string; title: string },
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

const DiscussSearchHits = ({
  title,
  onClickHit,
}: {
  title: string
  onClickHit: (id: string, title: string) => void
}) => {
  const { data, refetch } = useSearchDiscussQuery({
    variables: { term: title },
  })
  const prevTitle = usePrevious(title)

  useEffect(() => {
    if (title !== prevTitle) refetch({ term: title })
  }, [title])

  return (
    <>
      <h3 className="pb-2">Search similar discussions</h3>
      <div className="flex flex-col space-y-1">
        {data && data.searchDiscuss.length > 0 ? (
          data.searchDiscuss.map(({ id, str }) => (
            <div key={id}>
              <span
                role="button"
                className="text-blue-600 hover:underline"
                onClick={() => onClickHit(id, str)}
              >
                <span className="text-gray-400">#</span>
                {str}
                <span className="text-gray-400">#</span>
              </span>
            </div>
          ))
        ) : (
          <div>Found nothing...</div>
        )}
      </div>
    </>
  )
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
  const { x, y, reference, floating, strategy, refs, update } = useFloating({
    middleware: [autoPlacement({ allowedPlacements: ['top', 'bottom'] })],
    whileElementsMounted: updateFloating,
  })
  const [showPopover, setShowPopover] = useState(false)
  const [titleInput, setTitleInput] = useState(title)

  const editor = useSlateStatic()

  const [showModal, setShowModal] = useState(false),
    // [showWarnTooltip, setShowWarnTooltip] = useState(false),
    isDiscussCreated = discussId !== undefined,
    modalTopRightBtn = isDiscussCreated && (
      <Link
        href={{
          pathname: '/discuss/[discussId]',
          query: { discussId },
        }}
      >
        <a className="flex items-center text-sm text-gray-900 hover:text-gray-600">
          <span className="material-icons-outlined text-lg text-gray-500 hover:text-gray-700">
            open_in_full
          </span>
        </a>
      </Link>
    )

  // useEffect(() => {
  //   // Delay 100 ms to avoid the flashing of popover (which is caused by the quick destroy of this element during typing)
  //   setTimeout(() => {
  //     if (curSelectedElId === id) {
  //       setShowPopover(true)
  //     } else {
  //       setShowPopover(false)
  //     }
  //   }, 100)
  // }, [curSelectedElId])

  return (
    <>
      {/* <FloatingPortal id="layout-children-container">
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
            <div className="flex">
              <button
                className="dropdown-list-item first:m-0 first:rounded-l last:m-0 last:rounded-r"
                onClick={() => setShowModal(true)}
              >
                View
              </button>
            </div>
          </div>
        )}
      </FloatingPortal> */}

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
          <>
            <DiscussCreateForm
              noteDraftId={draftId}
              title={title}
              onCreate={d =>
                discussOnCreate(editor, blockUid, inlineItem, d, docUid)
              }
              onChangeTitleInput={v => setTitleInput(v)}
            />
            <div className="m-10">
              <DiscussSearchHits
                title={titleInput}
                onClickHit={(id, title) =>
                  discussOnCreate(
                    editor,
                    blockUid,
                    inlineItem,
                    { id, title },
                    docUid,
                  )
                }
              />
            </div>
          </>
        )}
      </Modal>

      {discussId ? (
        <span
          {...attributes}
          id={id}
          ref={reference}
          className="symbol-input text-blue-600"
          // className={className}
          data-inline-item={inlineItem.type}
          role="button"
          onClick={() => setShowModal(true)}
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
            {...attributes}
            id={id}
            ref={reference}
            className="text-red-600 dark:text-red-200 bg-red-50 dark:bg-red-900 hover:bg-red-100 dark:hover:bg-red-800"
            data-inline-item={inlineItem.type}
            role="button"
            onClick={() => setShowModal(true)}
          >
            {children}
          </span>
        </PopperTooltip>
      )}
    </>
  )
}

export default LeafDiscuss
