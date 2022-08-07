import type { Note } from '@prisma/client'
import { mockBranches } from './branch.mock'
import { mockSyms } from './sym.mock'

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
  {
    id: '3',
    symId: mockSyms[3].id,
    branchId: mockBranches[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    symId: mockSyms[4].id,
    branchId: mockBranches[0].id,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
