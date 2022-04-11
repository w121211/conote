import React from 'react'
import { editorRouteUpdate } from '../../../events'
import { InlineSymbol } from '../../../interfaces'

/**
 * Add -El to avoid naming conflict with `InlineSymbol`
 */
const InlineSymbolEl = ({
  inline,
  children,
}: {
  inline: InlineSymbol
  children?: React.ReactNode
}): JSX.Element => {
  return (
    <span>
      <a
        className="btn-reset-style inline text-left text-blue-500 hover:cursor-pointer hover:bg-gray-100"
        onClick={e => editorRouteUpdate({ modalSymbol: inline.symbol })}
      >
        {children ? children : inline.str}
      </a>
    </span>
  )
}

export default InlineSymbolEl
