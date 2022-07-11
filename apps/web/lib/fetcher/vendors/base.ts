import got, { HTTPError } from 'got'
// import createMetascraper from 'metascraper'
// import metascraperAuthor from 'metascraper-author'
// import metascraperDate from 'metascraper-date'
// import metascraperDescription from 'metascraper-description'
// import metascraperLang from 'metascraper-lang'
// import metascraperTitle from 'metascraper-title'
// import metascraperUrl from 'metascraper-url'
import { createScraper } from '@conote/scraper'
import yfinancePack from '@conote/scraper/dist/packs/yfinance'
import keywordsPack from '@conote/scraper/dist/packs/keywords'
import tickersPack from '@conote/scraper/dist/packs/tickers'
import type { DomainFetchFunction } from './index'

// const metascraper = createMetascraper([
//   metascraperAuthor(),
//   metascraperDate(),
//   metascraperDescription(),
//   metascraperLang(),
//   metascraperTitle(),
//   metascraperUrl(),
// ])
const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  // require('metascraper-image')(),
  require('metascraper-lang')(),
  // require('metascraper-clearbit')(),
  // require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')(),
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

export const base: DomainFetchFunction = async url => {
  try {
    const { body: html, url: finalUrl } = await got(url)
    const {
      url: scrapedUrl,
      author,
      date,
      description,
      lang,
      title,
    } = await metascraper({ html, url: finalUrl })
    const { keywords, tickers } = await extraScraper({ html, url: finalUrl })
    const { domain } = parseUrl(finalUrl)
    // if (domain === undefined) {
    //   throw new Error(`Fetch error: ${url} ${finalUrl}`)
    // }

    return {
      domain,
      finalUrl: scrapedUrl,
      srcType: 'other',
      authorName: author,
      date,
      description,
      lang,
      title,
      keywords,
      tickers,
    }
  } catch (err) {
    if (err instanceof HTTPError) {
      const { domain } = parseUrl(url)
      return {
        domain,
        finalUrl: url,
        srcType: 'other',
        error: err.message,
      }
    } else {
      throw err
    }
  }
}
