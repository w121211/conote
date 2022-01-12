/* eslint-disable no-await-in-loop */
// import _ from 'lodash'
// import { PrismaClient } from '@prisma/client'
// import prisma from '../../lib/prisma'
import { getAllSymbols, searchAllSymbols } from '../../lib/search/fuzzy'

// beforeAll(async () => {
//   console.log('Writing test data...')
//   const _prisma = new PrismaClient()
//   await createTestUsers(_prisma)
//   await createTestSymbols(_prisma)
//   _prisma.$disconnect()
// })

// afterAll(async () => {
//   prisma.$disconnect()
// })

it('get all symbols', async () => {
  const symbols = await getAllSymbols()
  expect(symbols.map(e => e.name)).toEqual([
    '$AAA',
    '$ABB',
    '$ACC',
    '$BBB',
    '$CCC',
    '$DDD',
    '[[Apple]]',
    '[[Google]]',
    '[[蘋果]]',
    '[[估狗]]',
    '[[Apple love Google]]',
    '[[Google hate Apple]]',
  ])
})

it('search all symbols', async () => {
  expect(await searchAllSymbols('$')).toEqual(['$AAA', '$ABB', '$ACC', '$BBB', '$CCC', '$DDD'])
  expect(await searchAllSymbols('$A')).toEqual(['$AAA', '$ABB', '$ACC'])
  expect(await searchAllSymbols('[')).toEqual([])
  expect(await searchAllSymbols('[[')).toEqual([])
  expect(await searchAllSymbols('A')).toEqual([])
  expect(await searchAllSymbols('AA')).toEqual([])
  expect(await searchAllSymbols('AB')).toEqual([])
  expect(await searchAllSymbols('a')).toEqual([])
  expect(await searchAllSymbols('g')).toEqual([])
  expect(await searchAllSymbols('ap')).toEqual([])
  expect(await searchAllSymbols('go')).toEqual([])
})
