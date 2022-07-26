import React, { useEffect, useState } from 'react'
import {
  FloatingPortal,
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
import { DropdownListItem } from '../../../../ui-component/dropdown-list-item'

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

  const [curSelectedElId] = useObservable(slateEditorRepo.curSelectedElId$),
    { x, y, reference, floating, strategy } = useFloating({ placement: 'top' }),
    [show, setShow] = useState(false)

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
      <FloatingPortal>
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
            <button
              className="dropdown-list-item"
              onClick={e => editorChainItemInsert(symbol, draftId)}
            >
              Insert
            </button>

            <Link href={getNotePageURL(symbol)}>
              <a className="dropdown-list-item">View</a>
            </Link>
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

export default LeafSymbol