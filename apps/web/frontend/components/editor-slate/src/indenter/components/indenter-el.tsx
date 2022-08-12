import type { RenderElementProps } from 'slate-react'
import type { ElementIndenter } from '../../interfaces'

const IndenterEl = (
  props: Omit<RenderElementProps, 'element'> & { element: ElementIndenter },
) => {
  const { attributes, children, element } = props,
    { indent, error } = element

  return (
    <div
      {...attributes}
      data-indent={indent}
      style={{ marginLeft: 28 * (indent + 1) }}
      className="pt-2"
    >
      <ul className="list-disc text-gray-600">
        <li>
          {/* <li className='before:content-["-"] before:absolute before:-translate-x-full '> */}
          {error && (
            <span
              contentEditable={false}
              style={{ color: 'red', marginRight: 6 }}
            >
              Miss indent!
            </span>
          )}
          <span>{children}</span>
        </li>
      </ul>
    </div>
  )
}

export default IndenterEl
