import { TokenStream } from 'prismjs'
import { Marker, ExtToken, ExtTokenStream, Markerline } from './typing'
import { Chance } from 'chance'

const chance = new Chance()

// export function randStr(nChar: number): string {
//   return Math.random().toString(36).substr(2, nChar)
// }

export function streamToStr(stream: TokenStream | ExtTokenStream, ignoreTokenType?: string): string {
  let t = ''

  // console.log(ignoreTokenType);
  // console.log(stream);

  if (typeof stream === 'string') {
    return stream
  } else if (Array.isArray(stream)) {
    for (const e of stream) {
      t += streamToStr(e, ignoreTokenType)
    }
  } else if (ignoreTokenType === undefined || ignoreTokenType !== stream.type) {
    t += streamToStr(stream.content, ignoreTokenType)
  }
  return t
}

export function streamToArray(stream: ExtTokenStream): Array<ExtToken | string> {
  if (Array.isArray(stream)) return stream
  return [stream]
}

export function filterTokens<T extends Prism.Token>(
  stream: string | T | (string | T)[],
  matcher: (a: T) => boolean,
): T[] {
  type TStream = string | T | (string | T)[]
  const found: T[] = []
  if (typeof stream === 'string') {
    return found
  } else if (Array.isArray(stream)) {
    return stream.reduce<T[]>((acc, cur) => acc.concat(filterTokens(cur, matcher)), [])
  } else {
    if (matcher(stream)) {
      found.push(stream)
    }
    return found.concat(filterTokens(stream.content as TStream, matcher))
  }
}

export function markerToStr(marker: Marker, addMarker = false): string {
  if (addMarker) {
    return `${marker.key}\n${marker.value}`
  }
  return marker.value || ''
}

export function toStampMarkerlinesDict(markerlines: Markerline[]): Record<string, Markerline> {
  const dict: Record<string, Markerline> = {}
  for (const e of markerlines) {
    if (e.stampId !== undefined) {
      dict[e.stampId as string] = e
    }
  }
  return dict
}

export function randString(): string {
  return chance.string({
    length: 3,
    pool: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  })
}
