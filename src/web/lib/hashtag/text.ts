import { Grammar, Token, tokenize as prismTokenize, tokenize, TokenStream } from 'prismjs'
import { tokenToString } from '../token'
import { Hashtag, HashtagDraft, HashtagGroup, HashtagGroupDraft } from './types'

export const defaultCurHashtagsPlacer = '#(...)'

const reHashtag = /(\s#\(\.{3}\))?(\s#[a-zA-Z0-9])+$/

export function hashtagGroupToString(group: HashtagGroupDraft): string {
  return `(${group.pollChoices.join(' ')})`
}

function isHashtagText(text: string): boolean {
  return reHashtag.test(text)
}

/**
 * 檢查 hashtag
 * @throw 檢查有問題時丟相關錯誤
 */
// async function checkHashtag(draft: HashtagDraft, bulletHashtags: Hashtag[]) {}

function checkHashtagGroup(draft: HashtagGroupDraft): draft is HashtagGroupDraft {
  if (draft.pollChoices.length === 0) {
    throw 'poll choices 的數量需大於0'
  }
  for (const e of draft.pollChoices) {
    if (!isHashtagText(e)) {
      throw `poll choice 格式不符 hashtag: ${e}`
    }
  }
  return true
}

export const grammar: Grammar = {
  'hashtag-string': {
    pattern: /(\s#\(\.{3}\))?(\s#[a-zA-Z0-9]+)*$/,
    inside: {
      'cur-hashtags-placer': {
        pattern: /\B#\(\.{3}\)/,
      },
      hashtag: {
        pattern: /\B#[a-zA-Z0-9]+/,
      },
    },
  },
}

/**
 * ... some text ...  #(...) #A #B #C
 */
export function parseHashtags(str: string): {
  beforeHashtagStr: string
  newHashtags?: (HashtagDraft | HashtagGroupDraft)[]
} {
  const [beforeHashtagStr, hashtagStr] = tokenize(str, grammar) // 基於 grammar 可以安全的假設傳回值為 [beforeStr, hashtagStr]

  if (typeof beforeHashtagStr === 'string' && hashtagStr === undefined) {
    return { beforeHashtagStr }
  }
  if (typeof beforeHashtagStr !== 'string' && beforeHashtagStr.type === 'hashtag-string') {
    return { beforeHashtagStr: tokenToString(beforeHashtagStr) } // 缺內文，將 hashtags 視為內文
  }
  if (
    typeof beforeHashtagStr === 'string' &&
    typeof hashtagStr !== 'string' &&
    hashtagStr.type === 'hashtag-string' &&
    Array.isArray(hashtagStr.content)
  ) {
    // TODO: 檢查 new hashtags，eg 與現有的重複？
    const newHashtags = hashtagStr.content
      .filter((e): e is Token => typeof e !== 'string' && e.type === 'hashtag')
      .map<HashtagDraft | HashtagGroupDraft>(e => {
        if (e.type === 'hashtag') {
          return {
            type: 'hashtag-draft',
            op: 'CREATE',
            text: tokenToString(e.content),
          }
        }
        throw 'Unexpected error'
      })
    return { beforeHashtagStr, newHashtags }
  }
  console.error(beforeHashtagStr, hashtagStr)
  throw 'Unexpected error'
}
