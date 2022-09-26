import Link from 'next/link'
import React from 'react'
import { getNotePageURL } from '../../../../../../utils'
import { editorChainItemInsert } from '../../../events'
import type { InlineSymbol } from '../../../interfaces'
import { getDocByBlock } from '../../../stores/doc.repository'
import type { InlineElProps } from '../inline-el'

const InlineSymbolEl = ({
  blockUid,
  children,
  inlineItem: { symbol },
  isViewer,
}: InlineElProps & {
  inlineItem: InlineSymbol
}): JSX.Element => {
  if (isViewer) {
    return (
      <Link href={getNotePageURL(symbol)}>
        <a>
          <span className="relative symbol-input">{children}</span>
        </a>
      </Link>
    )
  }
  return (
    <span
      className="relative symbol-input"
      onClick={e => {
        const doc = getDocByBlock(blockUid)
        return editorChainItemInsert(symbol, doc.noteDraftCopy.id)
      }}
      role="button"
    >
      {children}
    </span>
  )
}

export default InlineSymbolEl
