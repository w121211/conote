import { useRouter } from 'next/router'
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
  const router = useRouter()

  return (
    <span
      className="relative text-blue-500 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-600"
      onClick={e => editorRouteUpdate({ modalSymbol: inline.symbol, router })}
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
