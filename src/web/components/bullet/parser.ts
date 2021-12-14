import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
import { ShotChoice } from 'graphql-let/__generated__/__types__'
// import { parseInlineShotParams } from '../models/shot'
import { tokenToString } from '../../lib/token'
import { InlineItem } from './types'

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
const reShot = /\B!\(\(shot:(c[a-z0-9]{24,29})\)\)\(([^)]*)\)\B/
const reNewShot = /\B!\(\(shot\)\)\(([^)]*)\)\B/

const grammar: Grammar = {
  // 順序重要，先 mirror 後 ticker
  'mirror-ticker': { pattern: reMirrorTicker },
  'mirror-topic': { pattern: reMirrorTopic },

  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },

  shot: { pattern: reShot },
  'new-shot': { pattern: reNewShot },

  ticker: { pattern: reTicker },
  topic: { pattern: reTopic },

  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },

  url: {
    pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },

  author: { pattern: reAuthor },
}

const decorationGrammar: Grammar = {
  // 'mirror-ticker': { pattern: /^::\$[A-Z-=]+\b/ },
  // 'mirror-topic': { pattern: /^::\[\[[^\]\n]+\]\]\B/u },
  'mirror-ticker': { pattern: decorateReMirrorTicker, inside: { punctuation: /^::|\[\[|\]\]/g } },
  'mirror-topic': { pattern: decorateReMirrorTopic, inside: { punctuation: /^::|\[\[|\]\]/g } },
  poll: { pattern: rePoll },
  'new-poll': { pattern: reNewPoll },
  shot: { pattern: reShot },
  'new-shot': { pattern: reNewShot },
  ticker: { pattern: reTicker },
  topic: { pattern: reTopic, inside: { punctuation: /^::|\[\[|\]\]/g } },
  filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
  url: {
    pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },
  author: { pattern: reAuthor },
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

const isShotChoice = (s: string): s is ShotChoice => {
  return ['#LONG', '#SHORT', '#HOLD'].includes(s)
}

const parseInlineShotParams = (
  params: string[],
): {
  authorName?: string
  targetSymbol?: string
  choice?: ShotChoice
} => {
  const [_authorName, _targetSymbol, _choice] = params
  // const matchAuthor = reAuthor.exec(_authorName)
  // const matchSymbol = parseSymbol(_targetSymbol)
  return {
    authorName: _authorName,
    targetSymbol: _targetSymbol,
    choice: isShotChoice(_choice) ? _choice : undefined,
  }
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
        case 'shot': {
          const match = reShot.exec(str)
          if (match) {
            console.log(match[2])
            const params = match[2].split(' ')
            const { authorName, targetSymbol, choice } = parseInlineShotParams(params)
            return {
              type: 'shot',
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
        case 'new-shot': {
          const match = reNewShot.exec(str)
          if (match) {
            const params = match[1].split(' ')
            const { authorName, targetSymbol, choice } = parseInlineShotParams(params)
            return {
              type: 'shot',
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
