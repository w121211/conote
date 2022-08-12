import React from 'react'
import { parseSymbol } from '../../../share/symbol.common'

const bracket = `text-gray-400/50 dark:text-gray-400`

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
        <span className={blueHighlight}>
          <span className={bracket}>{'[['}</span>
          {symbol.substring(2, symbol.length - 2)}
          <span className={bracket}>{']]'}</span>
        </span>
      )
    case 'URL': {
      if (url === undefined) throw new Error('url === undefined')

      const url_ =
        url.href.length > 50 ? `${url.href.slice(0, 50)}...` : url.href

      if (title) {
        return (
          <span className={blueHighlight} title={url.href}>
            <span className={bracket}>{'[['}</span>
            {url_}
            <span className="ml-2 pl-2 border-l-2 border-gray-500 text-gray-600">
              {title}
            </span>
            <span className={bracket}>{']]'}</span>
          </span>
        )
      }
      return (
        <span className={blueHighlight} title={url.href}>
          <span className={bracket}>{'[['}</span>
          {url_}
          <span className={bracket}>{']]'}</span>
        </span>
      )
    }

    case 'TICKER':
      return (
        <span className={blueHighlight}>
          <span className={bracket}>{'[['}</span>
          {symbol.substring(2, symbol.length - 2)}
          <span className={bracket}>{']]'}</span>
        </span>
      )
  }
}

export default SymbolDecorate
