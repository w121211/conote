import { Sym, SymType } from '@prisma/client'
import { parseSymbol } from '../../share/symbol.common'
import { SymbolParsed } from '../interfaces'
import prisma from '../prisma'

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

  parse(symbol: string): SymbolParsed {
    return parseSymbol(symbol)
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

    if (parsedOld.type === 'URL')
      throw new Error('Not support update URL symbol')
    if (parsedOld.type !== parsedNew.type)
      throw new Error('Not support update symbol to different type')

    return await prisma.sym.update({
      data: { symbol: newSymbol },
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
