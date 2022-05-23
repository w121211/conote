import Fuse from 'fuse.js'

/**
 *
 */
export class BaseSearcher<T extends { id: string }> {
  private fuse: Fuse<T> | null = null
  private fuseOptions: Fuse.IFuseOptions<T>
  private getAllDatabaseItems: () => Promise<T[]>

  constructor(
    fuseOptions: Fuse.IFuseOptions<T>,
    getAllDatabaseItems: () => Promise<T[]>,
  ) {
    this.fuseOptions = fuseOptions
    this.getAllDatabaseItems = getAllDatabaseItems
  }

  /**
   *
   */
  async add(author: T): Promise<void> {
    const fuse = await this.getFuse()
    fuse.remove(doc => doc.id === author.id)
    fuse.add(author)
  }

  /**
   *
   */
  async getFuse(): Promise<Fuse<T>> {
    return this.fuse ?? (await this.initFuse())
  }

  /**
   * initialize only if local fuse is null
   */
  async initFuse(): Promise<Fuse<T>> {
    if (this.fuse === null) {
      const authors = await this.getAllDatabaseItems()
      const fuse = new Fuse(authors, this.fuseOptions)
      this.fuse = fuse
      return fuse
    }
    return this.fuse
  }

  /**
   *
   */
  async search(term: string): Promise<T[]> {
    const fuse = await this.getFuse()
    return fuse.search(term).map(e => e.item)
  }
}
