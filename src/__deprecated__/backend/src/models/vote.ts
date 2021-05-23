import * as PA from '@prisma/client'
import { prisma } from '../context'

export async function createVote(poll: PA.Poll, choice: string, userId: string, oauthorName: string): Promise<PA.Vote> {
  // TODO: 1. user一段時間內不能重複vote 2. oauther同一個來源、1個poll只能有1個vote

  // Validation
  const choiceIdx = poll.choices.indexOf(choice)
  if (choiceIdx < 0) throw new Error('poll中沒有這個vote choice')

  return await prisma.vote.create({
    data: {
      choiceIdx,
      user: { connect: { id: userId } },
      oauthor: { connect: { name: oauthorName } },
      poll: { connect: { id: poll.id } },
    },
  })
}
