import React, { useMemo } from 'react'
import { InlineItem } from '../../interfaces'
import { renderToken } from '../../parse-renderer'
import InlineDiscussEl from './components/inline-discuss'
import InlineSymbolEl from './components/inline-symbol-el'

export type InlineElProps = {
  // (BUG) add undefined to avoid type error when using React.createElement(...)
  children?: React.ReactNode

  blockUid: string
  inline: InlineItem
}

const InlineEl = ({
  blockUid,
  inline,
}: {
  blockUid: string
  inline: InlineItem
}) => {
  const { type, str } = inline,
    token = useMemo(() => renderToken(inline.token), [inline]),
    el = React.createElement

  switch (type) {
    case 'inline-discuss':
      return el(InlineDiscussEl, { blockUid, inline }, token)
    case 'inline-symbol':
      return el(InlineSymbolEl, { blockUid, inline }, token)
    case 'text':
      return <span>{str}</span>
  }
  return null
}

export default InlineEl
