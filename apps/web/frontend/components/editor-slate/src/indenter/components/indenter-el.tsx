import type { RenderElementProps } from 'slate-react'
import type { ElementIndenter } from '../../interfaces'

const IndenterEl = (
  props: Omit<RenderElementProps, 'element'> & { element: ElementIndenter },
) => {
  const { attributes, children, element } = props,
    { indent, error } = element,
    marginLeft = 32 * indent // pixel

  return (
    <div
      {...attributes}
      data-indent={indent}
      // className={`ml-1`}
      // className={`ml-[${marginLeft}px]`}
      style={{ marginLeft }}
    >
      <ul>
        <li className='before:content-["-"] before:mr-2'>
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
