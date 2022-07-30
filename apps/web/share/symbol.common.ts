import type { SymbolParsed } from '../lib/interfaces'

const reTicker = /^\$[A-Z0-9]+$/

const reTopic = /^\[\[[^\]]+\]\]$/

/**
 * Check is given sting a url
 *
 * @reference https://stackoverflow.com/a/43467144/2293778
 */
function isURL(str: string) {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (err) {
    return false
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
    return isURL(str)
      ? { type: 'URL', symbol, url: str }
      : { type: 'TOPIC', symbol }
  }
  throw new Error('[parseSymbol] Symbol format is not recognized, ' + symbol)
}

export function removeTopicPrefixSuffix(topicSymbol: string): string {
  return topicSymbol.substring(2, topicSymbol.length - 2)
}
