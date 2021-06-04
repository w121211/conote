// TODO: 1. user一段時間內不能重複vote 2. oauther同一個來源、1個poll只能有1個vote
//
import { Vote } from '@prisma/client'
import prisma from '../prisma'

function _updateNVotes(nVotes: number[], choiceIdx: number): number[] {
  nVotes[choiceIdx] += 1
  return [...nVotes]
}

// function getChoice() {

// }

export async function createOauthorVote({
  choiceIdx,
  choiceText,
  pollId,
  oauthorName,
  userId,
}: {
  choiceIdx?: number
  choiceText?: string
  pollId: number
  oauthorName: string
  userId: string
}): Promise<Vote> {
  // 允許重複投票
  const poll = await prisma.poll.findUnique({ where: { id: pollId }, include: { count: true } })

  if (!poll || !poll.count) {
    throw new Error('Poll not found')
  }
  if (choiceText && poll.choices.indexOf(choiceText) < 0) {
    choiceIdx = poll.choices.indexOf(choiceText)
    throw new Error('poll中沒有這個vote choice')
  }
  if (choiceIdx === undefined || choiceIdx < 0 || choiceIdx >= poll.choices.length) {
    console.log(choiceIdx)
    console.log(poll.choices)
    throw new Error('Choice Index not valid')
  }

  const vote = await prisma.vote.create({
    data: {
      choiceIdx,
      user: { connect: { id: userId } },
      oauthor: { connect: { name: oauthorName } },
      poll: { connect: { id: poll.id } },
    },
  })

  await prisma.pollCount.update({
    data: { nVotes: _updateNVotes(poll.count.nVotes, choiceIdx) },
    where: { pollId },
  })

  return vote
}

export async function createVote({
  choiceIdx,
  pollId,
  userId,
}: {
  choiceIdx: number
  pollId: number
  userId: string
}): Promise<Vote> {
  // Naive vote: 不可重複vote、不可更新

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
    data: { nVotes: _updateNVotes(poll.count.nVotes, choiceIdx) },
    where: { pollId },
  })

  return vote
}
