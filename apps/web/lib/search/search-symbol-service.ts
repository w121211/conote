import Fuse from 'fuse.js'
import { Sym, SymType } from '@prisma/client'
import { SymModel } from '../models/sym-model'

type FuseDict = {
  all: Fuse<Sym>
  ticker: Fuse<Sym>
  topic: Fuse<Sym>
}

export class SearchSymbolServiceClass {
  private fuseDict: FuseDict | null = null // TODO: store in redis instead

  private _add(sym: Sym, fuse: Fuse<Sym>): void {
    if (sym.type === 'URL') {
      // URL is not included in search
      return
    }
    fuse.remove(doc => doc.id === sym.id)
    fuse.add(sym)
  }

  /**
   * If sym is existed in the fuse (compare by sym-id), first remove it and re-added it
   */
  async add(sym: Sym): Promise<void> {
    const fuseDict = this.fuseDict ?? (await this.initFuse())
    if (sym.type === 'TICKER') {
      this._add(sym, fuseDict['ticker'])
      this._add(sym, fuseDict['all'])
      return
    }
    if (sym.type === 'TOPIC') {
      this._add(sym, fuseDict['topic'])
      this._add(sym, fuseDict['all'])
      return
    }
  }

  async initFuse(): Promise<FuseDict> {
    console.log('init fuse...')
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
