import { youtube } from '../youtube'

describe('fetch youtube', () => {
  it('loads env YOUTUBE_API_KEY', () => {
    expect(process.env.YOUTUBE_API_KEY).not.toBe(undefined)
  })

  it('get metadata', async () => {
    expect(await youtube('https://www.youtube.com/watch?v=9KUj1174V8w')).toMatchSnapshot()
  })
})
