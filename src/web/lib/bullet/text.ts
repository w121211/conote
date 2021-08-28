import { Grammar, Token, tokenize as prismTokenize } from 'prismjs'
import { CustomInlineElement, CustomText } from '../../components/editor/slate-custom-types'
import { defaultCurHashtagsPlacer, hashtagGroupToString, parseHashtags } from '../hashtag/text'
import { Hashtag, HashtagGroup } from '../hashtag/types'
import { tokenToString } from '../token'

/**
 * @see
 * url https://stackoverflow.com/questions/3809401/what-is-a-good-regular-expression-to-match-a-url
 * hashtag https://stackoverflow.com/questions/38506598/regular-expression-to-match-hashtag-but-not-hashtag-with-semicolon
 */
const grammar: Grammar = {
  'mirror-ticker': { pattern: /^::\$[A-Z-=]+\b/ },
  'mirror-topic': { pattern: /^::\[\[[^\]\n]+\]\]\B/u },
  ticker: { pattern: /\$[A-Z-=]+/ },
  topic: { pattern: /\[\[[^\]\n]+\]\]/u },
  url: {
    pattern: /(?<=\s|^)@(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,})(?=\s|$)/,
  },
  hashtag: { pattern: /(?<=\s|^)#[a-zA-Z0-9()]+(?=\s|$)/ },
  user: { pattern: /(?<=\s|^)@(?:[a-zA-Z0-9]+|\(author\))(?=\s|$)/ },
}

/**
 *
 */
export function tokenizeBulletString(text: string): (string | Token)[] {
  return prismTokenize(text, grammar)
}

/**
 * Parse a bullet head/body string to slate inline elements
 * @throws Validation error
 */
export function parseBulletHead(props: {
  str: string
  curHashtags?: (Hashtag | HashtagGroup)[]
}): (CustomText | CustomInlineElement)[] {
  const { str, curHashtags } = props

  // TODO: validate

  function tokenToInline(token: string | Token): CustomText | CustomInlineElement {
    if (typeof token === 'string') {
      return { text: token }
    }
    switch (token.type) {
      case 'mirror-ticker':
      case 'mirror-topic': {
        const mirrorSymbol = tokenToString(token.content)
        return {
          type: 'mirror-inline',
          mirrorSymbol,
          children: [{ text: mirrorSymbol }],
        }
      }
      case 'url':
      case 'ticker':
      case 'topic':
      case 'hashtag':
      case 'user': {
        return {
          type: 'label-inline',
          children: [{ text: tokenToString(token.content) }],
        }
      }
    }
    throw new Error()
  }

  const { beforeHashtagStr, newHashtags = [] } = parseHashtags(str)

  console.log(beforeHashtagStr)

  const tokens = tokenizeBulletString(beforeHashtagStr)
  const inlines: (CustomText | CustomInlineElement)[] = tokens.map(e => tokenToInline(e))

  // 若有 current hashtags，插入 hashtags placer
  if (curHashtags && curHashtags.length > 0) {
    inlines.push({ text: ' ' }) // pad 前方要有一個空格
    inlines.push({
      type: 'cur-hashtags-placer-inline',
      children: [{ text: defaultCurHashtagsPlacer }],
      hashtags: curHashtags,
    })
  }

  // 若有 new hashtags，逐一插入
  for (const e of newHashtags) {
    inlines.push({ text: ' ' }) // hashtag 前方要有一個空格
    if (e.type === 'hashtag-draft') {
      inlines.push({
        type: 'hashtag-inline',
        children: [{ text: e.text }],
        hashtagDraft: e,
      })
      continue
    }
    if (e.type === 'hashtag-group-draft') {
      inlines.push({
        type: 'hashtag-group-inline',
        children: [{ text: hashtagGroupToString(e) }],
        hashtagGroupDraft: e,
      })
    }
  }

  return inlines
}
