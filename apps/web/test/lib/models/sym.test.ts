/**
 * yarn run test-lib sym.test
 */
/* eslint-disable no-await-in-loop */
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { Card, PrismaClient } from '@prisma/client'
// import { getOrCreateCardBySymbol, getOrCreateCardByLink, CardMeta } from '../card'
import { FetchClient } from '../../../lib/fetcher/fetcher'
import { CardModel } from '../../../lib/models/card-model'
import prisma from '../../../lib/prisma'
import { clean } from '../../test-helpers'
import { SymModel } from '../../../lib/models/sym-model'

it('SymModel.getAll()', async () => {
  const symbols = await SymModel.getAll()
  expect(symbols.map(e => e.symbol)).toEqual([
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
