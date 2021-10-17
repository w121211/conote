import { CheerioAPI } from 'cheerio'

type Result = {
  keywords: string[]
  tickers: string[]
}

export type ScrapeResult = Partial<Result>

export type RuleParams = {
  url: string
  $: CheerioAPI
}

export type Rule = (params: RuleParams) => string | string[] | null | undefined

export type RuleMap = {
  [k in keyof Result]?: Rule[]
}

export type ScraperPack = {
  matchUrl?: string
  ruleMap: RuleMap
}

export type Scraper = (params: {
  url: string
  html: string
  // ruleSet: RuleSet[]
}) => Promise<ScrapeResult>
