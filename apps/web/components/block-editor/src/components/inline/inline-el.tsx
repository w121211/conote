import React, { useMemo } from 'react'
import { InlineItem } from '../../interfaces'
import { renderToken } from '../../parse-render'
import InlineDiscussEl from './components/inline-discuss-el'
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
}): JSX.Element => {
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
  // return null

  throw new Error('[InlineEl] Unexpected case')
}

export default InlineEl
