import { Author, Discuss } from '@prisma/client'
import { authorModel } from '../models/author.model'
import { discussModel } from '../models/discuss.model'
import { BaseSearcher } from './base-searcher'
import { SymSearcher } from './sym-searcher'

const searchAuthorPropertyName = `__prevent-name-collision__search-author-service`

const searchDiscussPropertyName = `__prevent-name-collision__search-discuss-service`

const searchSymPropertyName = `__prevent-name-collision__search-sym-service`

type GlobalThisWithSearchServices = typeof globalThis & {
  [searchAuthorPropertyName]: BaseSearcher<Author>
  [searchDiscussPropertyName]: BaseSearcher<Discuss>
  [searchSymPropertyName]: SymSearcher
}

const getAuthorSearcher = (): BaseSearcher<Author> => {
  if (process.env.NODE_ENV === 'production') {
    return new BaseSearcher<Author>({ keys: ['name'] }, authorModel.getAll)
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchAuthorPropertyName]) {
      console.log('Creating global search-author-service')
      newGlobalThis[searchAuthorPropertyName] = new BaseSearcher<Author>(
        { keys: ['name'] },
        authorModel.getAll,
      )
    }
    return newGlobalThis[searchAuthorPropertyName]
  }
}

const getDiscussSearcher = (): BaseSearcher<Discuss> => {
  if (process.env.NODE_ENV === 'production') {
    return new BaseSearcher<Discuss>({ keys: ['title'] }, discussModel.getAll)
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchDiscussPropertyName]) {
      console.log('Creating global search-discuss-service')
      newGlobalThis[searchDiscussPropertyName] = new BaseSearcher<Discuss>(
        { keys: ['title'] },
        discussModel.getAll,
      )
    }
    return newGlobalThis[searchDiscussPropertyName]
  }
}

const getSymSearcher = (): SymSearcher => {
  if (process.env.NODE_ENV === 'production') {
    return new SymSearcher()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchSymPropertyName]) {
      console.log('Creating global search-sym-service')
      newGlobalThis[searchSymPropertyName] = new SymSearcher()
    }
    return newGlobalThis[searchSymPropertyName]
  }
}

export const authorSearcher = getAuthorSearcher()

export const discussSearcher = getDiscussSearcher()

export const symSearcher = getSymSearcher()
