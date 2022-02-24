import { base } from '../../../../lib/fetcher/vendors/base'

describe('fetch webpage', () => {
  it.each([['https://news.cnyes.com/news/id/4700195']])('get metadata of %s', async url => {
    expect(await base(url)).toMatchSnapshot()
  })
})
