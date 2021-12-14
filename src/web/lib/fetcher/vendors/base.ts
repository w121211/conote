import got from 'got'
import createMetascraper from 'metascraper'
import metascraperAuthor from 'metascraper-author'
import metascraperDate from 'metascraper-date'
import metascraperDescription from 'metascraper-description'
import metascraperLang from 'metascraper-lang'
import metascraperTitle from 'metascraper-title'
import metascraperUrl from 'metascraper-url'
import { createScraper } from '../../../../packages/scraper/src/scraper'
import yfinancePack from '../../../../packages/scraper/src/packs/yfinance'
import keywordsPack from '../../../../packages/scraper/src/packs/keywords'
import tickersPack from '../../../../packages/scraper/src/packs/tickers'
import { DomainFetchFunction } from './index'

const metascraper = createMetascraper([
  metascraperAuthor(),
  metascraperDate(),
  metascraperDescription(),
  metascraperLang(),
  metascraperTitle(),
  metascraperUrl(),
])

const extraScraper = createScraper([yfinancePack, keywordsPack, tickersPack])

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

export const base: DomainFetchFunction = async function (url) {
  const { body: html, url: finalUrl } = await got(url)
  const { url: scrapedUrl, author, date, description, lang, title } = await metascraper({ html, url: finalUrl })
  // const {ke}
  const { keywords, tickers } = await extraScraper({ html, url: finalUrl })

  const { domain } = parseUrl(finalUrl)
  // if (domain === undefined) {
  //   throw new Error(`Fetch error: ${url} ${finalUrl}`)
  // }

  return {
    domain,
    finalUrl: scrapedUrl,
    srcType: 'OTHER',
    authorName: author,
    date,
    description,
    lang,
    title,
    keywords,
    tickers,
  }
}
