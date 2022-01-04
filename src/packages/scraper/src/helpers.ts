import { decodeHTML } from 'entities'
import { CheerioAPI } from 'cheerio'
import memoizeOne from 'memoize-one'
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

// export const $jsonld =
//   (propName: string) =>
//   ($: CheerioAPI): string | undefined => {
//     const collection = jsonld($)
//     let value
//     console.log(collection)
//     collection.find(item => {
//       value = get(item, propName)
//       return !isEmpty(value) || isNumber(value) || isBoolean(value)
//     })
//     return isString(value) ? decodeHTML(value) : value
//   }

export const $jsonld = ($: CheerioAPI, key: string): string | undefined => {
  // const res = $('script[type="application/ld+json"]')
  const collection = jsonld($)
  let value
  collection.find(item => {
    value = get(item, key)
    return !isEmpty(value) || isNumber(value) || isBoolean(value)
  })
  return isString(value) ? decodeHTML(value) : value
}
