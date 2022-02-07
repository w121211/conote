import { Sym, SymType } from '@prisma/client'
import prisma from '../prisma'

/**
 * Symbol types:
 * - Ticker: $AB, $A01
 * - Topic: [[what ever]], [[包括unicode]]
 * - URL: @https://github.com/typescript-eslint
 */

export type SymbolParsed = {
  symbol: string
  type: SymType
}

const reTicker = /^\$[A-Z0-9]+$/

const reTopic = /^\[\[[^\]]+\]\]$/

// eg @https://regex101.com/ 非常簡單的 url regex，會捕捉到很多非 url 的 string
const reUrl = /^@[a-zA-Z0-9:/.]+/

export const SymModel = {
  async getAll(): Promise<Sym[]> {
    console.log('Retreiving all syms from database...')

    let syms: Sym[] = []
    let cursor: string | undefined = undefined

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const res: Sym[] = await prisma.sym.findMany({
        where: {
          OR: [{ type: SymType.TICKER }, { type: SymType.TOPIC }],
        },
        take: 100,
        skip: cursor ? 1 : undefined, // skip cursor itself
        orderBy: { id: 'asc' },
        cursor: cursor ? { id: cursor } : undefined,
      })
      if (res.length === 0) {
        break
      }
      syms = syms.concat(res)
      cursor = res[res.length - 1].id
    }
    return syms
  },

  async getOrCreate(symbol: string): Promise<Sym> {
    const parsed = this.parse(symbol)
    return prisma.sym.upsert({
      create: { symbol: parsed.symbol, type: parsed.type },
      where: { symbol: parsed.symbol },
      update: {},
    })
  },

  /**
   * Parse symbol
   *
   * @throws Symbol格式無法辨識
   *
   * TODO:
   * 1. 無法區別[[topic]] vs [[https://...]], [[https://...]]應要parse為WEBPAGE
   * 2. 無法辨識oauthor
   */
  parse(symbol: string): SymbolParsed {
    let type: SymType
    if (symbol.match(reTicker) !== null) {
      type = SymType.TICKER
    } else if (symbol.match(reTopic) !== null) {
      type = SymType.TOPIC
    } else if (symbol.match(reUrl) !== null) {
      type = SymType.URL
    } else {
      throw new Error(`symbol parse error: ${symbol}`)
    }
    return {
      symbol,
      type,
    }
  },
}

// export function urlToSymbol(url: string): string | null {
//   // TODO: 需檢驗這是否符合symbol格式
//   // 若是symbo-url則返回symbol，否則返回null
//   if (url.startsWith('//')) {
//     return url.substr(2)
//   } else {
//     return null
//   }
// }

// export function symbolToUrl(symbol: string): CardSymbol & { url: string } {
//   const parsed = parseSymbol(symbol)
//   return {
//     ...parsed,
//     url: `//${parsed.name}`,
//   }
// }
