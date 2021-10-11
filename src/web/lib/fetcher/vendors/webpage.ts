// import { SrcType } from '../index'
import got from 'got'
import { DomainFetchFunction } from './index'

// import { $filter, toRule, memoizeOne } from '@metascraper/helpers'

import createMetascraper, { Rule, RuleSet, CheckOptions } from 'metascraper'
import metascraperAuthor from 'metascraper-author'
import metascraperDate from 'metascraper-date'
import metascraperDescription from 'metascraper-description'
import metascraperLang from 'metascraper-lang'
import metascraperTitle from 'metascraper-title'
import metascraperUrl from 'metascraper-url'

const keywordsRule: Rule = () => ({
  keywords: [
    ({ htmlDom: $, url }) => {
      console.log('~~~~~')
      console.log($)

      const a = ($ as any)('h2.title')
      console.log($)
      console.log(a)

      return 'hello world'
    },
  ],
})

const metascraper = createMetascraper([
  // metascraperAuthor(),
  // metascraperDate(),
  // metascraperDescription(),
  // metascraperLang(),
  // metascraperTitle(),
  // metascraperUrl(),
  keywordsRule,
])

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

  // const { domain } = parseUrl(metadata.url)
  // if (domain === undefined) {
  //   throw new Error(`Fetch error: ${url} ${finalUrl}`)
  // }

  console.log(metadata)

  return {
    domain: 'domain',
    finalUrl: metadata.url,
    srcType: 'OTHER',
    authorName: metadata.author,
    date: metadata.date,
    description: metadata.description,
    lang: metadata.lang,
    title: metadata.title,
    // keywords: metadata.keywords,
    // keywords?: string[]
  }
}
