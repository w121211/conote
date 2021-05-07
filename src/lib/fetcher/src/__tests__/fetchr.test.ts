// import _ from 'lodash'
// import { hash, hashSync } from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { prisma, foo } from '../context'
<<<<<<< HEAD
import { fetch } from '../index'
import { fetcher } from '../fetcher'
// import { _clean, BOT, TESTUSERS } from '../test-helper'

describe('fetch function', () => {
  it('get fetch url', async () => {
    const res = await fetch('https://test.com')
    expect(res).toMatchSnapshot()
  })
})

describe('fetch youtube', () => {
  it('get meta info', async () => {
    const res = await fetcher.youtube('https://www.youtube.com/watch?v=9KUj1174V8w')
    expect(res).toMatchSnapshot()
=======
import { existsSync, readFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { fetch, FetchClient } from '../index'
import * as domainFetchers from '../domain-fetcher'
// import { _clean, BOT, TESTUSERS } from '../test-helper'

// describe('function fetch', () => {
//   it('resolves url', async () => {
//     expect(await fetch('https://test.com')).toMatchSnapshot()
//   })

//   it('use domain fetch', async () => {
//     expect(await fetch('https://test.com')).toEqual(await domainFetchers.general('https://test.com'))
//     expect(await fetch('https://test.com')).toEqual(await domainFetchers.general('https://test.com'))
//   })
// })

describe('domain fetch', () => {
  it('youtube', async () => {
    expect(await domainFetchers.youtube('https://www.youtube.com/watch?v=9KUj1174V8w')).toMatchSnapshot()
  })

  it('general', async () => {
    expect(await domainFetchers.general('https://test.com', 'test.com')).toMatchSnapshot()
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
>>>>>>> backend-dev
  })
})
