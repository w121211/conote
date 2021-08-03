export * from './fetch-client'
export * from './domain/index'
export * from './domain/common'

export type SrcType = 'VIDEO' | 'POST' | 'AUTHOR' | 'OTHER'

export type FetchResult = {
  domain: string
  resolvedUrl: string
  srcId?: string
  srcType: SrcType
  srcTitle?: string
  srcPublishDate?: string
  authorId?: string
  authorName?: string
  keywords?: string[]
  description?: string
}
