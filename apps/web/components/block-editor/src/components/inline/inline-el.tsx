import React, { useMemo } from 'react'
import { InlineItem } from '../../interfaces'
import { renderToken } from '../../parse-render'
import InlineDiscussEl from './components/inline-discuss-el'
import InlineSymbolEl from './components/inline-symbol-el'

export type InlineElProps = {
  // (BUG) Add undefined to avoid type error when using React.createElement(...)
  children?: React.ReactNode

  blockUid: string
  inline: InlineItem

  // If not given, assume the note is in editing
  isViewer?: true
}

const InlineEl = (props: InlineElProps): JSX.Element => {
  const { inline, children, ...rest } = props,
    { type, str } = inline,
    token = useMemo(() => renderToken(inline.token), [inline]),
    el = React.createElement

  switch (type) {
    case 'inline-discuss':
      return el(InlineDiscussEl, { inline, ...rest }, token)
    case 'inline-symbol':
      return el(InlineSymbolEl, { inline, ...rest }, token)
    case 'text':
      return <span>{str}</span>
    default: {
      console.debug('[InlineEl] Not processed type: ' + type)
      return <span>{str}</span>
    }
  }
}

export default InlineEl
