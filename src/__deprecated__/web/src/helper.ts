import * as QT from './graphql/query-types'

export function toUrlParams(params: Record<string, string>): string {
  const sp = new URLSearchParams()
  for (const k in params) {
    sp.set(k, params[k])
  }
  return sp.toString()
}

const reTicker = /^\$[A-Z0-9]+$/
const reTopic = /^\[\[[^\]]+\]\]$/

function parse(symbolName: string): { name: string; cat: QT.SymbolCat; oauthoName?: string } {
  let cat: QT.SymbolCat
  let oauthoName: string | undefined

  if (symbolName.match(reTicker) !== null) {
    cat = QT.SymbolCat.TICKER
  } else if (symbolName.match(reTopic) !== null) {
    cat = QT.SymbolCat.TOPIC
  } else {
    throw new Error(`尚未支援的symbol format${symbolName}`)
  }
  return { name: symbolName, cat, oauthoName }
}

export function urlToSymbol(url: string): string | null {
  // 若是symbo-url則返回symbol，否則返回null
  if (url.startsWith('//')) {
    return url.substr(2)
  } else {
    return null
  }
}

export function symbolToUrl(symbolName: string): string {
  const parsed = parse(symbolName)
  return `//${parsed.name}`
}

export function encodeSymbol(symbol: string, cat: QT.SymbolCat) {
  if (cat === QT.SymbolCat.TICKER) {
    return symbol
  }
  if (cat === QT.SymbolCat.TOPIC) {
    return `[[${symbol.replace(' ', '_')}]]`
  }
}

export function getCardUrlParam(card: QT.cocardFragment): string {
  let params: string
  if (card.template === QT.CardTemplate.WEBPAGE) {
    params = toUrlParams({ u: card.link.url })
  } else {
    params = toUrlParams({ s: card.link.url.substr(2) })
  }
  return params
}
