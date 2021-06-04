import { SrcType } from '../index'
import { DomainFetchFunction } from './index'

export type ParseUrlResult = {
  resolvedUrl: string
  domain: string
}

export function parseUrl(url: string): ParseUrlResult {
  // TODO: 不同的URL(eg: short-url)可能指向同一頁面，需整合 特別是URL params
  let u = new URL(url)
  return {
    domain: u.hostname,
    resolvedUrl: url,
  }
}

export const general: DomainFetchFunction = async function (url) {
  /** TODO: 若是在browser，嘗試抓該網站的title,... */
  const { domain } = parseUrl(url)

  if (domain === undefined) throw new Error(`Fetch error ${url}`)
  return {
    domain,
    resolvedUrl: url,
    srcType: SrcType.OTHER,
  }
}
