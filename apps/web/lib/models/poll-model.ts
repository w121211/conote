import type { NoteDoc, Poll, PollCount } from '@prisma/client'
import { hasCount } from '../helpers'
import { PollMeta, PollParsed } from '../interfaces'
import prisma from '../prisma'

const defaultPollMeta: PollMeta = {
  openInDays: 180,
}

export class PollModel {
  async create({
    userId,
    choices,
    meta,
    noteDocToMerge,
  }: {
    userId: string
    choices: string[]
    meta?: PollMeta
    noteDocToMerge?: NoteDoc
  }): Promise<PollParsed<Poll>> {
    const poll = await prisma.poll.create({
      data: {
        user: { connect: { id: userId } },
        meta: meta ?? defaultPollMeta,
        choices,
        count: { create: { nVotes: choices.map(_ => 0) } },
        noteDocToMerge: noteDocToMerge
          ? { connect: { id: noteDocToMerge.id } }
          : undefined,
      },
      include: { count: true },
    })
    return this.parse(poll)
  }

  async find(id: string) {
    const poll = await prisma.poll.findUnique({
      include: {
        count: true,
        noteDocToMerge: { include: { branch: true, sym: true } },
      },
      where: { id },
    })
    if (poll) {
      console.debug(poll)
      return this.parse(poll)
    }
    return null
  }

  parse<T extends Poll & { count: PollCount | null }>(poll: T): PollParsed<T> {
    if (hasCount(poll)) {
      return {
        ...poll,
        // TODO
        meta: poll.meta as unknown as PollMeta,
      }
    }
    throw new Error('[parse] Poll has no count')
  }
}

export const pollModel = new PollModel()
