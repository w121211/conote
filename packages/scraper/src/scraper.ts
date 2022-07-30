/**
 * Code mostly borrow from metascraper, @see
 */
import cheerio from 'cheerio'
import { fromPairs, isNull, isString } from 'lodash'
import memoizeOne from 'memoize-one'
import { Rule, RuleMap, RuleParams, Scraper, ScrapeResult, ScraperPack } from './types'

const hasValue = (value: unknown | unknown[]) => {
  if (Array.isArray(value)) {
    return value.length > 0
  }
  return value !== undefined && !Number.isNaN(value)
}

const normalizeValue = (value: unknown | unknown[]) => (hasValue(value) ? value : null)

const isKeyOfRuleMap = (k: string): k is keyof RuleMap => {
  return ['keywords', 'tickers'].includes(k)
}

const createMatchUrlFn = (domain: string) => {
  return (url: string): boolean => {
    return url.includes(domain)
  }
}
const withMatchUrl = (rule: Rule, matchUrl: (url: string) => boolean): Rule => {
  return ({ url, ...rest }: RuleParams) => {
    if (matchUrl(url)) {
      return rule({ url, ...rest })
    }
    return undefined
  }
}

const mergePacks = (packs: ScraperPack[]): RuleMap => {
  const merged: RuleMap = {}
  for (const pack of packs) {
    const matchUrlFn = pack.matchUrl ? memoizeOne(createMatchUrlFn(pack.matchUrl)) : undefined
    Object.entries(pack.ruleMap).forEach(([k, v]) => {
      if (isKeyOfRuleMap(k)) {
        const rules = matchUrlFn ? v.map((e): Rule => withMatchUrl(e, matchUrlFn)) : v
        merged[k] = [...(merged[k] ?? []), ...rules]
      } else {
        throw `isKeyOfRuleMap(k) === false, rule map key is not defined in ScrapeResult, ${k}`
      }
    })
  }
  return merged
}

const tryRule = async (rules: Rule[], params: RuleParams) => {
  for (const rule of rules) {
    // eslint-disable-next-line no-await-in-loop
    const value = await Promise.resolve(rule(params)) // fake promise
    if (hasValue(value)) {
      return value
    }
  }
  return undefined
}

const scrape = async ({ ruleMap, ...ruleParams }: { ruleMap: RuleMap } & RuleParams): Promise<ScrapeResult> => {
  const normalize = (v: string | string[] | null | undefined): string[] | undefined => {
    if (isString(v)) {
      return v.split(',').map(e => e.trim()) // try to parse
    }
    if (isNull(v)) {
      return undefined
    }
    return v
  }

  const promises = Object.entries(ruleMap).map(
    async ([k, v]): Promise<[string, string | string[] | null | undefined]> => {
      const value = await tryRule(v, ruleParams)
      // return [k, normalizeValue(value)]
      return [k, value]
    },
  )

  const data = fromPairs(await Promise.all(promises))
  const result: ScrapeResult = {
    keywords: normalize(data.keywords),
    tickers: normalize(data.tickers),
  }
  return result
}

export const createScraper = (packs: ScraperPack[]): Scraper => {
  const merged = mergePacks(packs)
  const scraper: Scraper = async ({ url, html }) => {
    return scrape({
      ruleMap: merged,
      url,
      $: cheerio.load(html),
      // ...kwargs,
    })
  }
  return scraper
}
