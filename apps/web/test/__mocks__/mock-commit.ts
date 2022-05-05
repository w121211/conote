import { Commit } from '@prisma/client'
import { mockUsers } from './mock-user'

export const mockCommits: Commit[] = [
  {
    id: 'mock-commit-0',
    userId: mockUsers[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
