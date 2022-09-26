import type { RenderElementProps } from 'slate-react'
import type { ElementIndenter } from '../../interfaces'
import { IndenterFormatErrorCode } from '../normalizers'

function renderErrorCode(code: IndenterFormatErrorCode) {
  switch (code) {
    case IndenterFormatErrorCode.IndenterOverSize:
      return (
        <span contentEditable={false} style={{ color: 'red', marginRight: 6 }}>
          Wrong indentation. Press Shift+Tab to fix.
        </span>
      )
  }
}

const IndenterEl = (
  props: Omit<RenderElementProps, 'element'> & { element: ElementIndenter },
) => {
  const { attributes, children, element } = props,
    { indent, errorCode } = element

  return (
    <div
      {...attributes}
      data-indent={indent}
      style={{ marginLeft: 28 * (indent + 1) }}
      className="pt-2"
    >
      <ul className="list-disc text-gray-600 text-sm">
        <li>
          {/* <li className='before:content-["-"] before:absolute before:-translate-x-full '> */}
          {errorCode && renderErrorCode(errorCode)}
          <span>{children}</span>
        </li>
      </ul>
    </div>
  )
}

export default IndenterEl
