import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getNotePageURL } from '../../../../../utils'
import { editorOpenSymbolInModal } from '../../../events'
import { InlineSymbol } from '../../../interfaces'
import { InlineElProps } from '../inline-el'

const InlineSymbolEl = ({
  children,
  inline: { symbol },
  isViewer,
}: InlineElProps & {
  inline: InlineSymbol
}): JSX.Element => {
  const router = useRouter()

  if (isViewer) {
    return (
      <Link href={getNotePageURL('view', symbol)}>
        <a>
          <span className="relative symbol-link">{children}</span>
        </a>
      </Link>
    )
  }
  return (
    <span
      className="relative symbol-link"
      onClick={e => editorOpenSymbolInModal(symbol, router)}
      role="button"
    >
      {children}
    </span>
  )
}

export default InlineSymbolEl
