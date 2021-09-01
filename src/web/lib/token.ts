import { Token as PrismToken, TokenStream } from 'prismjs'
import { Range } from 'slate'

type Token = {
  type: string
  string: string
  start: number // start index in a string
}

function getLength(token: string | PrismToken): number {
  if (typeof token === 'string') {
    return token.length
  } else if (typeof token.content === 'string') {
    return token.content.length
  } else if (Array.isArray(token.content)) {
    return token.content.reduce((l, t) => l + getLength(t), 0)
  } else {
    return 0
  }
}

// export function toRanges(tokens: (string | PrismToken)[]): Range[] {
//   const ranges: [string | Token, number] = []

//   let start = 0
//   for (const token of tokens) {
//     const length = getLength(token)
//     const end = start + length
//     if (typeof token !== 'string') {
//       ranges.push({
//         // [token.type]: true,
//         type: token.type,
//         anchor: { path, offset: start },
//         focus: { path, offset: end },
//       })
//     }
//     start = end
//   }
// }

// function toTokens(prismTokens: (string | PrismToken)[]): Token[] {
//   const tokens: Token[] = []
//   let start = 0
//   for (const token of tokens) {
//     const length = getLength(token)
//     const end = start + length
//     if (typeof token !== 'string') {
//       ranges.push({
//         // [token.type]: true,
//         type: token.type,
//         anchor: { path, offset: start },
//         focus: { path, offset: end },
//       })
//     }
//     start = end
//   }
// }

export function tokenToString(stream: TokenStream, ignoreTokenType?: string): string {
  let t = ''

  if (typeof stream === 'string') {
    return stream
  } else if (Array.isArray(stream)) {
    for (const e of stream) {
      t += tokenToString(e, ignoreTokenType)
    }
  } else if (ignoreTokenType === undefined || ignoreTokenType !== stream.type) {
    t += tokenToString(stream.content, ignoreTokenType)
  }
  return t
}
