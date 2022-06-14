import type { SymType } from 'graphql-let/__generated__/__types__'

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
 *
 * @throws Symbol format is not recognized
 *
 * TODOS:
 * - [] Not able to distinguish bettween [[topic]] vs [[https://...]],
 *      while [[https://...]] should be parsed as URL?
 * - [] Not able to recognize author
 */
export function parseSymbol(symbol: string): {
  symbol: string
  type: SymType
} {
  let type: SymType
  if (symbol.match(reTicker) !== null) {
    type = 'TICKER'
  } else if (symbol.match(reTopic) !== null) {
    type = 'TOPIC'
  } else if (isURL(symbol)) {
    type = 'URL'
  } else {
    throw new Error(`[parseSymbol] Not recognized symbol: ${symbol}`)
  }
  return { symbol, type }
}

export function removeTopicPrefixSuffix(topicSymbol: string): string {
  return topicSymbol.substring(2, topicSymbol.length - 2)
}
