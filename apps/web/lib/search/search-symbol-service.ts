import Fuse from 'fuse.js'
import { Sym, SymType } from '@prisma/client'
import { SymModel } from '../models/sym-model'

// let symbols: string[] | null = null
// let symbolFuse: Fuse<string>
// let topicFuseUpdatedAt: Date | null = null
// let tickerTitles: string[] | null = null

// const prisma = new PA.PrismaClient({
//   errorFormat: 'pretty',
//   log: ['query', 'info', 'warn'],
// })

type FuseDict = {
  all: Fuse<string>
  ticker: Fuse<string>
  topic: Fuse<string>
}

class SearchSymbolServiceClass {
  // TODO: store in redis instead

  private syms: Sym[] | null = null
  private fuseDict: FuseDict | null = null

  async initFuse(): Promise<FuseDict> {
    if (this.syms === null || this.fuseDict === null) {
      const syms = await SymModel.getAll()

      // const fuse = new Fuse(syms, {
      //   includeScore: true,
      //   keys: ['symbol'],
      // })
      const fuseDict: FuseDict = {
        all: new Fuse(syms.filter(e => ['TICKER', 'TOPIC'].includes(e.type)).map(e => e.symbol)),
        ticker: new Fuse(syms.filter(e => e.type === 'TICKER').map(e => e.symbol)),
        topic: new Fuse(syms.filter(e => e.type === 'TOPIC').map(e => e.symbol)),
      }
      this.syms = syms
      this.fuseDict = fuseDict
      return fuseDict
    }
    return this.fuseDict
  }

  // async insertSymbol(sym: Sym) {
  // }

  async search(term: string, type?: SymType): Promise<string[]> {
    const fuseDict = this.fuseDict ?? (await this.initFuse())
    let fuse: Fuse<string>
    if (type === 'TICKER') {
      fuse = fuseDict['ticker']
    } else if (type === 'TOPIC') {
      fuse = fuseDict['topic']
    } else {
      fuse = fuseDict['all']
    }
    return fuse.search(term).map(e => e.item)
  }
}

// export for global use
export const SearchSymbolService = new SearchSymbolServiceClass()
