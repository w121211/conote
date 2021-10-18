import { Poll, PollCount } from '.prisma/client'
import { hasCount } from '../helpers'
import prisma from '../prisma'
import { getBotId } from './user'

export type PollMeta = {
  text?: string
  code?: 'buysell'
}

export async function createPoll({
  choices,
  meta,
  userId,
  cardId,
}: {
  choices: string[]
  meta?: PollMeta
  userId: string
  cardId?: string
}): Promise<Poll & { count: PollCount }> {
  if (cardId && userId !== (await getBotId())) {
    throw 'Poll connecting with a card require bot permission'
  }
  const poll = await prisma.poll.create({
    data: {
      user: { connect: { id: userId } },
      meta,
      choices,
      count: { create: {} },
      card: cardId ? { connect: { id: cardId } } : undefined,
    },
    include: { count: true },
  })
  if (hasCount(poll)) {
    return poll
  }
  throw 'Prisma internal error'
}
