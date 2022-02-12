import { SearchAuthorServiceClass } from './search-author-service'
import { SearchDiscussServiceClass } from './search-discuss-service'
import { SearchSymbolServiceClass } from './search-symbol-service'

const searchAuthorServicePropertyName = `__prevent-name-collision__search-author-service`
const searchDiscussServicePropertyName = `__prevent-name-collision__search-discuss-service`
const searchSymbolServicePropertyName = `__prevent-name-collision__search-symbol-service`

type GlobalThisWithPrismaClient = typeof globalThis & {
  [searchAuthorServicePropertyName]: SearchAuthorServiceClass
  [searchDiscussServicePropertyName]: SearchDiscussServiceClass
  [searchSymbolServicePropertyName]: SearchSymbolServiceClass
}

const getSearchAuthorService = (): SearchAuthorServiceClass => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchAuthorServiceClass()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[searchAuthorServicePropertyName]) {
      console.log('Creating global search-author-service')
      newGlobalThis[searchAuthorServicePropertyName] = new SearchAuthorServiceClass()
    }
    return newGlobalThis[searchAuthorServicePropertyName]
  }
}

const getSearchDiscussService = (): SearchDiscussServiceClass => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchDiscussServiceClass()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[searchDiscussServicePropertyName]) {
      console.log('Creating global search-discuss-service')
      newGlobalThis[searchDiscussServicePropertyName] = new SearchDiscussServiceClass()
    }
    return newGlobalThis[searchDiscussServicePropertyName]
  }
}

const getSearchSymbolService = (): SearchSymbolServiceClass => {
  if (process.env.NODE_ENV === 'production') {
    return new SearchSymbolServiceClass()
  } else {
    const newGlobalThis = globalThis as GlobalThisWithPrismaClient
    if (!newGlobalThis[searchSymbolServicePropertyName]) {
      console.log('Creating global search-symbol-service')
      newGlobalThis[searchSymbolServicePropertyName] = new SearchSymbolServiceClass()
    }
    return newGlobalThis[searchSymbolServicePropertyName]
  }
}

export const SearchAuthorService = getSearchAuthorService()

export const SearchDiscussService = getSearchDiscussService()

export const SearchSymbolService = getSearchSymbolService()
