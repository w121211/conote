// import * as QT from './graphql/query-types'
import { SymbolCat, CardTemplate, CocardFragment } from '../apollo/query.graphql'
import { AnchorLike, CommentLike, LikeChoice, ReplyLike } from '@prisma/client'

export function toUrlParams(params: Record<string, string>): string {
  const sp = new URLSearchParams()
  for (const k in params) {
    sp.set(k, params[k])
  }
  return sp.toString()
}

const reTicker = /^\$[A-Z0-9]+$/
const reTopic = /^\[\[[^\]]+\]\]$/

function parse(symbolName: string): { name: string; cat: SymbolCat; oauthoName?: string } {
  let cat: SymbolCat
  let oauthoName: string | undefined

  if (symbolName.match(reTicker) !== null) {
    cat = SymbolCat.Ticker
  } else if (symbolName.match(reTopic) !== null) {
    cat = SymbolCat.Topic
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
  if (cat === SymbolCat.Ticker) {
    return symbol
  }
  if (cat === SymbolCat.Topic) {
    return `[[${symbol.replace(' ', '_')}]]`
  }
}

export function getCardUrlParam(card: CocardFragment): string {
  let params: string
  if (card.template === CardTemplate.Webpage) {
    params = toUrlParams({ u: card.link.url })
  } else {
    params = toUrlParams({ s: card.link.url.substr(2) })
  }
  return params
}

export function deltaLike(
  like: AnchorLike | CommentLike | ReplyLike,
  prevLike?: AnchorLike | CommentLike | ReplyLike,
): { deltaDown: number; deltaUp: number } {
  // 計算up-down的變化值
  let deltaUp = 0
  let deltaDown = 0
  if (prevLike) {
    switch (prevLike.choice) {
      case LikeChoice.UP:
        deltaUp -= 1
        break
      case LikeChoice.DOWN:
        deltaDown -= 1
        break
    }
  }
  switch (like.choice) {
    case LikeChoice.UP:
      deltaUp += 1
      break
    case LikeChoice.DOWN:
      deltaDown += 1
      break
  }
  return { deltaDown, deltaUp }
}