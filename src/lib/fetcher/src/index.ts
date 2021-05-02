import { fetcher } from './fetcher'

export const SrcType = {
  VIDEO: 'VIDEO',
  POST: 'POST',
  AUTHOR: 'AUTHOR',
  OTHER: 'OTHER',
}

export interface FetchResult {
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

export interface ParsedUrl {
  url: string
  domain: string
}

export function parseUrl(url: string): ParsedUrl {
  /**
   * TODO: 不同的URL(eg: short-url)可能指向同一頁面，需整合
   * - 特別是URL params
   */
  let u = new URL(url)
  return {
    url: url,
    domain: u.hostname,
  }
}

export async function fetch(url: string): Promise<FetchResult> {
  /** 嘗試連接URL取得來源資訊 */
  const parsed = parseUrl(url)

  // let fetched: FetchResult
  // if (parsed.domain === 'www.youtube.com') {
  //   fetched = await fetcher.youtube(parsed.url)
  // } else {
  //   fetched = await fetcher.default(parsed.url, parsed.domain)
  // }
  // return fetched

  return await fetcher.default(parsed.url, parsed.domain)
}
