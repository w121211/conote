import { Author } from '@prisma/client'
import prisma from '../prisma'

export const AuthorModel = {
  async getAll(): Promise<Author[]> {
    console.log('Retreiving all authors from database...')

    let authors: Author[] = []
    let cursor: string | undefined = undefined

    // eslint-disable-next-line no-constant-condition
    while (true) {
      // eslint-disable-next-line no-await-in-loop
      const res: Author[] = await prisma.author.findMany({
        take: 100,
        skip: cursor ? 1 : undefined, // skip cursor itself
        orderBy: { id: 'asc' },
        cursor: cursor ? { id: cursor } : undefined,
      })
      if (res.length === 0) {
        break
      }
      authors = authors.concat(res)
      cursor = res[res.length - 1].id
    }
    return authors
  },

  // async getOrCreate(symbol: string): Promise<Sym> {
  //   const parsed = this.parse(symbol)
  //   return prisma.sym.upsert({
  //     create: { symbol: parsed.symbol, type: parsed.type },
  //     where: { symbol: parsed.symbol },
  //     update: {},
  //   })
  // },
}
