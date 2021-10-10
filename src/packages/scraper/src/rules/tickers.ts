import { Rule, RuleProps } from '../scraper'

// const scrape = ($: CheerioAPI) => {}

const reTicker = /^[A-Z]+$/

const rules: Rule[] = [
  /** 抓取 webpage 的所有 links，若 link 的文字符合 ticker & href 與 link 相符，視為 ticker */
  ({ $ }: RuleProps): string[] => {
    const links = $('a')
    const tickers: string[] = []
    links.each((i, e) => {
      const href = $(e).attr('href')
      const s = $(e).text().trim()
      // const match = reTicker.exec(text)
      if (href && !tickers.includes(s) && reTicker.test(s) && href.includes(s)) {
        // console.log(s, href)
        tickers.push(s)
      }
    })
    return tickers
  },
]

// const scraper = createScraper([{ tickers: rules }])
// const scrapeTickers = async (url: string) => {
//   const { body: html, url: finalUrl } = await got(url)
//   const $ = cheerio.load(html)
//   // const res = $('a').contents().toArray()
//   // console.log(res)
//   //
//   const links = $('a')
//   // links.each((i, e) => {
//   //   console.log($(e).text(), $(e).attr('href'))
//   // })
//   // console.log(jsonld($))
//   const res = $jsonld('author.name')($)
//   console.log(res)
// }

export default { tickers: rules }
