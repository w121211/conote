import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
// import { parseHashtags } from '../hashtag/text'
import { tokenToString } from '../token'
import { InlineItem, InlineText } from './types'

/**
 * Regex
 * url @see https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * hashtag @see https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */

const decorateReMirrorTicker = /^(::\$[A-Z-=]+)\b/u
const decorateReMirrorTopic = /^(::\[\[[\p{Letter}\d\s(),-]+\]\])\B/u
const reMirrorTicker = /^(::\$[A-Z-=]+)\b(?:\s@([\p{Letter}\d_]+))?/u
const reMirrorTopic = /^(::\[\[[\p{Letter}\d\s(),-]+\]\])\B(?:\s@([\p{Letter}\d_]+))?/u
const rePoll = /\B!\(\(poll:(\d+)\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const reNewPoll = /\B!\(\(poll\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/

const grammar: Grammar = {
  // 'mirror-ticker': { pattern: /^::\$[A-Z-=]+\b/ },
  // 'mirror-topic': { pattern: /^::\[\[[^\]\n]+\]\]\B/u },
  'mirror-ticker': { pattern: reMirrorTicker },
  'mirror-topic': { pattern: reMirrorTopic },
  ticker: { pattern: /\$[A-Z-=]+/ },
  topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  url: {
    pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },
  user: { pattern: /\B@[\p{L}\d_]+\b/u },
  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },
  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
}
const decorationGrammar: Grammar = {
  // 'mirror-ticker': { pattern: /^::\$[A-Z-=]+\b/ },
  // 'mirror-topic': { pattern: /^::\[\[[^\]\n]+\]\]\B/u },
  'mirror-ticker': { pattern: decorateReMirrorTicker },
  'mirror-topic': { pattern: decorateReMirrorTopic },
  ticker: { pattern: /\$[A-Z-=]+/ },
  topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  url: {
    pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },
  user: { pattern: /\B@[\p{L}\d_]+\b/u },
  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },
  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
}

export function decorationTokenizer(text: string): (string | Token)[] {
  return prismTokenize(text, decorationGrammar)
}
export function tokenizeBulletString(text: string): (string | Token)[] {
  return prismTokenize(text, grammar)
}

export function inlinesToString(inlines: InlineItem[]): string {
  return inlines.reduce((acc, cur) => `${acc}${cur.str}`, '')
}

/**
 * Parse a bullet head/body string to slate inline elements
 * @throws Validation error
 */
export function parseBulletHead(props: {
  str: string
  // connected?: { hashtags?: InlineHashtag[] }
}): {
  headInlines: InlineItem[]
  // connectedInlines?: (InlineText | InlineHashtag | InlineNewHashtag)[]
} {
  // const { str, connected } = props
  const { str } = props

  // TODO: validate
  function tokenToInline(token: string | Token): InlineItem {
    if (typeof token === 'string') {
      return { type: 'text', str: token }
    }

    const str = tokenToString(token.content)
    switch (token.type) {
      case 'mirror-ticker':
      case 'mirror-topic': {
        const match = token.type === 'mirror-ticker' ? reMirrorTicker.exec(str) : reMirrorTopic.exec(str)
        if (match) {
          return {
            type: 'mirror',
            str,
            mirrorSymbol: match[1],
            author: match[2], // 沒有 match 到時會返回 undefined
          }
        } else {
          console.error(str)
          throw 'Parse error'
        }
      }
      case 'filtertag': {
        return { type: 'filtertag', str }
      }
      case 'url':
      case 'ticker':
      case 'topic':
      case 'user': {
        return { type: 'symbol', str, symbol: str }
      }
      case 'poll': {
        const match = rePoll.exec(str)
        if (match) {
          return {
            type: 'poll',
            str,
            id: match[1],
            choices: match[2].split(' '),
          }
        } else {
          console.error(str)
          throw 'Parse error'
        }
      }
      case 'new-poll': {
        const match = reNewPoll.exec(str)
        if (match) {
          return {
            type: 'poll',
            str,
            choices: match[1].split(' '),
          }
        } else {
          console.error(str)
          throw 'Parse error'
        }
      }
    }
    console.error(token)
    throw 'Parse error'
  }

  // const { beforeHashtagStr, inlines: hashtagInlines } = parseHashtags({ str, connectedHashtags: connected?.hashtags })
  // const tokens = tokenizeBulletString(beforeHashtagStr)
  // const beforeHashtagInlines = tokens.map(e => tokenToInline(e))
  // return {
  //   headInlines: beforeHashtagInlines,
  //   connectedInlines: hashtagInlines,
  // }

  const tokens = tokenizeBulletString(str)
  const inlines = tokens.map(e => tokenToInline(e))
  return { headInlines: inlines }
}
