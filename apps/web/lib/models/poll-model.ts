import { Poll, PollCount } from '@prisma/client'
import { hasCount } from '../helpers'
import prisma from '../prisma'

export type PollMeta = {
  text?: string
  code?: 'buysell'
}

export async function createPoll({
  choices,
  meta,
  userId,
}: {
  choices: string[]
  meta?: PollMeta
  userId: string
}): Promise<Poll & { count: PollCount }> {
  const poll = await prisma.poll.create({
    data: {
      user: { connect: { id: userId } },
      meta,
      choices,
      count: { create: {} },
    },
    include: { count: true },
  })
  if (hasCount(poll)) {
    return poll
  }
  throw 'Prisma internal error'
}
