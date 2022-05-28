import { Poll, PollStatus, PollType } from '@prisma/client'
import { PollMeta, PollParsed } from '../../lib/interfaces'
import { mockBotUser } from './mock-user'

const mergePollBase: Omit<PollParsed, 'count'> = {
  id: '',
  discussId: null,
  userId: mockBotUser.id,
  type: PollType.FIXED,
  status: PollStatus.OPEN,
  meta: { openInDays: 5 },
  choices: ['accpet', 'reject-abuse', 'reject-hateful', 'reject-others'],
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockMergePolls: Omit<PollParsed, 'count'>[] = [
  {
    ...mergePollBase,
    id: '0-merge_poll',
  },
  {
    ...mergePollBase,
    id: '1-merge_poll__another',
  },
]
