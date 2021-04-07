// import _ from 'lodash'
// import { hash, hashSync } from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { prisma, foo } from '../context'
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
  })
})
