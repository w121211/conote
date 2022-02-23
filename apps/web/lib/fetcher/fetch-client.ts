import { MemoryCache } from './memory-cache'
import { tryFetch } from './vendors/index'

export type SrcType = 'VIDEO' | 'POST' | 'AUTHOR' | 'OTHER'

export type FetchResult = {
  domain: string
  finalUrl: string
  srcId?: string
  srcType: SrcType

  // metascraper
  authorId?: string
  authorName?: string
  date?: string
  description?: string
  lang?: string
  title?: string

  // ./packages/scraper
  keywords?: string[]
  tickers?: string[]
  error?: string
}

export class FetchClient {
  private cache: MemoryCache | null = null // cache support

  constructor(localCachePath: string | null = null) {
    if (localCachePath) {
      this.cache = new MemoryCache(localCachePath)
    }
  }

  public async fetch(url: string): Promise<FetchResult & { fromCache?: true }> {
    if (this.cache) {
      try {
        return {
          ...this.cache.get(url),
          fromCache: true,
        }
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
