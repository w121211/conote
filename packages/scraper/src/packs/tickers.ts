import { ScraperPack } from '../types'

const reTickers = [
  /^([A-Z]+)$/,
  /^([A-Z]+)-US$/, // GLW-US
  /^(\d+)-TW$/, // 8261-TW
]

const match = (str: string): string[] | null => {
  for (const re of reTickers) {
    const match = re.exec(str)
    if (match) {
      return [match[0], match[1]]
    }
  }
  return null
}

const inHref = (href: string, candidates: string[]): boolean => {
  for (const e of candidates) {
    if (href.includes(e)) return true
  }
  return false
}

const pack: ScraperPack = {
  ruleMap: {
    tickers: [
      ({ $ }) => {
        /** 抓取 webpage 的所有 links，若 link 的文字符合 ticker & href 與 link 相符，視為 ticker */
        const tickers: string[] = []
        $('a').each((i, e) => {
          const href = $(e).attr('href')
          const s = $(e).text().trim()
          if (href && !tickers.includes(s)) {
            const matched = match(s)
            if (matched && inHref(href, matched)) {
              tickers.push(s)
            }
          }
        })
        return tickers
      },
    ],
  },
}

export default pack
