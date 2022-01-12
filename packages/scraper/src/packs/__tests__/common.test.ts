import got from 'got'
import { createScraper } from '../../scraper'
import keywordsPack from '../keywords'
import tickersPack from '../tickers'

const testUrls = [
  'https://www.mobile01.com/topicdetail.php?f=793&t=6520838',
  'https://news.cnyes.com/news/id/4738961',
  'https://news.cnyes.com/news/id/4741929?exp=a',
]

it.each(testUrls)('keywords %s', async url => {
  const scraper = createScraper([keywordsPack])
  const { body: html, url: finalUrl } = await got(url)
  const { keywords } = await scraper({ url: finalUrl, html })
  expect(keywords).toMatchSnapshot()
})

it.each(testUrls)('tickers %s', async url => {
  const scraper = createScraper([tickersPack])
  const { body: html, url: finalUrl } = await got(url)
  const { tickers } = await scraper({ url: finalUrl, html })
  expect(tickers).toMatchSnapshot()
})
