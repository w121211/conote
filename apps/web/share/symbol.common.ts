import type { SymbolParsed } from '../lib/interfaces'

export const reTicker = /^\$[A-Z0-9]+$/

export const reTopic = /^\[\[[^[\]\n]+\]\]$/

/**
 * Check is given sting a url
 * @reference https://stackoverflow.com/a/43467144/2293778
 */
function parseURL(str: string): URL | null {
  try {
    const url = new URL(str)
    if (url.protocol === 'http:' || url.protocol === 'https:') {
      return url
    }
    return null
  } catch (err) {
    return null
  }
}

/**
 * Attempt to parse a symbol
 * @throws Symbol format is not recognized
 *
 * TODOS:
 * - [x] Not able to distinguish bettween [[topic]] vs [[https://...]],
 *      while [[https://...]] should be parsed as URL?
 * - [] Not able to recognize author
 */
export function parseSymbol(symbol: string): SymbolParsed {
  if (symbol.match(reTicker) !== null) {
    return { type: 'TICKER', symbol }
  }
  if (symbol.match(reTopic) !== null) {
    const str = symbol.slice(2, -2)
    const url = parseURL(str)

    if (url) {
      return { type: 'URL', symbol, url }
    }
    return { type: 'TOPIC', symbol }
  }

  throw new Error('Symbol format is not recognized: ' + symbol)
}

export function removeTopicPrefixSuffix(topicSymbol: string): string {
  return topicSymbol.substring(2, topicSymbol.length - 2)
}

export function toURLSymbol(url: string): string {
  return `[[${url}]]`
}
