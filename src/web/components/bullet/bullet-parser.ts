import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
import { InlineItem } from '../inline/inline-types'
import { InlineRateService } from '../inline/inline-services'
import { TokenHelper } from '../../common/token-helper'

/**
 * Regex:
 * - url @see https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * - hashtag @see https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */

const reTicker = /\$[A-Z-=]+/
const reTopic = /\[\[[^\]\n]+\]\]/u
export const reAuthor = /\B@[\p{L}\d_]+\b/u

const decorateReMirrorTicker = /^(::\$[A-Z-=]+)\b/u
const decorateReMirrorTopic = /^(::\[\[[\p{Letter}\d\s(),-]+\]\])\B/u

const reMirrorTicker = /^(::\$[A-Z-=]+)\b(?:\s@([\p{Letter}\d_]+))?/u
const reMirrorTopic = /^(::\[\[[\p{Letter}\d\s(),-]+\]\])\B(?:\s@([\p{Letter}\d_]+))?/u
// const rePoll = /\B!\(\(poll:(\d+)\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const rePoll = /\B!\(\(poll:(c[a-z0-9]{24,29})\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const reNewPoll = /\B!\(\(poll\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const reRate = /\B!\(\(rate:(c[a-z0-9]{24,29})\)\)\(([^)]*)\)\B/
const reNewRate = /\B!\(\(rate\)\)\(([^)]*)\)\B/
const reURL = /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/

const grammar: Grammar = {
  // 順序重要，先 mirror 後 ticker
  'mirror-ticker': { pattern: reMirrorTicker },
  'mirror-topic': { pattern: reMirrorTopic },

  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },

  rate: { pattern: reRate },
  'new-rate': { pattern: reNewRate },

  ticker: { pattern: reTicker },
  topic: { pattern: reTopic },

  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },

  url: { pattern: reURL },

  author: { pattern: reAuthor },
}

const decorateGrammar: Grammar = {
  // 順序重要，先 mirror 後 ticker
  'mirror-ticker': { pattern: reMirrorTicker },
  'mirror-topic': { pattern: reMirrorTopic },

  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },

  rate: { pattern: reRate },
  'new-rate': { pattern: reNewRate },

  ticker: { pattern: reTicker },
  topic: {
    pattern: reTopic,
    inside: {
      'topic-bracket-head': /^\[\[/,
      'topic-bracket-tail': /]]$/,
    },
  },

  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },

  url: { pattern: reURL },

  author: { pattern: reAuthor },
}

export function tokenizeBulletString(text: string): (string | Token)[] {
  return prismTokenize(text, grammar)
}

export function tokenizeBulletStringWithDecorate(text: string): (string | Token)[] {
  return prismTokenize(text, decorateGrammar)
}

export function inlinesToString(inlines: InlineItem[]): string {
  return inlines.reduce((acc, cur) => `${acc}${cur.str}`, '')
}

export const BulletParser = {
  /**
   * Parse a bullet head/body string to slate inline elements
   *
   * @throws Parse error
   */
  parseBulletHead({ str }: { str: string }): { inlines: InlineItem[] } {
    // TODO: validate
    function _tokenToInline(token: string | Token): InlineItem {
      if (typeof token === 'string') {
        return { type: 'text', str: token }
      }

      const str = TokenHelper.toString(token.content)
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
        case 'author': {
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
        case 'rate': {
          const match = reRate.exec(str)
          if (match) {
            console.log(match[2])
            const params = match[2].split(' ')
            const { authorName, targetSymbol, choice } = InlineRateService.parseParams(params)
            return {
              type: 'rate',
              id: match[1],
              str,
              params,
              authorName,
              targetSymbol,
              choice,
            }
          } else {
            console.error(str)
            throw 'Parse error'
          }
        }
        case 'new-rate': {
          const match = reNewRate.exec(str)
          if (match) {
            const params = match[1].split(' ')
            const { authorName, targetSymbol, choice } = InlineRateService.parseParams(params)
            return {
              type: 'rate',
              str,
              params,
              authorName,
              targetSymbol,
              choice,
            }
          } else {
            console.error(str)
            throw 'Parse error'
          }
        }
      }
      // 沒被處理到的 token
      console.error(token)
      throw 'Parse error'
    }

    const tokens = tokenizeBulletString(str)
    const inlines = tokens.map(e => _tokenToInline(e))
    return { inlines }
  },
}
