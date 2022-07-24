import React from 'react'
import Link from 'next/link'
import { getNotePageURL } from '../../../../../utils'
import { editorChainItemInsert } from '../../../../editor-textarea/src/events'
import { LeafPopoverProps } from '../../interfaces'

const PopoverPanelSymbol = ({
  blockUid,
  draftId,
  inlineItem,
}: LeafPopoverProps) => {
  if (inlineItem.type !== 'inline-symbol')
    throw new Error('inlineItem.type !== inline-symbol')

  const { symbol } = inlineItem

  return (
    <>
      <button onClick={e => editorChainItemInsert(symbol, draftId)}>
        Insert
      </button>

      <Link href={getNotePageURL(symbol)}>
        <a>View</a>
      </Link>
    </>
  )
}

export default PopoverPanelSymbol
