import { Sym, SymType } from '@prisma/client'
import prisma from '../prisma'

/**
 * Symbol types and its format:
 *
 * - Ticker: start with '$', all capital alphabet-letter or number
 *   @eg $AB, $A01
 *
 * - Topic: a title enclosed by `[[...]]`
 *   @eg [[what ever]], [[中文範例]]
 *
 * - URL: a valide http url start with 'http://' or 'https://'
 *   @eg https://github.com/typescript-eslint
 *
 */

type SymbolParsed = {
  symbol: string
  type: SymType
}

const reTicker = /^\$[A-Z0-9]+$/

const reTopic = /^\[\[[^\]]+\]\]$/

/**
 * Check is given sting a url
 *
 * @reference https://stackoverflow.com/a/43467144/2293778
 */
function isURL(str: string) {
  try {
    const url = new URL(str)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (err) {
    return false
  }
}

class SymModel {
  /**
   * Use to build fuzzy search symbols
   */
  async getAll(): Promise<Sym[]> {
    console.log(
      'Retreiving all syms of TICKER and TOPIC from database... (heavy call)',
    )

    let syms: Sym[] = [],
      cursor: string | undefined = undefined

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

      if (res.length === 0) break

      syms = syms.concat(res)
      cursor = res[res.length - 1].id
    }
    return syms
  }

  /**
   *
   */
  async getOrCreate(symbol: string): Promise<Sym> {
    const { symbol: symbol_, type } = this.parse(symbol)
    return prisma.sym.upsert({
      create: { symbol: symbol_, type },
      where: { symbol: symbol_ },
      update: {},
    })
  }

  /**
   * Attempt to parse a symbol
   *
   * @throws Symbol format is not recognized
   *
   * TODOS:
   * - [] Not able to distinguish bettween [[topic]] vs [[https://...]],
   *      while [[https://...]] should be parsed as URL?
   * - [] Not able to recognize author
   */
  parse(symbol: string): SymbolParsed {
    let type: SymType

    if (symbol.match(reTicker) !== null) {
      type = SymType.TICKER
    } else if (symbol.match(reTopic) !== null) {
      type = SymType.TOPIC
    } else if (isURL(symbol)) {
      type = SymType.URL
    } else {
      throw new Error(`Symbol parse error: ${symbol}`)
    }
    return { symbol, type }
  }

  async update(id: string, newSymbol: string): Promise<Sym> {
    const sym = await prisma.sym.findUnique({
      where: { id },
    })
    if (sym === null) {
      throw 'Sym not found'
    }

    const parsedOld = this.parse(sym.symbol)
    const parsedNew = this.parse(newSymbol)

    if (parsedOld.type === 'URL') {
      throw 'Not support update URL symbol'
    }
    if (parsedOld.type !== parsedNew.type) {
      throw 'Not support update symbol to different type'
    }

    return await prisma.sym.update({
      data: {
        symbol: newSymbol,
      },
      where: { id },
    })
  }
}

export const symModel = new SymModel()

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
