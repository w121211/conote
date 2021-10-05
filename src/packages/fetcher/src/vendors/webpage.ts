// import { SrcType } from '../index'
import got from 'got'
import { DomainFetchFunction } from './index'

import createMetascraper, { Rule } from 'metascraper'
import metascraperAuthor from 'metascraper-author'

// const metascraper = require('metascraper')([
//   require('metascraper-author')(),
//   require('metascraper-date')(),
//   require('metascraper-description')(),
//   require('metascraper-image')(),
//   require('metascraper-logo')(),
//   require('metascraper-clearbit')(),
//   require('metascraper-publisher')(),
//   require('metascraper-title')(),
//   require('metascraper-url')()
// ])

const metascraper = createMetascraper([metascraperAuthor()])

// const rule: Rule = () => {
//   return {
//     keywords: () => 'hello world',
//   }
// }

export type ParseUrlResult = {
  resolvedUrl: string
  domain: string
}

export function parseUrl(url: string): ParseUrlResult {
  // TODO: 不同的URL(eg: short-url)可能指向同一頁面，需整合 特別是URL params
  const u = new URL(url)
  return {
    domain: u.hostname,
    resolvedUrl: url,
  }
}

export const webpage: DomainFetchFunction = async function (url) {
  const { body: html, url: finalUrl } = await got(url)
  const metadata = await metascraper({ html, url: finalUrl })
  console.log(metadata)

  const { domain } = parseUrl(finalUrl)
  if (domain === undefined) {
    throw new Error(`Fetch error: ${url} ${finalUrl}`)
  }

  return {
    domain,
    resolvedUrl: url,
    srcType: 'OTHER',
  }
}
