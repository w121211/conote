import { ScraperPack } from '../types'
import keywordsPack from './keywords'

const reMeta = /win\.YAHOO\.context\.meta\s=\s(.+);/m
const reTickers = /ticker=\\"([^\s]*)\\"/
const reWiki = /wiki_topics=\\"([^\s]*)\\"/

const pack: ScraperPack = {
  matchUrl: 'finance.yahoo.com',
  ruleMap: {
    keywords: keywordsPack.ruleMap.keywords,
    tickers: [
      ({ $ }) => {
        const results = $('script[type="text/javascript"]')
          .map((i, e): string => $(e).contents().text())
          .get()
          .filter(e => e.includes('win.YAHOO.context.meta'))

        for (const e of results) {
          const match = reTickers.exec(e)
          if (match) {
            return match[1].split(';')
          }
        }
        return []
      },
    ],
  },
}

export default pack
