import got from 'got'
import { createScraper } from '../../scraper'
import tickersRule from '../tickers'

describe('tickers()', () => {
  it.each([['https://finance.yahoo.com/news/2-musk-tesla-plant-party-112005747.html']])(
    'get metadata of %s',
    async url => {
      const scraper = createScraper([tickersRule])
      const { body: html, url: finalUrl } = await got(url)
      expect(await scraper({ url: finalUrl, html })).toMatchSnapshot()
    },
  )
})
