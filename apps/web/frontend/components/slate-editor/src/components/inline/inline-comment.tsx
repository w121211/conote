import React from 'react'
import { RenderElementProps } from 'slate-react'
import type { InlineElementComment } from '../../interfaces'

const InlineComment = ({
  children,
  attributes,
  element,
}: RenderElementProps & { element: InlineElementComment }): JSX.Element => {
  console.log(element)
  return (
    <span {...attributes} className="align-top">
      <span className="inline-block max-w-[10rem] align-top truncate text-gray-400">
        {children}
      </span>
    </span>
  )
}

export default InlineComment
