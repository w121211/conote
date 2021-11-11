// import * as QT from './graphql/query-types'
// import { SymbolCat, CardTemplate, CocardFragment } from '../apollo/query.graphql'
import { EmojiLike, LikeChoice } from '.prisma/client'

export function hasCount<T, U>(v: T & { count: U | null }): v is T & { count: U } {
  return v.count !== null
}

export function toStringId<T extends { id: number }>(obj: T): T & { id: string } {
  return { ...obj, id: obj.id.toString() }
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

export function deltaLike<T extends EmojiLike>(like: T, prevLike?: T): { dDown: number; dUp: number } {
  // 計算up-down的變化值
  let dUp = 0
  let dDown = 0
  if (prevLike) {
    switch (prevLike.choice) {
      case LikeChoice.UP:
        dUp -= 1
        break
      case LikeChoice.DOWN:
        dDown -= 1
        break
    }
  }
  switch (like.choice) {
    case LikeChoice.UP:
      dUp += 1
      break
    case LikeChoice.DOWN:
      dDown += 1
      break
  }
  return { dDown, dUp }
}
