import React from 'react'
import { parseSymbol } from '../../../share/symbol.common'

const bracketLeft = 'text-gray-400 dark:text-gray-400 font-light'
const bracketRight = 'text-gray-400 dark:text-gray-400 font-light'
const blueHighlight = `text-blue-600 dark:text-blue-300`

const SymbolDecorate = ({
  symbolStr,
  title,
}: {
  symbolStr: string
  title?: string
}) => {
  const { type, symbol, url } = parseSymbol(symbolStr)

  switch (type) {
    case 'TOPIC':
      return (
        <>
          <span className={bracketLeft}>{'[['}</span>
          <span className={blueHighlight}>
            {symbol.substring(2, symbol.length - 2)}
          </span>
          <span className={bracketRight}>{']]'}</span>
        </>
      )
    case 'URL': {
      if (url === undefined) throw new Error('url === undefined')

      const url_ =
        url.href.length > 50 ? `${url.href.slice(0, 50)}...` : url.href

      if (title) {
        return (
          <>
            <span className={bracketLeft}>{'[['}</span>
            {/* <span className="text-blue-600">{title}</span>
            <span className="text-gray-400 font-light ml-1">{url_}</span> */}
            <span className="text-blue-600">{url_}</span>
            <span className={bracketRight}>{']]'}</span>
            <span className="text-gray-500 font-light ml-2">{title}</span>
          </>
          // <span className={blueHighlight} title={url.href}>
          // </span>
        )
      }
      return (
        <span className={blueHighlight} title={url.href}>
          <span className={bracketLeft}>{'[['}</span>
          {url_}
          <span className={bracketRight}>{']]'}</span>
        </span>
      )
    }

    case 'TICKER':
      return (
        <span className={blueHighlight}>
          <span className={bracketLeft}>{'[['}</span>
          {symbol.substring(2, symbol.length - 2)}
          <span className={bracketRight}>{']]'}</span>
        </span>
      )
  }
}

export default SymbolDecorate
