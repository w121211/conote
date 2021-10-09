import { LocalCache } from './local-cache'
import { tryFetch } from './vendors/index'

export type SrcType = 'VIDEO' | 'POST' | 'AUTHOR' | 'OTHER'

export type FetchResult = {
  domain: string
  finalUrl: string
  srcId?: string
  srcType: SrcType
  // metadata
  authorId?: string
  authorName?: string
  date?: string
  description?: string
  keywords?: string[]
  lang?: string
  title?: string
}

export class FetchClient {
  // 有cache支援
  private cache: LocalCache | null = null

  constructor(localCachePath: string | null = null) {
    if (localCachePath) {
      this.cache = new LocalCache(localCachePath)
    }
  }

  public async fetch(url: string): Promise<FetchResult & { fromCache?: true }> {
    if (this.cache) {
      try {
        return { ...this.cache.get(url), fromCache: true }
      } catch {
        const res = await tryFetch(url)
        this.cache.set(url, res)
        return res
      }
    }
    return await tryFetch(url)
  }

  public dump(): void {
    if (this.cache) {
      this.cache.dump()
    }
  }
}