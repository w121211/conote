import { ParsedUrlQuery } from 'querystring'

/**
 * localhost/card/$XX?m=$AA+p=0.1.2.0.1
 * - self-card: $XX
 * - mirror: $AA
 * - opened li path: [0, 1, 2, 0, 1]
 */

export type NavLocation = {
  selfSymbol: string
  mirrorSymbol?: string
  openedLiPath: number[]
}

/** URL search params */
const MIRROR_KEY = 'm'
const PATH_KEY = 'p'
const PATH_SPLITTER = '.'

export function getNavLocation(query: ParsedUrlQuery): NavLocation {
  const s = query['symbol']
  const m = query[MIRROR_KEY]
  const p = query[PATH_KEY]

  if (typeof s !== 'string') {
    throw 'Unexpected error'
  }

  return {
    selfSymbol: s,
    mirrorSymbol: typeof m === 'string' ? m : undefined,
    openedLiPath: typeof p === 'string' ? p.split(PATH_SPLITTER).map(e => parseInt(e)) : [],
  }
}

export function pathToHref(lcation: NavLocation, joinLiPath?: number[]): string {
  const { selfSymbol, mirrorSymbol, openedLiPath } = lcation

  const params = new URLSearchParams()
  if (mirrorSymbol) {
    params.set(MIRROR_KEY, mirrorSymbol)
  }
  if (joinLiPath) {
    const merged = [...openedLiPath, 1, ...joinLiPath]
    params.set(PATH_KEY, merged.join(PATH_SPLITTER))
  } else if (openedLiPath.length > 0) {
    params.set(PATH_KEY, openedLiPath.join(PATH_SPLITTER))
  }
  const _params = params.toString()
  return _params.length > 0 ? `/card/${selfSymbol}?${params.toString()}` : `/card/${selfSymbol}`
}
