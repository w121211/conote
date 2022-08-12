import { Poll, PollStatus, PollType } from '@prisma/client'
import { PollParsed } from '../../lib/interfaces'
import { MERGE_POLL_V1_0 } from '../../share/constants'
import { mockBotUser } from './user.mock'

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
  {
    ...mergePollBase,
    id: '1-merge_poll',
    createdAt: new Date(2022, 1, 1),
    updatedAt: new Date(2022, 1, 1),
  },
  {
    ...mergePollBase,
    id: '2-merge_poll',
    createdAt: new Date(2022, 1, 2),
    updatedAt: new Date(2022, 1, 2),
  },
]
