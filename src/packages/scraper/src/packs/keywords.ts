import { $jsonld } from '../helpers'
import { ScraperPack } from '../types'

const pack: ScraperPack = {
  ruleMap: {
    keywords: [
      ({ $ }) => $jsonld($, 'keywords'),
      ({ $ }) => $('meta[itemprop="keywords"]').attr('content')?.split(','), // cnyes.com
    ],
  },
}

export default pack
