import { PollVote } from '@prisma/client'
import prisma from '../prisma'

/**
 * Get next n-votes by current choices-idx
 */
function updateNVotes(
  nVotes: number[],
  choiceIdx: number,
  nChoices: number,
): number[] {
  if (nVotes.length === 0) {
    nVotes = [...Array(nChoices).keys()].map(e => 0)
  }
  nVotes[choiceIdx] += 1
  return [...nVotes]
}

// export async function createAuthorVote({
//   choiceIdx,
//   choiceText,
//   pollId,
//   authorName,
//   userId,
// }: {
//   choiceIdx?: number
//   choiceText?: string
//   pollId: string
//   authorName: string
//   userId: string
// }): Promise<Vote> {
//   const poll = await prisma.poll.findUnique({
//     where: { id: pollId },
//     include: { count: true },
//   })
//   if (!poll || !poll.count) {
//     throw new Error('Poll not found')
//   }
//   if (choiceText && poll.choices.indexOf(choiceText) < 0) {
//     choiceIdx = poll.choices.indexOf(choiceText)
//     throw new Error('Poll的choices中沒有這個vote choice')
//   }
//   if (
//     choiceIdx === undefined ||
//     choiceIdx < 0 ||
//     choiceIdx >= poll.choices.length
//   ) {
//     console.error(choiceIdx, poll.choices)
//     throw new Error('Choice index not valid')
//   }
//   const vote = await prisma.vote.create({
//     data: {
//       choiceIdx,
//       user: { connect: { id: userId } },
//       poll: { connect: { id: poll.id } },
//     },
//   })
//   await prisma.pollCount.update({
//     data: {
//       nVotes: _updateNVotes(poll.count.nVotes, choiceIdx, poll.choices.length),
//     },
//     where: { pollId },
//   })
//   return vote
// }

async function validateBeforeCreate(
  pollId: string,
  choiceIdx: number,
  userId: string,
) {
  const prevVote = await prisma.pollVote.findFirst({
    where: { userId, pollId },
  })
  if (prevVote) throw new Error('User has voted')

  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: { count: true },
  })

  if (poll === null) throw new Error('Poll not found')
  if (poll.userId === userId) throw new Error('Owner cannot vote self poll')
  if (poll.count === null) throw new Error('poll.count === null')
  if (poll.status !== 'OPEN') throw new Error('poll.status !== OPEN')
  if (choiceIdx < 0 || choiceIdx >= poll.choices.length)
    throw new Error('Choice index is out of range')

  return { poll, count: poll.count }
}

/**
 * TODO:
 * - [] (Bug) If call in parellel, the count result may be wrong
 * - [] (?) User cannot vote to the same poll in a certain period of time
 */
class PollVoteModel {
  /**
   * Create a basic vote, cannot vote more than once for the same poll, cannot update the vote
   */
  async create(
    pollId: string,
    choiceIdx: number,
    userId: string,
  ): Promise<PollVote> {
    const { poll, count } = await validateBeforeCreate(
      pollId,
      choiceIdx,
      userId,
    )
    const vote = await prisma.pollVote.create({
      data: {
        choiceIdx,
        user: { connect: { id: userId } },
        poll: { connect: { id: poll.id } },
      },
    })

    // TODO: (Bug) If call in parellel, the count result may be wrong
    const count_ = await prisma.pollCount.update({
      data: {
        nVotes: updateNVotes(count.nVotes, choiceIdx, poll.choices.length),
      },
      where: { pollId },
    })

    // console.debug(choiceIdx, pollId, userId, count)

    return vote
  }
}

export const pollVoteModel = new PollVoteModel()
