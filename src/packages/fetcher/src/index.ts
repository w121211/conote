export * from './fetch-client'
export * from './domain/index'
export * from './domain/general'

export const SrcType = {
  VIDEO: 'VIDEO',
  POST: 'POST',
  AUTHOR: 'AUTHOR',
  OTHER: 'OTHER',
}

export type FetchResult = {
  domain: string
  resolvedUrl: string
  srcId?: string
  srcType: string
  srcTitle?: string
  srcPublishDate?: string
  authorId?: string
  authorName?: string
  keywords?: string[]
  description?: string
}
