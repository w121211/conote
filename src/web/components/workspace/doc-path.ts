import { ParsedUrlQuery } from 'querystring'
import { UrlObject } from 'url'

export type DocPath = {
  symbol: string
  sourceCardId?: string // indicate current symbol is a mirror
  editorValuePath?: number[]
}

export const DocPathService = {
  fromURLQuery(query: ParsedUrlQuery): DocPath {
    const { symbol, src } = query
    // const symbol = query['symbol']
    // const author = query['a']
    // const editorValuePath = query['v']
    // const source = query['s']

    if (typeof symbol !== 'string') {
      throw '[conote] Symbol not found in url query'
    }
    return {
      symbol,
      sourceCardId: typeof src === 'string' ? src : undefined,
      // path: typeof path === 'string' ? path.split('.').map(e => parseInt(e)) : [],
      // mirror: typeof mirror === 'string' ? mirror : undefined,
      // mirrorSymbol: typeof mirror === 'string' ? mirror : undefined,
      // author: typeof author === 'string' ? author : undefined,
    }
  },

  toURL(symbol: string, sourceCardId?: string, joinLiPath?: number[]): UrlObject {
    // const { symbol, sourceCardId, editorValuePath } = path
    // const query: Record<string, string> = {}
    // if (mirror) {
    //   query['m'] = mirror
    // }
    // if (author && mirrorSymbol) {
    //   query[AUTHOR_KEY] = author
    // }
    // if (joinLiPath) {
    //   // const merged = [...openedLiPath, 1, ...joinLiPath]
    //   // params.set(PATH_KEY, merged.join(PATH_SPLITTER))
    //   query['p'] = [...path, 1, ...joinLiPath].join('.')
    // } else if (path.length > 0) {
    //   // params.set(PATH_KEY, openedLiPath.join(PATH_SPLITTER))
    //   query['p'] = path.join('.')
    // }
    const query: Record<string, string> = { symbol }
    if (sourceCardId) {
      query['src'] = sourceCardId
    }
    return { pathname: '/cardx/[symbol]', query }
  },
}
