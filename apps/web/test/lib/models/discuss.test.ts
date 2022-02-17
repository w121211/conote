import prisma from '../../../lib/prisma'
import { clean, TESTUSERS } from '../../test-helpers'

const tempCardId = 'a-temp-card-id'

beforeAll(async () => {
  await prisma.card.upsert({
    create: {
      id: tempCardId,
      sym: { create: { type: 'TICKER', symbol: 'TEMP' } },
    },
    update: {},
    where: { id: tempCardId },
  })
})

it('', async () => {
  const discuss = await prisma.discuss.create({
    data: {
      user: { connect: { id: TESTUSERS[0].id } },
      //   cards: cardId ? { connect: [{ id: cardId }] } : undefined,
      // cards: undefined,
      cards: { connect: [{ id: tempCardId }] },
      meta: {},
      title: 'this is a title',
      content: undefined,
      // choices: data.choices,
      count: { create: {} },
    },
    include: { count: true },
  })
})
