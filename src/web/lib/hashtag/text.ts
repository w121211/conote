import { Grammar, Token, tokenize as prismTokenize, tokenize, TokenStream } from 'prismjs'
import { Hashtag as GQLHashtag } from '../../apollo/query.graphql'
import { InlineItem, InlineText } from '../bullet/types'
import { tokenToString } from '../token'
// import { Hashtag, HashtagDraft, HashtagGroup, HashtagGroupDraft } from './types'

// export const defaultCurHashtagsPlacer = '#(...)'

// const reHashtag = /(\s#\(\.{3}\))?(\s#[a-zA-Z0-9])+$/

// export function hashtagGroupToString(group: HashtagGroupDraft): string {
//   return `(${group.pollChoices.join(' ')})`
// }

// function isHashtagText(text: string): boolean {
//   return reHashtag.test(text)
// }

// /**
//  * 檢查 hashtag
//  * @throw 檢查有問題時丟相關錯誤
//  */
// // async function checkHashtag(draft: HashtagDraft, bulletHashtags: Hashtag[]) {}

// function checkHashtagGroup(draft: HashtagGroupDraft): draft is HashtagGroupDraft {
//   if (draft.pollChoices.length === 0) {
//     throw 'poll choices 的數量需大於0'
//   }
//   for (const e of draft.pollChoices) {
//     if (!isHashtagText(e)) {
//       throw `poll choice 格式不符 hashtag: ${e}`
//     }
//   }
//   return true
// }

// export const grammar: Grammar = {
//   'hashtag-string': {
//     pattern: /(?:\s#\(\.{3}\))?(?:(?:\s#[a-zA-Z0-9]+)|(?:\s\((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+\)))*$/,
//     inside: {
//       'cur-hashtags-placer': {
//         pattern: /\B#\(\.{3}\)/,
//       },
//       hashtag: {
//         pattern: /\B#[a-zA-Z0-9]+/,
//       },
//       'hashtag-group': {
//         pattern: /\((?:#[a-zA-Z0-9]+\s)+#[a-zA-Z0-9]+\)/,
//         inside: {
//           hashtag: {
//             pattern: /\B#[a-zA-Z0-9]+/,
//           },
//         },
//       },
//     },
//   },
// }

// function addSpaceInBetween<T extends InlineItem>(items: T[]): (T | InlineText)[] {
//   const spacedItems = items.reduce<(T | InlineText)[]>((acc, cur) => [...acc, cur, { type: 'text', str: ' ' }], [])
//   if (spacedItems.length > 0 && spacedItems[spacedItems.length - 1].type === 'text') {
//     spacedItems.pop()
//   }
//   return spacedItems
// }

// function toInlines(hashtags: (InlineHashtag | InlineNewHashtag)[]): (InlineText | InlineHashtag | InlineNewHashtag)[] {
//   if (hashtags.length === 0) {
//     return []
//   }
//   return [{ type: 'text', str: '|| ' }, ...addSpaceInBetween(hashtags)]
// }

// const grammar: Grammar = {
//   'hashtag-string': {
//     pattern: /\B\/\/(?:\s#[a-zA-Z0-9]+)+$/,
//     inside: {
//       breaker: { pattern: /\B\/\// },
//       hashtag: { pattern: /\B#[a-zA-Z0-9]+/ },
//     },
//   },
// }

// /**
//  * @param createdHashtags 用此判斷 parsed hashtags 是新的還是既有的
//  * ...some text #(...) #Aaa #Bbb (#aaa #bbb #ccc) #ccc #012
//  */
// export function parseHashtags(props: { str: string; connectedHashtags?: InlineHashtag[] }): {
//   beforeHashtagStr: string
//   inlines: (InlineText | InlineHashtag | InlineNewHashtag)[]
// } {
//   const { str, connectedHashtags = [] } = props
//   const [beforeHashtagStr, hashtagStr] = tokenize(str, grammar) // 可以安全的假設傳回值為 [beforeStr, hashtagStr]

//   if (typeof beforeHashtagStr === 'string' && hashtagStr === undefined) {
//     return { beforeHashtagStr, inlines: toInlines(connectedHashtags) }
//   }
//   if (typeof beforeHashtagStr !== 'string' && beforeHashtagStr.type === 'hashtag-string') {
//     // 缺內文，將 hashtags 視為內文 eg '// #Cc3 #Dd4'
//     return { beforeHashtagStr: tokenToString(beforeHashtagStr), inlines: toInlines(connectedHashtags) }
//   }
//   if (
//     typeof beforeHashtagStr === 'string' &&
//     typeof hashtagStr !== 'string' &&
//     hashtagStr.type === 'hashtag-string' &&
//     Array.isArray(hashtagStr.content)
//   ) {
//     const createdHashtagNames = connectedHashtags.map(e => e.str)
//     const newHashtags = hashtagStr.content
//       .filter((e): e is Token => typeof e !== 'string' && e.type === 'hashtag')
//       .map((e): string => tokenToString(e.content))
//       .filter(e => !createdHashtagNames.includes(e))
//       .map<InlineNewHashtag>(e => ({ type: 'new-hashtag', str: e }))
//     return { beforeHashtagStr, inlines: toInlines([...connectedHashtags, ...newHashtags]) }
//   }
//   console.error(str, connectedHashtags)
//   console.error(beforeHashtagStr, hashtagStr)
//   throw 'Unexpected error'
// }
