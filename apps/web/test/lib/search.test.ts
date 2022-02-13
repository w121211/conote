/**
 * yarn run test-lib search.test
 */
/* eslint-disable no-await-in-loop */
import { SearchAuthorService, SearchSymService } from '../../lib/search/search'

it('SearchSymService.search() all', async () => {
  expect((await SearchSymService.search('AI')).map(e => e.symbol)).toMatchSnapshot()
  expect((await SearchSymService.search('半導體')).map(e => e.symbol)).toMatchSnapshot()
})

it('SearchSymService.search() ticker only', async () => {
  expect((await SearchSymService.search('ai', 'TICKER')).map(e => e.symbol)).toMatchSnapshot()
})

it('SearchSymService.search() topic only', async () => {
  expect((await SearchSymService.search('半導體', 'TOPIC')).map(e => e.symbol)).toMatchSnapshot()
})

it('SearchAuthorService.search()', async () => {
  expect((await SearchAuthorService.search('NaNa')).map(e => e.name)).toMatchSnapshot()
  expect((await SearchAuthorService.search('美股')).map(e => e.name)).toMatchSnapshot()
  // expect(await SearchSymbolService.search('半導體', 'TOPIC')).toMatchSnapshot()
})
