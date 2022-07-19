import { useRouter } from 'next/router'
import { RenderElementProps } from 'slate-react'
import { InlineElementSymbol } from '../../interfaces'

const InlineSymbol = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: InlineElementSymbol
}): JSX.Element => {
  const router = useRouter()
  return (
    <span {...attributes} contentEditable={false}>
      <a
        className=" inline text-left text-blue-500 hover:cursor-pointer hover:bg-gray-100"
        onClick={e =>
          router.push({
            pathname: router.pathname,
            query: {
              symbol: router.query.symbol,
              pop: element.symbol,
            },
          })
        }
      >
        {children}
      </a>
    </span>
  )
}

export default InlineSymbol
