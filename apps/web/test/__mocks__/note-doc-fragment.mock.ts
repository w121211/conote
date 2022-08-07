import type { NoteDoc } from '@prisma/client'
import type { NoteDocFragment } from '../../apollo/query.graphql'
import type { NoteDocParsed } from '../../lib/interfaces'
import { mockBranches } from './branch.mock'
import { mockNoteDocs } from './note-doc.mock'
import { mockSyms } from './sym.mock'

function toNoteDocFragment(noteDoc: NoteDocParsed<NoteDoc>): NoteDocFragment {
  const { branchId, symId, updatedAt, ...rest } = noteDoc,
    branch = mockBranches.find(e => e.id === branchId),
    sym = mockSyms.find(e => e.id === symId)

  if (branch === undefined || sym === undefined)
    throw new Error('Mock branch or symbol not found')

  return {
    branchName: branch.name,
    symbol: sym.symbol,
    updatedAt: updatedAt.toISOString(),
    ...rest,
  }
}

export const mockNoteDocFragments = mockNoteDocs.map(e => toNoteDocFragment(e))
