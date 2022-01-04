import { useRouter } from 'next/router'
import { RenderElementProps } from 'slate-react'
import { InlineSymbolElement } from '../editor/slate-custom-types'

const InlineSymbol = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: InlineSymbolElement
}): JSX.Element => {
  const router = useRouter()
  return (
    <span {...attributes} contentEditable={false}>
      <button
        className="btn-reset-style text-blue-500 hover:cursor-pointer hover:underline hover:underline-offset-2"
        onClick={e => {
          // e.preventDefault()
          // e.stopPropagation()
          // router.push(`/card/${encodeURIComponent(element.symbol)}`)
          router.push({
            pathname: router.pathname,
            query: {
              symbol: router.query.symbol,
              pop: element.symbol,
            },
          })
        }}
      >
        {children}
      </button>
    </span>
  )
}

export default InlineSymbol
