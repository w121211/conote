import React from 'react'
import Link from 'next/link'
import { getNotePageURL } from '../../../../../utils'
import { editorChainItemInsert } from '../../../../block-editor/src/events'
import { PopoverPanelProps } from '../../interfaces'

const PopoverPanelSymbol = ({
  blockUid,
  draftUid,
  inlineItem,
}: PopoverPanelProps) => {
  if (inlineItem.type !== 'inline-symbol')
    throw new Error('inlineItem.type !== inline-symbol')

  const { symbol } = inlineItem

  return (
    <>
      <button onClick={e => editorChainItemInsert(symbol, draftUid)}>
        Insert
      </button>

      <Link href={getNotePageURL(symbol)}>
        <a>View</a>
      </Link>
    </>
  )
}

export default PopoverPanelSymbol
