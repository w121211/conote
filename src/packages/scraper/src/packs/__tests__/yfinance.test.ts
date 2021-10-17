import got from 'got'
import { createScraper } from '../../scraper'
import keywordsPack from '../keywords'
import tickersPack from '../tickers'
import yfinancePack from '../yfinance'

it.each([['https://finance.yahoo.com/news/2-musk-tesla-plant-party-112005747.html']])('yfinance %s', async url => {
  const scraper = createScraper([yfinancePack])
  const { body: html, url: finalUrl } = await got(url)
  const result = await scraper({ url: finalUrl, html })
  expect(result).toMatchSnapshot()
})
