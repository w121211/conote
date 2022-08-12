import type { Note } from '@prisma/client'
import type { NoteFragment } from '../../apollo/query.graphql'
import { mockBranches } from './branch.mock'
import { mockNotes } from './note.mock'
import { mockSyms } from './sym.mock'

function toNoteFragment(
  note: Omit<Note, 'linkId'>,
): Omit<NoteFragment, 'headDoc'> {
  const { branchId, symId, updatedAt, ...rest } = note,
    branch = mockBranches.find(e => e.id === branchId),
    sym = mockSyms.find(e => e.id === symId)

  if (branch === undefined || sym === undefined)
    throw new Error('Mock branch or symbol not found')

  return {
    branchName: branch.name,
    sym,
    updatedAt: updatedAt.toISOString(),
    ...rest,
  }
}

export const mockNoteFragments: Omit<NoteFragment, 'headDoc'>[] = mockNotes.map(
  e => toNoteFragment(e),
)
