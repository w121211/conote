import React from 'react'
import { editorChainItemInsert } from '../../../../block-editor/src/events'
import { PopoverPanelProps } from '../../interfaces'

const PopoverPanelSymbol = ({
  blockUid,
  draftUid,
  inlineItem,
}: PopoverPanelProps) => {
  if (inlineItem.type !== 'inline-discuss')
    throw new Error('inlineItem.type !== inline-discuss')

  return (
    <>
      <button
        onClick={e => {
          // editorChainItemInsert(text, draftUid)
          // console.log('onClick button', uid, curSelectedElId)
          // e.preventDefault()
          // e.stopPropagation()
        }}
      >
        Create
      </button>
    </>
  )
}

export default PopoverPanelSymbol
