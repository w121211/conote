import { Poll } from '@prisma/client'
import { mockUsers } from './mock-user'

export const mockPolls: Omit<
  Poll,
  'type' | 'status' | 'createdAt' | 'updatedAt'
>[] = [
  {
    id: 'mock-merge-poll-0',
    userId: mockUsers[0].id,
    choices: ['UP', 'DOWN'],
    meta: {},
  },
]
