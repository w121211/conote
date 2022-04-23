import React from 'react'
import { editorRouteUpdate } from '../../../events'
import { InlineSymbol } from '../../../interfaces'
import { InlineElProps } from '../inline-el'

const InlineSymbolEl = ({
  children,
  inline,
}: InlineElProps & { inline: InlineSymbol }): JSX.Element => {
  return (
    <button
      className="btn-reset-style inline text-left text-blue-500 hover:cursor-pointer hover:bg-gray-100"
      onClick={e => editorRouteUpdate({ modalSymbol: inline.symbol })}
    >
      {children}
    </button>
  )
}

export default InlineSymbolEl
