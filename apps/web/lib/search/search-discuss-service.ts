import Fuse from 'fuse.js'
import { Discuss } from '@prisma/client'
import { DiscussModel } from '../models/discuss-model'

class SearchDiscussServiceClass {
  private discusses: Discuss[] | null = null
  private fuse: Fuse<Discuss> | null = null

  async initFuse(): Promise<Fuse<Discuss>> {
    if (this.discusses === null || this.fuse === null) {
      const discusses = await DiscussModel.getAll()
      const fuse = new Fuse(discusses, {
        includeScore: true,
        keys: ['title'],
      })
      this.discusses = discusses
      this.fuse = fuse
      return fuse
    }
    return this.fuse
  }

  async search(term: string): Promise<string[]> {
    const fuse = this.fuse ?? (await this.initFuse())
    return fuse.search(term).map(e => e.item.title)
  }
}

export const SearchDiscussService = new SearchDiscussServiceClass() // export for global use
