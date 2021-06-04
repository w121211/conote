import { existsSync, readFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { FetchClient } from '../index'
import { tryFetch } from '../domain/index'

describe('function tryFetch', () => {
  it('fetch youtube', async () => {
    expect(await tryFetch('https://www.youtube.com/watch?v=CKljNQ5xe2w')).toMatchSnapshot()
  })

  it('fetch general', async () => {
    expect(await tryFetch('https://test.com')).toMatchSnapshot()
  })
})

describe('class FetchClient', () => {
  const localCachePath = resolve(process.cwd(), './localcache.test.json')
  let fetcher: FetchClient

  // 這個無法使用，可能是因為fetcher是class
  // jest.spyOn(index, 'fetch').mockImplementation(async () => {
  //   console.log('fetch~~~~~')
  //   return {
  //     domain: 'mock.test.com',
  //     resolvedUrl: 'https://mock.test.com',
  //     srcType: 'OTHER',
  //   }
  // })
  // expect(fetchSpy).toBeCalled()

  beforeAll(async () => {
    fetcher = new FetchClient(localCachePath)
    await fetcher.fetch('https://test.com')
  })

  afterAll(() => {
    unlinkSync(localCachePath)
  })

  it('use cache', async () => {
    expect(await fetcher.fetch('https://test.com')).toEqual({
      fromCache: true,
      domain: 'test.com',
      resolvedUrl: 'https://test.com',
      srcType: 'OTHER',
    })
  })

  it('dump cache', async () => {
    fetcher.dump()
    expect(JSON.parse(readFileSync(localCachePath, { encoding: 'utf8' }))).toEqual({
      'https://test.com': { domain: 'test.com', resolvedUrl: 'https://test.com', srcType: 'OTHER' },
    })
  })
})
