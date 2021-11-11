import { Symbol as PrismaSymbol, SymbolType } from '.prisma/client'
import prisma from '../prisma'

/**
 * Symbol category:
 *
 * - Ticker: $AB, $A01
 * - Topic: [[what ever]], [[包括unicode]]
 * - URL: @https://github.com/typescript-eslint
 */

export type ParsedSymbol = {
  name: string
  type: SymbolType
}

const reTicker = /^\$[A-Z0-9]+$/

const reTopic = /^\[\[[^\]]+\]\]$/

// eg @https://regex101.com/ 非常簡單的 url regex，會捕捉到很多非 url 的 string
const reUrl = /^@[a-zA-Z0-9:/.]+/

export const SymbolModel = {
  async getOrCreate(symbol: string): Promise<PrismaSymbol> {
    const { name, type } = this.parse(symbol)
    return prisma.symbol.upsert({
      create: { name, type },
      where: { name },
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
  parse(symbol: string): ParsedSymbol {
    let type: SymbolType
    if (symbol.match(reTicker) !== null) {
      type = SymbolType.TICKER
    } else if (symbol.match(reTopic) !== null) {
      type = SymbolType.TOPIC
    } else if (symbol.match(reUrl) !== null) {
      type = SymbolType.URL
    } else {
      throw new Error(`symbol parse error: ${symbol}`)
    }
    return {
      name: symbol,
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
