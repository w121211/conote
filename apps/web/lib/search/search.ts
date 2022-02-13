import { Author, Discuss } from '@prisma/client'
import { AuthorModel } from '../models/author-model'
import { DiscussModel } from '../models/discuss-model'
import { SearchServiceClass } from './search-service'
import { SearchSymServiceClass } from './search-sym-service'

const searchAuthorServicePropertyName = `__prevent-name-collision__search-author-service`
const searchDiscussServicePropertyName = `__prevent-name-collision__search-discuss-service`
const searchSymServicePropertyName = `__prevent-name-collision__search-sym-service`

type GlobalThisWithSearchServices = typeof globalThis & {
  [searchAuthorServicePropertyName]: SearchServiceClass<Author>
  [searchDiscussServicePropertyName]: SearchServiceClass<Discuss>
  [searchSymServicePropertyName]: SearchSymServiceClass
}

const getSearchAuthorService = (): SearchServiceClass<Author> => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchServiceClass<Author>({ keys: ['name'] }, AuthorModel.getAll)
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchAuthorServicePropertyName]) {
      console.log('Creating global search-author-service')
      newGlobalThis[searchAuthorServicePropertyName] = new SearchServiceClass<Author>(
        { keys: ['name'] },
        AuthorModel.getAll,
      )
    }
    return newGlobalThis[searchAuthorServicePropertyName]
  }
}

const getSearchDiscussService = (): SearchServiceClass<Discuss> => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchServiceClass<Discuss>({ keys: ['title'] }, DiscussModel.getAll)
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchDiscussServicePropertyName]) {
      console.log('Creating global search-discuss-service')
      newGlobalThis[searchDiscussServicePropertyName] = new SearchServiceClass<Discuss>(
        { keys: ['title'] },
        DiscussModel.getAll,
      )
    }
    return newGlobalThis[searchDiscussServicePropertyName]
  }
}

const getSearchSymService = (): SearchSymServiceClass => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchSymServiceClass()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithSearchServices
    if (!newGlobalThis[searchSymServicePropertyName]) {
      console.log('Creating global search-sym-service')
      newGlobalThis[searchSymServicePropertyName] = new SearchSymServiceClass()
    }
    return newGlobalThis[searchSymServicePropertyName]
  }
}

export const SearchAuthorService = getSearchAuthorService()

export const SearchDiscussService = getSearchDiscussService()

export const SearchSymService = getSearchSymService()
