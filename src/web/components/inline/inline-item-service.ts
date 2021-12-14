import { RateChoice } from 'graphql-let/__generated__/__types__'
import { InlinePoll } from './inline-types'

const isRateChoice = (s: string): s is RateChoice => {
  return ['LONG', 'SHORT', 'HOLD'].includes(s)
}

export const InlineItemService = {
  /**
   * inline rate string `!((rate:$ID))($AUTHOR $TARGET|[[Target]] #CHOICE)`
   * 不會做 validation，這是為了保留 user 所輸入的內容，在 rate form 裡做檢驗、修正
   */
  parseInlineRateParams(params: string[]): {
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
      choice: isRateChoice(_choice) ? _choice : undefined,
    }
  },

  toInlineRateString({
    author,
    choice,
    symbol,
    id,
  }: {
    author: string
    choice: RateChoice
    symbol: string
    id?: string
  }): string {
    // const { symbolName, cardType } = parseSymbol(targetSymbol)
    if (id) {
      return `!((rate:${id}))(@${author} ${symbol} #${choice})`
    }
    return `!((rate))(@${author} ${symbol} #${choice})`
  },

  toInlinePoll({ id, choices }: { id: string | number; choices: string[] }): InlinePoll {
    const _id = typeof id === 'number' ? id.toString() : id
    return {
      type: 'poll',
      str: `!((poll:${_id}))(${choices.join(' ')})`,
      id: _id,
      choices: choices,
    }
  },
}

// export function toInlineHashtag(hashtag: GQLHashtag | Hashtag): InlineHashtag {
//   const isGQLHashtag = (obj: GQLHashtag | Hashtag): obj is GQLHashtag => {
//     return typeof obj.id === 'string'
//   }
//   if (isGQLHashtag(hashtag)) {
//     return {
//       type: 'hashtag',
//       str: hashtag.text,
//       id: parseInt(hashtag.id),
//       hashtag,
//     }
//   }
//   return {
//     type: 'hashtag',
//     str: hashtag.text,
//     id: hashtag.id,
//   }
// }
