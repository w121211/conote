import Link from 'next/link'
import { useRouter } from 'next/router'
import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  CSSProperties,
  useRef,
} from 'react'
import { RenderElementProps } from 'slate-react'
import { InlineElementFiltertag } from '../../interfaces'

// function usePrevious(value: any) {
//   const ref = useRef()
//   useEffect(() => {
//     ref.current = value
//   })
//   return ref.current
// }

const InlineFiltertag = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: InlineElementFiltertag }): JSX.Element => {
  const [showModal, setShowModal] = useState(false)
  const router = useRouter()
  // const prevRouter = usePrevious(router.query)
  // const doc:Doc = useObservable(() => workspace.mainDoc$)

  // useEffect(() => {
  //   if (router.isReady) {
  //     if (prevRouter !== router.query) {
  //       console.log(router.query, prevRouter)
  //       if (router.query.discuss && typeof router.query.discuss === 'string') {
  //         // setShowModal(true)
  //       } else {
  //         // setShowModal(false)
  //       }
  //     } else {
  //       return
  //     }
  //   }
  // }, [router.query.discuss])
  return (
    <span {...attributes} contentEditable={false}>
      <button
        className=" text-green-600 hover:underline-offset-2 hover:underline"
        onClick={() => {
          // setShowModal(true)
          router.push(
            // { pathname: '/discuss/[discussId]', query: { discussId: element.str } },
            {
              pathname: router.pathname,
              query: { symbol: router.query.symbol, discuss: element.str },
            },
            `/discuss/${encodeURIComponent(element.str)}`,
            {
              shallow: true,
            },
          )
        }}
      >
        {children}
      </button>
    </span>
  )
}

export default InlineFiltertag
