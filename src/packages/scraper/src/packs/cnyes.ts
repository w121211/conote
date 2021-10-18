import { $jsonld } from '../helpers'
import { RuleSet } from '../scraper'

const reTicker = /^[A-Z]+$/

const ruleSet: RuleSet = {
  matchUrl: ({ url }) => isDomain({ url, domain: 'cnyes.com' }),
  keywords: [({ $ }) => $jsonld($, 'keywords')],
  tickers: [],
}

export default ruleSet
