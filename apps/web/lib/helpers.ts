// import * as QT from './graphql/query-types'
// import { SymbolCat, CardTemplate, CocardFragment } from '../apollo/query.graphql'

export function hasCount<T, U>(
  v: T & { count: U | null },
): v is T & { count: U } {
  return v.count !== null
}

export function toStringProps<
  T extends { id: number | string; createdAt: Date; updatedAt: Date },
>(
  obj: T,
): Omit<T, 'id' | 'createdAt' | 'updatedAt'> & {
  id: string
  createdAt: string
  updatedAt: string
} {
  const { id, createdAt, updatedAt, ...rest } = obj
  return {
    ...rest,
    id: id.toString(),
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }
}

// export function toUrlParams(params: Record<string, string>): string {
//   const sp = new URLSearchParams()
//   for (const k in params) {
//     sp.set(k, params[k])
//   }
//   // console.log(params)
//   return sp.toString()
// }

// export function urlToSymbol(url: string): string | null {
//   // 若是symbo-url則返回symbol，否則返回null
//   if (url.startsWith('//')) {
//     return url.substr(2)
//   } else {
//     return null
//   }
// }

// export function symbolToUrl(symbolName: string): string {
//   const parsed = parse(symbolName)
//   console.log(parsed)
//   return `//${parsed.name}`
// }

// export function encodeSymbol(symbol: string, cat: QT.SymbolCat) {
//   if (cat === SymbolCat.Ticker) {
//     return symbol
//   }
//   if (cat === SymbolCat.Topic) {
//     return `[[${symbol.replace(' ', '_')}]]`
//   }
// }

// export function getCardUrlParam(card: CardFragment): string {
//   let params: string
//   // console.log(card)
//   if (card.template === CardTemplate.Webpage) {
//     params = toUrlParams({ u: card.link.url })
//   } else {
//     params = toUrlParams({ s: card.link.url.substr(2) })
//   }
//   return params
// }

export function isClientSide(): boolean {
  return typeof window !== 'undefined'
}
