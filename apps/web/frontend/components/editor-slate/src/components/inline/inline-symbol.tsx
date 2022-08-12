import { useRouter } from 'next/router'
import { useEffect } from 'react'
import {
  RenderElementProps,
  useFocused,
  useReadOnly,
  useSelected,
} from 'slate-react'
import Modal from '../../../../modal/modal'
import { InlineElementSymbol } from '../../interfaces'

const InlineSymbol = ({
  attributes,
  children,
  element,
}: RenderElementProps & {
  element: InlineElementSymbol
}): JSX.Element => {
  const router = useRouter()
  // const [contentEditable, setContentEditable] = useState(true)
  const selected = useSelected()

  useEffect(() => {
    console.log('selected', selected)
  }, [selected])

  const link = (
    <span
      className=" inline text-left text-blue-500 hover:cursor-pointer hover:bg-gray-100"
      // onMouseEnter={e => {
      //   console.log('onMouseEnter', e)
      //   setContentEditable(false)
      // }}
      // onMouseLeave={e => {
      //   console.log('onMouseLeave', e)
      //   setContentEditable(true)
      // }}
      // onClick={e => {
      //   console.log('onClick', e)
      //   router.push({
      //     pathname: router.pathname,
      //     query: {
      //       symbol: router.query.symbol,
      //       pop: element.symbol,
      //     },
      //   })
      // }}
    >
      {children}
    </span>
  )

  return (
    <>
      <Modal visible={selected} onClose={() => true}>
        <div>hello</div>
      </Modal>
      <span {...attributes}>
        {/* {contentEditable ? link : <span contentEditable={false}>{link}</span>} */}
        {link}
      </span>
    </>
  )
}

export default InlineSymbol
