/* eslint-disable no-await-in-loop */
import { resolve } from 'path'
import { PrismaClient } from '@prisma/client'
// import { getOrCreateLink } from '../link'
// import { getOrCreateCardBySymbol, getOrCreateCardByLink, CardMeta } from '../card'
import { NodeChange, TreeChangeService, TreeNode } from '../../../../packages/docdiff/src'
import { CommitInput as GQLCommitInput } from '../../../apollo/type-defs.graphqls'
// import {
//   BulletInput,
//   CardTemplateParams,
//   createCard,
//   createCardBody,
//   replaceBulletInput,
//   runBulletInputOp,
//   templateTicker,
// } from '../card'
import prisma from '../../prisma'
import { clean, createTestUsers, TESTUSERS, TESTAUTHORS, omitDeep } from '../../test-helper'
import { FetchClient } from '../../fetcher/fetcher'
import { CommitService } from '../commit'
// import { symbolToUrl, SYMBOL_DOMAIN } from '../symbol'

type Bullet = {
  id?: string
  cid: string
  head: string
}

const bt = (cid: number, children: TreeNode<Bullet>[] = []): TreeNode<Bullet> => {
  return {
    cid: cid.toString(),
    data: { cid: cid.toString(), head: `${cid}${cid}${cid}` },
    children,
  }
}

const startValue: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2)]
const finalValue: TreeNode<Bullet>[] = [bt(1, [bt(3), bt(4)]), bt(2), bt(5)]

let fetcher: FetchClient
// let card: Card

beforeAll(async () => {
  console.log('Writing required data into database')
  const _prisma = new PrismaClient()
  await createTestUsers(_prisma)
  // card = await _prisma.card.create({
  //   data: {
  //     type: CardType.TICKER,
  //     name: params.name,
  //     link: {
  //       create: {
  //         url: symbolToUrl(params.name),
  //         domain: SYMBOL_DOMAIN,
  //         srcType: SrcType.OTHER,
  //       },
  //     },
  //   },
  // })
  await _prisma.$disconnect()

  console.log('Setting up a fetch-client')
  fetcher = new FetchClient(resolve(__dirname, 'local-cache.dump.json'))
})

afterAll(async () => {
  fetcher.dump()
  await prisma.$disconnect()
})

// test('_generateIds()', () => {
// CommitService._generateIds()
// })

test('create commit: card-state has card-input', () => {
  const commitInput: GQLCommitInput = {
    cardStateInputs: [
      {
        prevStateId: null,
        symbol: '$AA',
        subSymbols: [],
        // changes: TreeChangeService.getChnages(finalValue, startValue),
        changes: [],
        finalValue: finalValue,
        cardInput: { symbol: '$AA', type: 'TICKER' },
      },
    ],
  }
  CommitService.create(commitInput, TESTUSERS[0].id)
})

test('create commit: multi card-state', () => {
  const commitInput: GQLCommitInput = {
    cardStateInputs: [
      {
        prevStateId: null,
        symbol: '$AA',
        subSymbols: ['$BB', '$CC'],
        // changes: TreeChangeService.getChnages(finalValue, startValue),
        changes: [],
        finalValue: finalValue,
        cardInput: { symbol: '$AA', type: 'TICKER' },
      },
      {
        prevStateId: null,
        symbol: '$BB',
        subSymbols: [],
        // changes: TreeChangeService.getChnages(finalValue, startValue),
        changes: [],
        finalValue: finalValue,
        cardInput: { symbol: '$BB', type: 'TICKER' },
      },
      {
        prevStateId: null,
        symbol: '$CC',
        subSymbols: [],
        // changes: TreeChangeService.getChnages(finalValue, startValue),
        changes: [],
        finalValue: finalValue,
        cardInput: { symbol: '$CC', type: 'TICKER' },
      },
    ],
  }
  CommitService.create(commitInput, TESTUSERS[0].id)
})

// test('create commit from prev commit', () => {
// })

// test('replaceBulletInput()', () => {
//   expect(clean(replaceBulletInput(templateTicker.body, params))).toMatchSnapshot()
// })

// test('runBulletInputOp()', async () => {
//   const root0 = await runBulletInputOp({
//     cardId: card.id,
//     input: input0,
//     // prevDict,
//     timestamp: 111111111,
//     userId: TESTUSERS[0].id,
//   })
//   expect(clean(root0)).toMatchSnapshot()
// })

// test('createCardBody()', async () => {
//   const body0 = await createCardBody({ cardId: card.id, bulletInputRoot: input0 }, TESTUSERS[0].id)
//   expect(clean({ ...body0, content: omitDeep(JSON.parse(body0.content), ['timestamp']) })).toMatchSnapshot()

//   const input1: BulletInput = {
//     id: 6,
//     head: '111+++',
//     body: '111-111+++',
//     op: 'update',
//     children: [
//       { id: 7, head: '222', body: '222-222', op: 'delete' },
//       {
//         id: 8,
//         head: '333',
//         children: [{ id: 9, head: '444' }],
//       },
//       { id: 10, head: '555', op: 'move' },
//       { head: '666', op: 'create' },
//     ],
//   }

//   const body1 = await createCardBody({ cardId: card.id, bulletInputRoot: input1 }, TESTUSERS[1].id)
//   console.log(body1)
//   expect(clean({ ...body1, content: omitDeep(JSON.parse(body1.content), ['timestamp']) })).toMatchSnapshot()
// })

// test('createCard()', async () => {
//   const { card, body } = await createCard({ name: '$BBB', template: templateTicker, title: 'BBB Company' })
//   expect(clean(card)).toMatchSnapshot()
//   expect(clean({ ...body, content: omitDeep(JSON.parse(body.content), ['timestamp']) })).toMatchSnapshot()
// })
