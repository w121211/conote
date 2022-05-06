import React from 'react'
import { editorRouteUpdate } from '../../../events'
import { InlineSymbol } from '../../../interfaces'
import { InlineElProps } from '../inline-el'

const InlineSymbolEl = ({
  children,
  inline,
}: InlineElProps & {
  inline: InlineSymbol
}): JSX.Element => {
  return (
    <span
      className="relative text-blue-500 hover:bg-gray-100"
      onClick={e => editorRouteUpdate({ modalSymbol: inline.symbol })}
      role="button"
    >
      {children}
      {/* <button
       
        
      >
      </button> */}
    </span>
  )
}

export default InlineSymbolEl