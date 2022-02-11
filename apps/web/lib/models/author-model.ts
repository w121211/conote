import { Author } from '@prisma/client'
import prisma from '../prisma'

type Job = {
  name: string
  org: string
  startedAt?: Date
  endedAt?: Date
}

type AuthorMeta = {
  type: 'PERSON' | 'ORG'
  job?: string // eg youtuber, analylist
  org?: string
  sites: [string, string] // [site_name, site_url]
}

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

  async getOrCreate(name: string): Promise<Author> {
    return prisma.author.upsert({
      create: {
        name,
        // meta,
      },
      where: { name },
      update: {},
    })
  },
}
