import React, { useState, useMemo, useCallback, useEffect, CSSProperties } from 'react'
import { RenderElementProps } from 'slate-react'
import { InlineFiltertagElement } from '../editor/slate-custom-types'

const InlineFiltertag = ({
  attributes,
  children,
  element,
}: RenderElementProps & { element: InlineFiltertagElement }): JSX.Element => {
  return <span {...attributes}>{children}</span>
}

export default InlineFiltertag
