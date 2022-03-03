import { ParsedUrlQuery } from 'querystring'
import { UrlObject } from 'url'

/**
 * localhost/card/$XX?m=$AA+p=0.1.2.0.1
 * - self-card: $XX
 * - mirror: $AA
 * - opened li path: [0, 1, 2, 0, 1]
 */

export type NavLocation = {
  selfSymbol: string
  openedLiPath: number[] // 若有 mirror 對應到的是以 mirror 為 root 的 path，若無則是 self root 的 payh
  mirrorSymbol?: string // 包括前綴符號，eg ::$XX, ::[[Hello World]]
  // author?: string // 包括前綴符號，eg @cnyes
  authorId?: string
  sourceNoteId?: string
  sourceLinkId?: string
}

/** URL search params */
const AUTHOR_KEY = 'a'
const MIRROR_KEY = 'm'
// const MIRROR_KEY_NEW = 'mirror'
const PATH_KEY = 'p'
const PATH_SPLITTER = '.'

export function getNavLocation(query: ParsedUrlQuery): NavLocation {
  const symbol = query['symbol']
  const path = query[PATH_KEY]
  const mirror = query[MIRROR_KEY]
  const author = query[AUTHOR_KEY]

  if (typeof symbol !== 'string') {
    throw 'Unexpected error'
  }
  return {
    selfSymbol: symbol,
    openedLiPath: typeof path === 'string' ? path.split(PATH_SPLITTER).map(e => parseInt(e)) : [],
    mirrorSymbol: typeof mirror === 'string' ? mirror : undefined,
    // mirrorSymbol: typeof mirror === 'string' ? mirror : undefined,
    // author: typeof author === 'string' ? author : undefined,
  }
}

export function locationToUrl(lcation: NavLocation, joinLiPath?: number[]): UrlObject {
  const { selfSymbol, mirrorSymbol, openedLiPath } = lcation

  const query: Record<string, string> = {}
  if (mirrorSymbol) {
    // params.set(MIRROR_KEY, mirrorSymbol)
    query[MIRROR_KEY] = mirrorSymbol
  }
  // if (author && mirrorSymbol) {
  //   // params.set(AUTHOR_KEY, author)
  //   query[AUTHOR_KEY] = author
  // }
  if (joinLiPath) {
    // const merged = [...openedLiPath, 1, ...joinLiPath]
    // params.set(PATH_KEY, merged.join(PATH_SPLITTER))
    query[PATH_KEY] = [...openedLiPath, 1, ...joinLiPath].join(PATH_SPLITTER)
  } else if (openedLiPath.length > 0) {
    // params.set(PATH_KEY, openedLiPath.join(PATH_SPLITTER))
    query[PATH_KEY] = openedLiPath.join(PATH_SPLITTER)
  }
  // const _params = params.toString()
  // return _params.length > 0
  //   ? `/card/${encodeURIComponent(selfSymbol)}?${params.toString()}`
  //   : `/card/${encodeURIComponent(selfSymbol)}`
  return {
    pathname: '/card/[symbol]',
    // pathname: query[MIRROR_KEY_NEW] ? `/card/[symbol]?mirror=${query[MIRROR_KEY_NEW]}&` : '/card/[symbol]',
    query: {
      ...query,
      symbol: selfSymbol,
    },
  }
}
