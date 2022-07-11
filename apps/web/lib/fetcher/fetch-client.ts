import { LinkScrapedResult } from '../interfaces'
import { MemoryCache } from './memory-cache'
import { tryFetch } from './vendors/index'

export class FetchClient {
  // Cache support
  private cache: MemoryCache | null = null

  constructor(localCachePath: string | null = null) {
    if (localCachePath) {
      this.cache = new MemoryCache(localCachePath)
    }
  }

  public async fetch(
    url: string,
  ): Promise<LinkScrapedResult & { fromCache?: true }> {
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
