import React from 'react'
import { SymbolParsed } from '../../../lib/interfaces'
import { parseSymbol } from '../../../share/symbol.common'
import { decorateId } from '../decorators'

const bracketLeft = 'text-gray-300 dark:text-gray-300 font-light'
const bracketRight = 'text-gray-300 dark:text-gray-300 font-light'

export function styleSymbol(
  symbolParsed: SymbolParsed,
  urlTitle: string | null,
  opts: {
    color?: 'gray' | 'blue'
  } = { color: 'blue' },
): {
  bracketLeftSpan: JSX.Element | null
  bracketRightSpan: JSX.Element | null
  symbolSpan: JSX.Element
  urlTitleSpan: JSX.Element | null
} {
  const { symbol, type, url } = symbolParsed
  const symbolCls =
    opts.color === 'gray'
      ? 'text-gray-600 dark:text-gray-300 whitespace-pre-wrap'
      : 'text-blue-600 dark:text-blue-300 whitespace-pre-wrap'

  const bracketLeftSpan = <span className={bracketLeft}>{'[['}</span>
  const bracketRightSpan = <span className={bracketRight}>{']]'}</span>
  const symbolSpan = (
    <span className={symbolCls}>{symbol.substring(2, symbol.length - 2)}</span>
  )

  switch (type) {
    case 'TOPIC':
      return {
        bracketLeftSpan,
        bracketRightSpan,
        symbolSpan,
        urlTitleSpan: null,
      }
    case 'URL': {
      if (url === undefined) throw new Error('url === undefined')

      const url_ =
        url.href.length > 50 ? `${url.href.slice(0, 50)}...` : url.href
      return {
        bracketLeftSpan,
        bracketRightSpan,
        symbolSpan: <span className={symbolCls}>{url_}</span>,
        urlTitleSpan: (
          <span className="text-gray-600 font-light">{urlTitle}</span>
        ),
      }
    }
    default:
      throw new Error('Unhandle symbol type: ' + type)
  }
}

const SymbolDecorate = ({
  symbol,
  title,
  id,
  gray,
}: {
  symbol: string
  title?: string | null
  id?: string
  gray?: true
}) => {
  const symbolParsed = parseSymbol(symbol)
  const { bracketLeftSpan, bracketRightSpan, symbolSpan, urlTitleSpan } =
    styleSymbol(symbolParsed, title ?? null, gray && { color: 'gray' })

  return (
    <>
      {bracketLeftSpan}
      {symbolSpan}
      {bracketRightSpan}
      {urlTitleSpan}
      {id && decorateId(id)}
    </>
  )
}

export default SymbolDecorate
