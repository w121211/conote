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
  all: Fuse<Sym>
  ticker: Fuse<Sym>
  topic: Fuse<Sym>
}

class SearchSymbolServiceClass {
  private fuseDict: FuseDict | null = null // TODO: store in redis instead

  async initFuse(): Promise<FuseDict> {
    if (this.fuseDict === null) {
      const syms = await SymModel.getAll()
      const fuseDict: FuseDict = {
        all: new Fuse(
          syms.filter(e => ['TICKER', 'TOPIC'].includes(e.type)),
          { keys: ['symbol'] },
        ),
        ticker: new Fuse(
          syms.filter(e => e.type === 'TICKER'),
          { keys: ['symbol'] },
        ),
        topic: new Fuse(
          syms.filter(e => e.type === 'TOPIC'),
          { keys: ['symbol'] },
        ),
      }
      this.fuseDict = fuseDict
      return fuseDict
    }
    return this.fuseDict
  }

  // async insertSymbol(sym: Sym) {
  // }

  async search(term: string, type?: SymType): Promise<Sym[]> {
    const fuseDict = this.fuseDict ?? (await this.initFuse())
    let fuse: Fuse<Sym>
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

export const SearchSymbolService = new SearchSymbolServiceClass() // export for global use
