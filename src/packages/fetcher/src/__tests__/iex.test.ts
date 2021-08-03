// import _ from 'lodash'
// import { hash, hashSync } from 'bcryptjs'
// import { PrismaClient } from '@prisma/client'
// import { prisma, foo } from '../context'
import { existsSync, readFileSync, unlinkSync } from 'fs'
import { resolve } from 'path'
import { FetchClient } from '../index'
// import * as domainFetchers from '../domain/general'
import { IexClient } from '../domain/iex'

describe('IexApi class', () => {
  it('loads env IEX_TOKEN', () => {
    expect(process.env.IEX_TOKEN).not.toBe(undefined)
  })

  it('getAllSymbols', async () => {
    expect(await IexClient.getAllSymbols()).toMatchSnapshot()
  })
})
