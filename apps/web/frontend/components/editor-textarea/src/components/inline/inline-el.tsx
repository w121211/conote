import React, { useMemo } from 'react'
import { InlineItem } from '../../interfaces'
import { renderToken } from '../../parse-render'
import InlineDiscussEl from './components/inline-discuss-el'
import InlineSymbolEl from './components/inline-symbol-el'

const el = React.createElement

export interface InlineElProps {
  // (BUG) Add undefined to avoid type error when using React.createElement(...)
  children?: React.ReactNode

  blockUid: string

  inlineItem: InlineItem

  // If not given, assume the note is in editing
  isViewer?: true
}

const InlineEl = (props: InlineElProps) => {
  const { inlineItem, isViewer, ...rest } = props
  const { type, str } = inlineItem
  const token = useMemo(
    () => renderToken(inlineItem.token, isViewer),
    [inlineItem, isViewer],
  )

  switch (type) {
    case 'inline-discuss':
      return el(InlineDiscussEl, { inlineItem, isViewer, ...rest }, token)
    case 'inline-symbol':
      return el(InlineSymbolEl, { inlineItem, isViewer, ...rest }, token)
    case 'inline-comment':
    case 'text':
      return token
    default: {
      console.debug('Not handled type: ' + type)
      return token
    }
  }
}

export default InlineEl
