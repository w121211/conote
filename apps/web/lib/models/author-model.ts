import { Author } from '@prisma/client'
import {
  Author as GQLAuthor,
  AuthorContent as GQLAuthorContent,
  AuthorInput as GQLAuthorInput,
} from 'graphql-let/__generated__/__types__'
import prisma from '../prisma'

type AuthorContent = {
  type: 'ORG' | 'PERSON'
  job?: string // eg youtuber, analylist
  org?: string
  sites: [string, string][] // [site_url, site_name]
}

// type Job = {
//   name: string
//   org: string
//   startedAt?: Date
//   endedAt?: Date
// }

const bannedCharMatcher = /[^a-zA-Z0-9_\p{Letter}]/gu

const toAuthorName = (domain: string, domainAuthorName: string) => {
  const author = domainAuthorName.trim().replace(bannedCharMatcher, '_')
  // return `${author}:${domain}`
  return author
}

class AuthorModel {
  async create(input: GQLAuthorInput): Promise<Author> {
    const { name, type, job, org, sites } = input,
      content: AuthorContent = {
        type,
        job: job ?? undefined,
        org: org ?? undefined,
        sites: sites.map(e => [e.url, e.name]),
      }
    return prisma.author.create({
      data: { name, content },
    })
  }

  async get(id?: string, name?: string): Promise<GQLAuthor | null> {
    let author: Author | null
    if (id) {
      author = await prisma.author.findUnique({
        where: { id },
      })
    } else if (name) {
      author = await prisma.author.findUnique({
        where: { name },
      })
    } else {
      throw 'Need either id or name to get author'
    }
    if (author) {
      return this.toGQLAuthor(author)
    }
    return null
  }

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
  }

  parse() {
    // TODO
  }

  toGQLAuthor(author: Author): GQLAuthor {
    const { content } = author
    return {
      ...author,
      content: this.toGQLAuthorMeta(content as unknown as AuthorContent),
    }
  }

  toGQLAuthorMeta(meta: AuthorContent): GQLAuthorContent {
    const { sites } = meta
    return {
      ...meta,
      sites: sites.map(([url, name]) => {
        return { url, name }
      }),
    }
  }

  async update(id: string, input: GQLAuthorInput): Promise<Author> {
    const { name, type, job, org, sites } = input,
      content: AuthorContent = {
        type,
        job: job ?? undefined,
        org: org ?? undefined,
        sites: sites.map(e => [e.url, e.name]),
      }
    return prisma.author.update({
      data: { name, content },
      where: { id },
    })
  }
}

export const authorModel = new AuthorModel()
