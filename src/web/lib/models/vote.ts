// TODO: 1. user一段時間內不能重複vote 2. oauther同一個來源、1個poll只能有1個vote
import { Vote } from '@prisma/client'
import prisma from '../prisma'

function _updateNVotes(nVotes: number[], choiceIdx: number, nChoices: number): number[] {
  // 新創的poll是一個空的array，需要修改
  if (nVotes.length === 0) {
    nVotes = [...Array(nChoices).keys()].map(e => 0)
  }

  nVotes[choiceIdx] += 1
  return [...nVotes]
}

// function getChoice() {
// }

export async function createAuthorVote({
  choiceIdx,
  choiceText,
  pollId,
  authorName,
  userId,
}: {
  choiceIdx?: number
  choiceText?: string
  pollId: string
  authorName: string
  userId: string
}): Promise<Vote> {
  // 允許重複投票
  const poll = await prisma.poll.findUnique({ where: { id: pollId }, include: { count: true } })
  if (!poll || !poll.count) {
    throw new Error('Poll not found')
  }
  if (choiceText && poll.choices.indexOf(choiceText) < 0) {
    choiceIdx = poll.choices.indexOf(choiceText)
    throw new Error('Poll的choices中沒有這個vote choice')
  }
  if (choiceIdx === undefined || choiceIdx < 0 || choiceIdx >= poll.choices.length) {
    console.error(choiceIdx, poll.choices)
    throw new Error('Choice index not valid')
  }

  const vote = await prisma.vote.create({
    data: {
      choiceIdx,
      user: { connect: { id: userId } },
      author: { connect: { name: authorName } },
      poll: { connect: { id: poll.id } },
    },
  })
  await prisma.pollCount.update({
    data: { nVotes: _updateNVotes(poll.count.nVotes, choiceIdx, poll.choices.length) },
    where: { pollId },
  })

  return vote
}

/**
 * Naive vote: 不可重複vote、不可更新
 */
export async function createVote({
  choiceIdx,
  pollId,
  userId,
}: {
  choiceIdx: number
  pollId: string
  userId: string
}): Promise<Vote> {
  // TODO:
  const prevVote = await prisma.vote.findFirst({ where: { userId, pollId } })
  if (prevVote) throw new Error('User has voted')

  const poll = await prisma.poll.findUnique({ where: { id: pollId }, include: { count: true } })
  if (!poll || !poll.count) throw new Error('Poll not found')
  if (choiceIdx < 0 || choiceIdx >= poll.choices.length) throw new Error('Choice index not valid')

  const vote = await prisma.vote.create({
    data: {
      choiceIdx,
      user: { connect: { id: userId } },
      poll: { connect: { id: poll.id } },
    },
  })

  await prisma.pollCount.update({
    data: { nVotes: _updateNVotes(poll.count.nVotes, choiceIdx, poll.choices.length) },
    where: { pollId },
  })

  return vote
}
