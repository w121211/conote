import * as domainFetcher from './domain-fetcher'
import { LocalCache } from './local-cache'

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

export type ParsedUrl = {
  url: string
  domain: string
}

export function parseUrl(url: string): ParsedUrl {
  // TODO: 不同的URL(eg: short-url)可能指向同一頁面，需整合 特別是URL params
  let u = new URL(url)
  return {
    url: url,
    domain: u.hostname,
  }
}

export async function fetch(url: string): Promise<FetchResult> {
  /** 嘗試連接URL取得來源資訊 */
  const parsed = parseUrl(url)

  let fetched: FetchResult
  // if (parsed.domain === 'www.youtube.com') {
  //   fetched = await domainFetcher.youtube(parsed.url)
  // } else {
  //   fetched = await domainFetcher.general(parsed.url, parsed.domain)
  // }
  fetched = await domainFetcher.general(parsed.url, parsed.domain)
  return fetched
}

export class FetchClient {
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
        const res = await fetch(url)
        this.cache.set(url, res)
        return res
      }
    }
    return await fetch(url)
  }

  public dump(): void {
    if (this.cache) {
      this.cache.dump()
    }
  }
}
