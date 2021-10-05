import { webpage } from '../webpage'

describe('fetch webpage', () => {
  it.each([['https://news.cnyes.com/news/id/4700195']])('get metadata of %s', async url => {
    expect(await webpage(url)).toMatchSnapshot()
  })
})
