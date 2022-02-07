/**
 * yarn run test-lib search.test
 */
/* eslint-disable no-await-in-loop */
import { SearchSymbolService } from '../../lib/search/search-symbol-service'

it('SearchSymbolService.search()', async () => {
  expect(await SearchSymbolService.search('AI')).toMatchSnapshot()
  expect(await SearchSymbolService.search('ai', 'TICKER')).toMatchSnapshot()
  expect(await SearchSymbolService.search('ai', 'TOPIC')).toMatchSnapshot()
  expect(await SearchSymbolService.search('半', 'TOPIC')).toMatchSnapshot()
  expect(await SearchSymbolService.search('半導體', 'TOPIC')).toMatchSnapshot()
})
