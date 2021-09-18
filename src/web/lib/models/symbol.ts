import { CardType } from '@prisma/client'

export type SymbolParsed = {
  symbolName: string
  cardType: CardType
  authorName?: string // not implemented
}

const reTicker = /^\$[A-Z0-9]+$/
const reTopic = /^\[\[[^\]]+\]\]$/
const reUrl = /^@[a-zA-Z0-9:/.]+/ // eg @https://regex101.com/ 非常簡單的 url regex，會捕捉到很多非 url 的 string

/**
 * Parse symbol, symbol分為：
 * 1. ticker: $AB, $A01
 * 2. topic: [[what ever]], [[包括unicode]]
 * 3. 包含oauthor: `$AB@someone` `[[Ha ha]]@作者`
 *
 * @throws Symbol格式無法辨識
 *
 * TODO:
 * 1. 無法區別[[topic]] vs [[https://...]], [[https://...]]應要parse為WEBPAGE
 * 2. 無法辨識oauthor
 */
export function parse(symbol: string): SymbolParsed {
  let cardType: CardType
  let authorName: string | undefined
  if (symbol.match(reTicker) !== null) {
    cardType = CardType.TICKER
  } else if (symbol.match(reTopic) !== null) {
    cardType = CardType.TOPIC
  } else if (symbol.match(reUrl) !== null) {
    cardType = CardType.WEBPAGE
  } else {
    throw new Error(`symbol格式無法辨識: ${symbol}`)
  }
  return {
    symbolName: symbol,
    cardType,
    authorName,
  }
}

// export function urlToSymbol(url: string): string | null {
//   // TODO: 需檢驗這是否符合symbol格式
//   // 若是symbo-url則返回symbol，否則返回null
//   if (url.startsWith('//')) {
//     return url.substr(2)
//   } else {
//     return null
//   }
// }

// export function symbolToUrl(symbol: string): CardSymbol & { url: string } {
//   const parsed = parseSymbol(symbol)
//   return {
//     ...parsed,
//     url: `//${parsed.name}`,
//   }
// }
