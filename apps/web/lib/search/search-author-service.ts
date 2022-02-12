import Fuse from 'fuse.js'
import { Author } from '@prisma/client'
import { AuthorModel } from '../models/author-model'

export class SearchAuthorServiceClass {
  private authors: Author[] | null = null // TODO: store in redis instead
  private fuse: Fuse<Author> | null = null

  add(author: Author): Fuse<Author> {
    if (this.fuse !== null) {
      this.fuse.add(author)
      return this.fuse
    }
    throw 'fuse not initialize yet'
  }

  /**
   * do initialize only if local fuse is null
   */
  async init(): Promise<Fuse<Author>> {
    if (this.authors === null || this.fuse === null) {
      const authors = await AuthorModel.getAll()
      const fuse = new Fuse(authors, {
        keys: ['name'],
      })
      this.authors = authors
      this.fuse = fuse
      return fuse
    }
    return this.fuse
  }

  async search(term: string): Promise<Author[]> {
    const fuse = this.fuse ?? (await this.init())
    return fuse.search(term).map(e => e.item)
  }
}

// export const SearchAuthorService = new SearchAuthorServiceClass() // export for global use
