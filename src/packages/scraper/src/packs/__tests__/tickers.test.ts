import got from 'got'
import { createScraper } from '../../scraper'
import keywordsPack from '../keywords'
import tickersPack from '../tickers'

const testUrls = [
  'https://news.cnyes.com/news/id/4738961',
  'https://news.cnyes.com/news/id/4741929?exp=a',
  // 'https://finance.yahoo.com/news/2-musk-tesla-plant-party-112005747.html',
]

// it.each(testUrls)('keywords %s', async url => {
//   const scraper = createScraper([keywordsPack])
//   const { body: html, url: finalUrl } = await got(url)
//   expect(await scraper({ url: finalUrl, html })).toMatchSnapshot()
// })

it.each(testUrls)('tickers %s', async url => {
  const scraper = createScraper([tickersPack])
  const { body: html, url: finalUrl } = await got(url)
  expect(await scraper({ url: finalUrl, html })).toMatchSnapshot()
})
