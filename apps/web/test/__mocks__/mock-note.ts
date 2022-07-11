import type { Note } from '@prisma/client'
import { mockBranches } from './mock-branch'
import { mockSyms } from './mock-sym'

export const mockNotes: Omit<Note, 'linkId'>[] = [
  {
    id: '0',
    symId: mockSyms[0].id,
    branchId: mockBranches[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '1',
    symId: mockSyms[1].id,
    branchId: mockBranches[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    symId: mockSyms[2].id,
    branchId: mockBranches[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
