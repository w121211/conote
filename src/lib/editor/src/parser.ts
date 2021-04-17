import * as Prism from 'prismjs'
import { Marker, MarkerFormat, ExtToken, ExtTokenStream, Section } from './typing'
import { streamToStr } from './helper'

export const LINE_VALUE_GRAMMAR = {
  ticker: { pattern: /\$[A-Z-]+/ },
  topic: { pattern: /\[\[[^\]]+\]\]/u },
  stamp: { pattern: /(?<=\s)%[a-zA-Z0-9]{3}$/ },
  'vote-chocie': { pattern: /<[^>\s]+>/u },
}

export const GRAMMAR = {
  'multiline-marker': {
    // pattern: /^\[[^\s\]]*\]$(?:\n^(?!\[).+)+/m,
    pattern: /^\[[^\s[\]]*\]$(?:\n^(?!\[[^\s[\]]*\]).+)+/m,
    inside: {
      'line-mark': {
        pattern: /^\[[^\s[\]]*\]$/m,
      },
      'list-value': {
        pattern: /^(?!-\s)(?:.+\n)(-\s.+(?:\n|$))+/m,
      },
      'line-value': {
        pattern: /^.+$/m,
        inside: LINE_VALUE_GRAMMAR,
      },
    },
  },
  'inline-marker': {
    pattern: /^\[[^\s[\]]+\].*$/m,
    inside: {
      'inline-mark': {
        pattern: /^\[[^\s[\]]+\]/,
      },
      'inline-value': {
        pattern: /^.+$/,
        inside: LINE_VALUE_GRAMMAR,
      },
    },
  },
}

export const SYMBOL_GRAMMAR = {
  ticker: LINE_VALUE_GRAMMAR.ticker,
  topic: LINE_VALUE_GRAMMAR.topic,
}

export const SECTION_GRAMMAR = {
  'sect-ticker': {
    alias: 'sect-ticker',
    pattern: /^\n\$[A-Z-]+(@\w+)?$/m,
    inside: {
      'sect-symbol': { pattern: /^\n\$[A-Z-]+/ },
      'sect-user': { pattern: /@\w+/ },
    },
  },
  'sect-ticker-begin-line': {
    alias: 'sect-ticker',
    pattern: /^\$[A-Z-]+(@\w+)?\n/,
    inside: {
      'sect-symbol': { pattern: /^\$[A-Z-]+/ },
      'sect-user': { pattern: /@\w+/ },
    },
  },
  'sect-topic': {
    alias: 'sect-topic',
    pattern: /^\n\[\[[^\]]+\]\](@\w+)?$/m,
    inside: {
      'sect-symbol': { pattern: /^\n\[\[[^\]]+\]\]/u },
      'sect-user': { pattern: /@\w+/ },
    },
  },
  'sect-topic-begin-line': {
    alias: 'sect-topic',
    pattern: /^\[\[[^\]]+\]\](@\w+)?\n/,
    inside: {
      'sect-symbol': { pattern: /^\[\[[^\]]+\]\]/u },
      'sect-user': { pattern: /@\w+/ },
    },
  },
  'sect-breaker': {
    alias: 'sect-breaker',
    pattern: /^\n\/{3,}.+$/m,
  },
  'sect-url': {
    alias: 'sect-url',
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/m,
  },
}

function validate(items: Marker[], allowedMarkers: MarkerFormat[]): Marker[] {
  for (const e of items) {
    const format = allowedMarkers.find(f => f.key === e.key)
    if (format === undefined) {
      e.error = '不在允許的markers中'
      continue
    }
    if (e.value === undefined) {
      e.error = '沒有value'
      continue
    }
    if (format.validater && !format.validater(e.value)) {
      e.error = 'value不符合格式'
      continue
    }
    if (format.inline) {
      const filtered = items.filter(e => e.key === format.key)
      for (let i = 0; i < filtered.length - 1; i++) {
        filtered[i].error = '只能define一次，最後一個會被保留'
      }
    }
    // if (e.mark === MARKER_FORMAT.card.mark && getCardId) {
    //     getCardId(e.value)
    //         .then(result => {
    //             if (result === null) {
    //                 e.error = '找不到對應的card'
    //             } else {
    //                 e.cardId = result
    //             }
    //         })
    // }
    // if (e.children) {
    //     if (format.nested) {
    //         // TODO: 當前只有ticker可以nested，應該要靈活一些
    //         e.children = validate(e.children, TICKER_FORMATTER)
    //     } else {
    //         e.error = '不允許nested'
    //     }
    // }
  }
  return items
}

export function findUrl(text: string): { url: string | undefined; textAfterUrl: string } {
  /** 從首先出現的單行URL開始，擷取從URL以下的文章 */
  const tokens = Prism.tokenize(text, SECTION_GRAMMAR)
  let url: string | undefined
  const _tokensAfterUrl: Array<string | Prism.Token> = []
  for (const e of tokens) {
    if (url === undefined) {
      if (typeof e !== 'string' && e.type === 'sect-url') url = e.content as string
      else continue
    }
    _tokensAfterUrl.push(e)
  }
  // return { url, textAfterUrl: tokensToText(_tokensAfterUrl) }
  return { url, textAfterUrl: 'tokensToText(_tokensAfterUrl)' }
}

export function splitByUrl(text: string): [string | undefined, string][] {
  /** 以text中的單行URL做split，返回:[url, part-text][] */
  const tokens = Prism.tokenize(text, SECTION_GRAMMAR)
  let buffer: (string | Prism.Token)[] = []
  let url: string | undefined
  const splits: [string | undefined, string][] = []

  for (const e of tokens) {
    if (typeof e !== 'string' && e.type === 'sect-url') {
      // 儲存前一個buffer後清空
      splits.push([url, streamToStr(buffer)])
      buffer = []
      // 當前url
      url = e.content as string
    } else {
      buffer.push(e)
    }
  }
  // 儲存最後一個
  splits.push([url, streamToStr(buffer)])

  return splits
}

export function tokenizeSymbol(text: string): Array<string | Prism.Token> {
  /** 將text中的symbol($AA, [[Topic]])轉成token */
  return Prism.tokenize(text, SYMBOL_GRAMMAR)
}

export function tokenizeSection(
  text: string,
  // symbolCardDict: Record<string, CardIdentifier>,
  // nestedCards: CardIdentifier[] = [],
  rootFormat?: MarkerFormat[],
  oauthorName?: string,
  allowedSects: ('ticker' | 'topic')[] = ['ticker', 'topic'],
): Section[] {
  // 分出text中的每個section
  // let _sect: {bodyTokens: []} = { bodyTokens: [] }

  function _parseSectToken(token: Prism.Token): { symbol: string; user?: string } {
    let symbol: string | undefined
    let user: string | undefined
    if (Array.isArray(token.content)) {
      for (const e of token.content) {
        if (typeof e === 'string') {
          // do nothing
        } else if (e.type === 'sect-symbol') {
          symbol = streamToStr(e.content).trim()
        } else if (e.type === 'sect-user') {
          user = streamToStr(e.content)
        }
      }
      if (symbol === undefined) {
        console.error(token)
        throw new Error()
      }
      return { symbol, user }
    }
    console.error(token)
    throw new Error()
  }

  type TempSection = Section & { sectToken?: Prism.Token; bodyTokens: (Prism.Token | string)[] }
  const sects: TempSection[] = []
  let _sect: TempSection = {
    bodyTokens: [],
  }
  // let _sectToken: Prism.Token
  // let _bodyTokens: (Prism.Token | string)[] = []

  for (const e of Prism.tokenize(text, SECTION_GRAMMAR)) {
    if (typeof e === 'string') {
      _sect.bodyTokens.push(e)
    } else if (e.alias === 'sect-ticker') {
      // 先儲存之前的section
      sects.push({ ..._sect })
      // TODO: @ME
      const parsed = _parseSectToken(e)
      _sect = {
        ticker: true,
        nestedCard: { symbol: parsed.symbol, oauthor: parsed.user ?? oauthorName },
        sectToken: e,
        bodyTokens: [],
      }
    } else if (e.alias === 'sect-topic') {
      sects.push({ ..._sect })
      const parsed = _parseSectToken(e)
      _sect = {
        topic: true,
        nestedCard: { symbol: parsed.symbol, oauthor: parsed.user ?? oauthorName },
        sectToken: e,
        bodyTokens: [],
      }
    } else if (e.alias === 'sect-breaker') {
      sects.push({ ..._sect })
      // 把breaker視為獨立的section
      sects.push({ breaker: true, sectToken: e, bodyTokens: [] })
      // breaker之後的新section
      _sect = { bodyTokens: [] }
    } else {
      console.error(e)
      throw new Error('應該要處理但未處理的token-type')
    }
  }
  sects.push({ ..._sect })

  for (const e of sects) {
    const body = streamToStr(e.bodyTokens)
    if (e.ticker || e.topic) {
      // 對section做tokenize section-body
      e.bodyTokens = Prism.tokenize(body, GRAMMAR)
    } else if (!e.breaker && body.length > 0) {
      // 所有非ticker、topic的card & 有body-string的section皆視為root
      e.root = true
      e.bodyTokens = Prism.tokenize(body, GRAMMAR)
    }
  }

  // 對每個token紀錄linenumber、marker
  let linenumber = 0
  let key: string | null = null

  function _recursiveExtend(stream: Prism.TokenStream): ExtTokenStream {
    if (typeof stream === 'string') {
      linenumber += stream.split('\n').length - 1
      return stream
    } else if (Array.isArray(stream)) {
      return stream.map<string | ExtToken>(e => _recursiveExtend(e) as string | ExtToken)
    } else if (stream.type === 'inline-mark' || stream.type === 'line-mark') {
      key = streamToStr(stream.content)
      if (key === '') throw new Error()
      return { ...stream, linenumber, marker: { key }, content: _recursiveExtend(stream.content) }
    } else if (stream.type === 'inline-value' || stream.type === 'line-value') {
      const value = streamToStr(stream.content, 'stamp').trim()
      if (key === null) throw new Error()
      return { ...stream, linenumber, marker: { key, value }, content: _recursiveExtend(stream.content) }
    } else {
      return { ...stream, linenumber, content: _recursiveExtend(stream.content) }
    }
  }

  for (const e of sects) {
    // section的全部stream（含section-token, body-tokens)
    let stream: (Prism.Token | string)[] = []
    if (e.sectToken) stream.push(e.sectToken)
    stream = stream.concat(e.bodyTokens)

    // 轉成ext-token
    key = null
    e.stream = _recursiveExtend(stream)
  }

  return sects.map<Section>(e => {
    return {
      root: e.root,
      breaker: e.breaker,
      ticker: e.ticker,
      topic: e.topic,
      nestedCard: e.nestedCard,
      stream: e.stream,
    }
  })
}
