import { Token, TokenStream } from 'prismjs'

type FlatToken = {
  type?: string // 'undefined' for plain string
  string: string
}

export const TokenHelper = {
  _flatten(token: string | Token, contentType?: string): FlatToken[] {
    if (typeof token === 'string') {
      return [{ type: contentType, string: token }]
    }
    if (typeof token.content === 'string') {
      return [{ type: token.type, string: token.content }]
    }
    if (Array.isArray(token.content)) {
      return token.content.reduce<FlatToken[]>((acc, cur) => acc.concat(this._flatten(cur, token.type)), [])
    }
    throw 'Unhandled case'
  },

  flatten(tokens: (string | Token)[]): FlatToken[] {
    return tokens.map(e => this._flatten(e)).reduce<FlatToken[]>((acc, cur) => [...acc, ...cur], [])
  },

  getLength(token: string | Token): number {
    if (typeof token === 'string') {
      return token.length
    } else if (typeof token.content === 'string') {
      return token.content.length
    } else if (Array.isArray(token.content)) {
      return token.content.reduce((l, t) => l + this.getLength(t), 0)
    } else {
      return 0
    }
  },

  toString(stream: TokenStream, ignoreTokenType?: string): string {
    let t = ''

    if (typeof stream === 'string') {
      return stream
    } else if (Array.isArray(stream)) {
      for (const e of stream) {
        t += this.toString(e, ignoreTokenType)
      }
    } else if (ignoreTokenType === undefined || ignoreTokenType !== stream.type) {
      t += this.toString(stream.content, ignoreTokenType)
    }
    return t
  },
}
