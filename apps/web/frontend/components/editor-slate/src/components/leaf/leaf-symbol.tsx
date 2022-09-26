import React, { useEffect, useState } from 'react'
import {
  autoPlacement,
  autoUpdate,
  computePosition,
  detectOverflow,
  flip,
  FloatingPortal,
  hide,
  MiddlewareArguments,
  offset,
  useFloating,
} from '@floating-ui/react-dom-interactions'
import { useObservable } from '@ngneat/react-rxjs'
import Link from 'next/link'
import { RenderLeafProps } from 'slate-react'
import { InlineSymbol } from '../../../../editor-textarea/src/interfaces'
import { slateEditorRepo } from '../../stores/editor.repository'
import { LeafPopoverProps } from '../../interfaces'
import { editorChainItemInsert } from '../../../../editor-textarea/src/events'
import { getNotePageURL } from '../../../../../utils'
// import { DropdownListItem } from '../../../../ui-component/dropdown-list-item'

const LeafSymbol = ({
  leafProps,
  popoverProps,
}: {
  leafProps: RenderLeafProps
  popoverProps: LeafPopoverProps<InlineSymbol>
}) => {
  const { attributes, children } = leafProps,
    { id, blockUid, draftId, inlineItem } = popoverProps,
    { symbol } = inlineItem

  const [show, setShow] = useState(false)

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
            referenceHidden ? setShow(false) : false
          }
        })
        update()
      })
    }
  }
  const [curSelectedElId] = useObservable(slateEditorRepo.curSelectedElId$),
    { x, y, reference, floating, strategy, refs, update } = useFloating({
      placement: 'top',
      // middleware: [autoPlacement({ allowedPlacements: ['top', 'bottom'] })],
      middleware: [offset(10)],
      whileElementsMounted: updateFloating,
    })

  useEffect(() => {
    // console.debug('curSelectedElId', curSelectedElId, id, curSelectedElId === id)

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
      <FloatingPortal id="layout-children-container">
        {show && (
          <div
            className="details-menu opacity-100 scale-100"
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
                onClick={e => editorChainItemInsert(symbol, draftId)}
              >
                Insert
              </button>

              <Link href={getNotePageURL(symbol)}>
                <a className="dropdown-list-item first:m-0 first:rounded-l last:m-0 last:rounded-r">
                  View
                </a>
              </Link>
            </div>
          </div>
        )}
      </FloatingPortal>

      <span
        {...attributes}
        id={id}
        ref={reference}
        className="symbol-input text-blue-600"
        data-inline-item={inlineItem.type}
      >
        {children}
      </span>
    </>
  )
}

export default LeafSymbol
