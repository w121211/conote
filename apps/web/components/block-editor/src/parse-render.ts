import React from 'react'
import { Grammar, Token, tokenize, TokenStream } from 'prismjs'
import { RateChoice } from 'graphql-let/__generated__/__types__'
import { InlineItem } from './interfaces'

//
// Token Helpers
//
//
//
//
//
//

type FlatToken = {
  type?: string // 'undefined' for plain string
  string: string
}

const TokenHelper = {
  _flatten(token: string | Token, contentType?: string): FlatToken[] {
    if (typeof token === 'string') {
      return [{ type: contentType, string: token }]
    }
    if (typeof token.content === 'string') {
      return [{ type: token.type, string: token.content }]
    }
    if (Array.isArray(token.content)) {
      return token.content.reduce<FlatToken[]>(
        (acc, cur) => acc.concat(this._flatten(cur, token.type)),
        [],
      )
    }
    throw 'Unhandled case'
  },

  flatten(tokens: (string | Token)[]): FlatToken[] {
    return tokens
      .map(e => this._flatten(e))
      .reduce<FlatToken[]>((acc, cur) => [...acc, ...cur], [])
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
    } else if (
      ignoreTokenType === undefined ||
      ignoreTokenType !== stream.type
    ) {
      t += this.toString(stream.content, ignoreTokenType)
    }
    return t
  },
}

function inlineItemsToStr(inlines: InlineItem[]): string {
  return inlines.reduce((acc, cur) => `${acc}${cur.str}`, '')
}

//
// Grammar
//
//
//
//
//
//

/**
 * Regex References:
 *
 * unicode  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
 * url      https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * hashtag  https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */

const reAuthor = /\B@[\p{L}\d_]+\b/u

const reTicker = /\$[A-Z-=]+/

const reTopic = /\[\[[^\]\n]+\]\]/u

// const reDiscuss =
//   /(?<=\s|^)#([\d\s\p{Letter}\p{Terminal_Punctuation}-]+)-(c[a-z0-9]{24,29})#(?=\s|$)/u
const reDiscuss =
  /(?<=\s|^)#([\d\s\p{Letter}\p{Terminal_Punctuation}-]+)-([a-z0-9_]{12,29})#(?=\s|$)/u

const reDiscussNew =
  /(?<=\s|^)#[\d\s\p{Letter}\p{Terminal_Punctuation}-]+[\d\p{Letter}\p{Terminal_Punctuation}]#(?=\s|$)/u

const reFiltertag = /(?<=\s|^)#[\d\p{Letter}]+(?=\s|$)/

const rePoll =
  /\B!\(\(poll:(c[a-z0-9]{24,29})\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/

const rePollNew = /\B!\(\(poll\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/

const reRate = /\B!\(\(rate:(c[a-z0-9]{24,29})\)\)\(([^)]*)\)\B/

const reRateNew = /\B!\(\(rate\)\)\(([^)]*)\)\B/

const reURL =
  /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/

const reComment = /\/\/ .+$/m

export const grammar: Grammar = {
  comment: { pattern: reComment },

  poll: { pattern: rePoll },

  pollNew: { pattern: rePollNew },

  rate: { pattern: reRate },

  rateNew: { pattern: reRateNew },

  discuss: {
    pattern: reDiscuss,
    inside: {
      'discuss-bracket-start': /^#/,
      'discuss-bracket-end': /#$/,
      'discuss-id': /-(c[a-z0-9]{24,29})$/,
    },
  },

  discussNew: {
    pattern: reDiscussNew,
    inside: {
      'discuss-bracket-start': /^#/,
      'discuss-bracket-end': /#$/,
      'discuss-id': /-(c[a-z0-9]{24,29})$/,
    },
  },

  // topic: { pattern: reTopic },

  topic: {
    pattern: reTopic,
    inside: {
      'topic-bracket-head': /^\[\[/,
      'topic-bracket-tail': /]]$/,
    },
  },

  ticker: { pattern: reTicker },

  filtertag: { pattern: reFiltertag },

  author: { pattern: reAuthor },

  url: { pattern: reURL },
}

//
// Parser
//
//
//
//
//
//

/**
 * Input string, eg "!((rate:$ID))($AUTHOR $TARGET|[[Target]] #CHOICE)"
 * No validation here, validation happens in the rate-form
 */
function parseInlineRateParams(params: string[]): {
  authorName?: string
  targetSymbol?: string
  choice?: RateChoice
} {
  const [_authorName, _targetSymbol, _choice] = params
  // const matchAuthor = reAuthor.exec(_authorName)
  // const matchSymbol = parseSymbol(_targetSymbol)
  return {
    authorName: _authorName,
    targetSymbol: _targetSymbol,
    // choice: isRateChoice(_choice) ? _choice : undefined,
  }
}

/**
 *
 * TODO: validation
 */
function tokenToInlineItem(token: string | Token): InlineItem {
  if (typeof token === 'string') {
    return {
      type: 'text',
      str: token,
      token: new Token('text', token),
    }
  }

  const str = TokenHelper.toString(token.content)

  switch (token.type) {
    case 'discuss': {
      const match = reDiscuss.exec(str)
      if (match) {
        return {
          type: 'inline-discuss',
          str,
          token,
          id: match[2],
          title: match[1],
        }
      }
      throw 'parse error'
    }
    case 'discussNew': {
      return {
        type: 'inline-discuss',
        str,
        token,
        title: str.substring(1, str.length - 1), // remove '#'
      }
    }
    case 'filtertag': {
      return { type: 'inline-filtertag', str, token }
    }
    case 'poll': {
      const match = rePoll.exec(str)
      if (match) {
        return {
          type: 'inline-poll',
          str,
          token,
          id: match[1],
          choices: match[2].split(' '),
        }
      } else {
        throw `Parse poll error,: ${str}`
      }
    }
    case 'pollNew': {
      const match = rePollNew.exec(str)
      if (match) {
        return {
          type: 'inline-poll',
          str,
          token,
          choices: match[1].split(' '),
        }
      } else {
        throw `Parse poll-new error,: ${str}`
      }
    }
    case 'rate': {
      const match = reRate.exec(str)
      if (match) {
        // console.log(match[2])
        const params = match[2].split(' ')
        const { authorName, targetSymbol, choice } =
          parseInlineRateParams(params)
        return {
          type: 'inline-rate',
          id: match[1],
          str,
          token,
          params,
          authorName,
          targetSymbol,
          // choice,
        }
      } else {
        console.error(str)
        throw 'Parse error'
      }
    }
    case 'rateNew': {
      const match = reRateNew.exec(str)
      if (match) {
        const params = match[1].split(' ')
        const { authorName, targetSymbol, choice } =
          parseInlineRateParams(params)
        return {
          type: 'inline-rate',
          str,
          token,
          params,
          authorName,
          targetSymbol,
          // choice,
        }
      } else {
        console.error(str)
        throw 'Parse error'
      }
    }
    case 'author':
    case 'ticker':
    case 'topic':
    case 'url': {
      return { type: 'inline-symbol', str, token, symbol: str }
    }
    case 'comment': {
      return { type: 'inline-comment', str, token }
    }
  }
  console.error(token)
  throw new Error('[tokenToInlineItem] Token not catched')
}

/**
 * Parse block's string and transforms to inline-items
 * Currently not support nested inline item parse
 *
 * @throws Parse error
 */
export function parse(str: string): InlineItem[] {
  const tokens = tokenize(str, grammar),
    inlineItems = tokens.map(e => tokenToInlineItem(e))
  return inlineItems
}

/**
 *
 */
export function renderToken(token: Token | string): JSX.Element {
  const el = React.createElement

  if (typeof token === 'string') {
    return el('span', null, token)
  }
  if (typeof token.content === 'string') {
    switch (token.type) {
      case 'comment':
        return el('span', { className: 'text-gray-400' }, token.content)
      case 'discuss-bracket-start':
      case 'discuss-bracket-end':
      case 'topic-bracket-head':
      case 'topic-bracket-tail':
        return el(
          'span',
          { className: 'text-gray-300 dark:text-gray-500' },
          token.content,
        )
      default:
        return el('span', null, token.content)
    }
  }
  if (Array.isArray(token.content)) {
    const tokenEls = token.content.map(e => renderToken(e))
    return el(React.Fragment, null, ...tokenEls)
  }

  throw new Error('Unexpected error')
}

// export function parseRender(s: string, uid: string) {
//   // const ptN1 = performance.now(),
//   //   result = stagedParser.ast(string),
//   //   ptN2 = performance.now(),
//   //   ptNTotal = ptN2 - ptN1
//   // if (failure(result)) {
//   //   //
//   // } else {
//   //   const vt1 = performance.now(),
//   //     view = transform(result, uid),
//   //     vt2 = performance.now(),
//   //     vtTotal = vt2 - vt1
//   //   return view
//   // }
// }
