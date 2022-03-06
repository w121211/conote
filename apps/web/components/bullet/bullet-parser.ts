import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
import { InlineItem } from '../inline/inline-item-types'
import { InlineItemService } from '../inline/inline-item-service'
import { TokenHelper } from '../../common/token-helper'

/**
 * Regex references:
 * - unicode @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Unicode_Property_Escapes
 * - url @see https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * - hashtag @see https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */
export const reAuthor = /\B@[\p{L}\d_]+\b/u
export const reTicker = /\$[A-Z-=]+/
export const reTopic = /\[\[[^\]\n]+\]\]/u
const reDiscuss = /(?<=\s|^)#([\d\s\p{Letter}\p{Terminal_Punctuation}-]+)-(c[a-z0-9]{24,29})#(?=\s|$)/u
const reDiscussNew =
  /(?<=\s|^)#[\d\s\p{Letter}\p{Terminal_Punctuation}-]+[\d\p{Letter}\p{Terminal_Punctuation}]#(?=\s|$)/u
export const reFiltertag = /(?<=\s|^)#[\d\p{Letter}]+(?=\s|$)/
// const reMirrorTicker = /^(::\$[A-Z-=]+)\b(?:\s@([\p{Letter}\d_]+))?/u
// const reMirrorTopic = /^(::\[\[[\p{Letter}\d\s(),$%-]+\]\])\B(?:\s@([\p{Letter}\d_]+))?/u
const rePoll = /\B!\(\(poll:(c[a-z0-9]{24,29})\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const rePollNew = /\B!\(\(poll\)\)\(((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+)\)\B/
const reRate = /\B!\(\(rate:(c[a-z0-9]{24,29})\)\)\(([^)]*)\)\B/
const reRateNew = /\B!\(\(rate\)\)\(([^)]*)\)\B/
const reURL = /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/
const reComment = /\/\/ .+/g

const grammar: Grammar = {
  //   'mirror-ticker': {
  //     pattern: reMirrorTicker,
  //     inside: {
  //       'mirror-head': /^:{2}/,
  //     },
  //   }, // order matters, mirror -> ticker
  //   'mirror-topic': {
  //     pattern: reMirrorTopic,
  //     inside: {
  //       'mirror-topic-bracket-head': /^:{2}\[\[/,
  //       'topic-bracket-tail': /]]$/,
  //     },
  //   },
  comment: { pattern: reComment },
  poll: { pattern: rePoll },
  'poll-new': { pattern: rePollNew },
  rate: { pattern: reRate },
  'rate-new': { pattern: reRateNew },
  discuss: {
    pattern: reDiscuss,
    inside: {
      'discuss-bracket-start': /^#/,
      'discuss-bracket-end': /#$/,
      'discuss-id': /-(c[a-z0-9]{24,29})$/,
    },
  },
  'discuss-new': { pattern: reDiscussNew },
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

// const decorateGrammar: Grammar = {
//   // order matters, mirror -> ticker
//   'mirror-ticker': {
//     pattern: reMirrorTicker,
//     inside: {
//       'mirror-head': /^:{2}/,
//     },
//   },
//   'mirror-topic': {
//     pattern: reMirrorTopic,
//     inside: {
//       'mirror-topic-bracket-head': /^:{2}\[\[/,
//       'topic-bracket-tail': /]]$/,
//     },
//   },
//   // poll: { pattern: rePoll },
//   // 'new-poll': { pattern: reNewPoll },

//   // rate: { pattern: reRate },
//   // 'new-rate': { pattern: reNewRate },

//   // ticker: { pattern: reTicker },
//   // topic: {
//   //   pattern: reTopic,
//   //   inside: {
//   //     'topic-bracket-head': /^\[\[/,
//   //     'topic-bracket-tail': /]]$/,
//   //   },
//   // },

//   // filtertag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()\u4E00-\u9FFF]+#(?=\s|$)/ },

//   // url: { pattern: reURL },

//   // author: { pattern: reAuthor },
// }

export const tokenizeBulletString = (text: string): (string | Token)[] => {
  return prismTokenize(text, grammar)
}

// export const tokenizeBulletStringWithDecorate = (text: string): (string | Token)[] => {
//   return prismTokenize(text, decorateGrammar)
// }

export const inlinesToString = (inlines: InlineItem[]): string => {
  return inlines.reduce((acc, cur) => `${acc}${cur.str}`, '')
}

export const BulletParser = {
  /**
   * Parse a bullet head/body string to slate inline elements
   * @throws Parse error
   *
   */
  parse(str: string): { inlines: InlineItem[] } {
    // TODO: validate
    const _tokenToInlineItem = (token: string | Token): InlineItem => {
      if (typeof token === 'string') {
        return { type: 'text', str: token }
      }

      const str = TokenHelper.toString(token.content)
      switch (token.type) {
        case 'discuss': {
          const match = reDiscuss.exec(str)
          if (match) {
            return {
              type: 'inline-discuss',
              str,
              id: match[2],
            }
          }
          throw 'parse error'
        }
        case 'discuss-new': {
          return {
            type: 'inline-discuss',
            str,
          }
        }
        case 'filtertag': {
          return { type: 'inline-filtertag', str }
        }
        // case 'mirror-ticker':
        // case 'mirror-topic': {
        //   const match = token.type === 'mirror-ticker' ? reMirrorTicker.exec(str) : reMirrorTopic.exec(str)
        //   if (match) {
        //     return {
        //       type: 'inline-mirror',
        //       str,
        //       mirrorSymbol: match[1],
        //       author: match[2], // 沒有 match 到時會返回 undefined
        //     }
        //   } else {
        //     console.error(str)
        //     throw 'Parse error'
        //   }
        // }
        case 'poll': {
          const match = rePoll.exec(str)
          if (match) {
            return {
              type: 'inline-poll',
              str,
              id: match[1],
              choices: match[2].split(' '),
            }
          } else {
            throw `Parse poll error,: ${str}`
          }
        }
        case 'poll-new': {
          const match = rePollNew.exec(str)
          if (match) {
            return {
              type: 'inline-poll',
              str,
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
            const { authorName, targetSymbol, choice } = InlineItemService.parseInlineRateParams(params)
            return {
              type: 'inline-rate',
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
        case 'rate-new': {
          const match = reRateNew.exec(str)
          if (match) {
            const params = match[1].split(' ')
            const { authorName, targetSymbol, choice } = InlineItemService.parseInlineRateParams(params)
            return {
              type: 'inline-rate',
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
        case 'author':
        case 'ticker':
        case 'topic':
        case 'url': {
          return { type: 'inline-symbol', str, symbol: str }
        }
      }
      // tokens not catched
      console.error(token)
      throw 'Parse error'
    }

    const tokens = tokenizeBulletString(str)
    const inlines = tokens.map(e => _tokenToInlineItem(e))

    return { inlines }
  },
}
