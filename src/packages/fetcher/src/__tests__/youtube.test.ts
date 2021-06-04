// import _ from 'lodash'
// import { hash, hashSync } from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { prisma, foo } from '../context'
import { existsSync, readFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { FetchClient } from '../index'
// import * as domainFetchers from '../domain/general'
import { youtube } from '../domain/youtube'

describe('fetch youtube', () => {
  it('loads env YOUTUBE_API_KEY', () => {
    expect(process.env.YOUTUBE_API_KEY).not.toBe(undefined)
  })

  it('get metadata', async () => {
    expect(await youtube('https://www.youtube.com/watch?v=9KUj1174V8w')).toMatchSnapshot()
  })
})
