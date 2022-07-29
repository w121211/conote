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
      style={{ marginLeft: 24 * (indent + 1) }}
    >
      <ul className="list-disc" style={{ padding: 0, margin: 0 }}>
        <li>
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
