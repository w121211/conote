export * from './fetch-client'
export * from './vendors/index'

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
