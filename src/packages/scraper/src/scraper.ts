import { decodeHTML } from 'entities'

import cheerio, { CheerioAPI } from 'cheerio'
import {
  chain,
  concat,
  eq,
  flow,
  forEach,
  fromPairs,
  get,
  has,
  includes,
  invoke,
  isArray,
  isBoolean,
  isDate,
  isEmpty,
  isNumber,
  isString,
  lte,
  map,
  replace,
  set,
  size,
  toLower,
  toPairs,
  toString,
} from 'lodash'
import memoizeOne from 'memoize-one'

// interface Metadata {
//   author: string
//   date: string
//   description: string
//   image: string
//   publisher: string
//   title: string
//   url: string
// }

export type RuleProps = {
  url: string
  $: CheerioAPI
}

export type Rule = (props: RuleProps) => string[] | string | null | undefined

type RuleSet = Record<string, Rule[]>

type ScraperProps = {
  url: string
  html: string
  // ruleSet: RuleSet[]
}

type Scraper = (props: ScraperProps) => Promise<Record<string, string | string[] | undefined>>

const jsonld = memoizeOne(
  ($: CheerioAPI) =>
    $('script[type="application/ld+json"]')
      .map((i, e) => {
        try {
          return JSON.parse($(e).contents().text())
        } catch (err) {
          return undefined
        }
      })
      .get()
      .filter(Boolean),
  (newArgs, lastArgs) => newArgs[0].html() === lastArgs[0].html(),
)

const $jsonld = (propName: string) => ($: CheerioAPI) => {
  const collection = jsonld($)
  let value

  console.log(collection)

  collection.find(item => {
    value = get(item, propName)
    return !isEmpty(value) || isNumber(value) || isBoolean(value)
  })

  return isString(value) ? decodeHTML(value) : value
}

const hasValue = (value: unknown) => value !== undefined && !Number.isNaN(value)

const normalizeValue = (value: unknown) => (hasValue(value) ? value : null)

// const forEachRule = (collection, fn) => forEach(castArray(collection), fn)

// const loadRules = (rulesBundle: RuleSet[]) =>
//   chain(rulesBundle)
//     .reduce((acc, { test, ...rules }) => {
//       forEach(rules, (innerRules, propName) => {
//         if (test) forEachRule(innerRules, rule => (rule.test = test))
//         set(acc, propName, has(acc, propName) ? concat(acc[propName], innerRules) : concat(innerRules))
//         return acc
//       })
//       return acc
//     }, {})
//     .toPairs()
//     .value()

// const mergeRules = (rules, baseRules) =>
//   chain(rules)
//     .reduce((acc, { test, ...rules }) => {
//       forEach(rules, (innerRules, propName) => {
//         if (test) forEachRule(innerRules, rule => (rule.test = test))
//         // find the rules associated with `propName`
//         const index = findIndex(acc, item => first(item) === propName)
//         // if `propName` has more rule, add the new rule from the end
//         if (index !== -1) acc[index][1] = concat(innerRules, ...acc[index][1])
//         // otherwise, create an array of rules
//         else acc.push([propName, castArray(innerRules)])
//       })
//       return acc
//     }, cloneDeep(baseRules))
//     .value()

const findRule = async (rules: Rule[], props: RuleProps) => {
  const has = (value: unknown): boolean => value !== undefined && !Number.isNaN(value)
  // let index = 0
  // let value
  // do {
  //   const rule = rules[index++]
  //   const test = rule.test ?? truthyTest
  //   if (test(args)) value = await rule(kwargs)
  // } while (!has(value) && index < rules.length)
  // return value
  for (const rule of rules) {
    // if (check.test) {
    //   check.test(args)
    // }
    // eslint-disable-next-line no-await-in-loop
    const value = await Promise.resolve(rule(props)) // fake promise
    if (has(value)) {
      return value
    }
  }
  return undefined
}

async function getData({ ruleSet, ...props }: { ruleSet: RuleSet } & RuleProps) {
  const rulePairs = toPairs(ruleSet)
  const data = await Promise.all(
    map(rulePairs, async ([propName, rules]) => {
      const value = await findRule(rules, props)
      return [propName, normalizeValue(value)]
    }),
  )
  return fromPairs(data)
}

export function createScraper(ruleSets: RuleSet[]): Scraper {
  const merged = ruleSets[0]
  const scraper: Scraper = async ({ url, html }) => {
    return getData({
      url,
      $: cheerio.load(html),
      // rules: mergeRules(inlineRules, loadedRules),
      ruleSet: merged,
      // ...kwargs,
    })
  }
  return scraper
}
