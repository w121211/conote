import { Poll, PollStatus, PollType } from '@prisma/client'
import { PollParsed } from '../../lib/interfaces'
import { MERGE_POLL_V1_0 } from '../../share/constants'
import { mockBotUser } from './mock-user'

const mergePollBase: Omit<PollParsed<Poll>, 'count'> = {
  id: '',
  discussId: null,
  userId: mockBotUser.id,
  type: PollType.FIXED,
  status: PollStatus.OPEN,
  meta: { openInDays: 5 },
  choices: MERGE_POLL_V1_0.codes.map(e => e[0]),
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockMergePolls: Omit<PollParsed<Poll>, 'count'>[] = [
  {
    ...mergePollBase,
    id: '0-merge_poll',
  },
]
