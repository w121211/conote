import { NoteDoc } from '@prisma/client'
import { mockBlocks } from '../../components/block-editor/test/__mocks__/mock-block'
import {
  NoteDocContent,
  NoteDocMeta,
  NoteDocParsed,
} from '../../lib/interfaces'
import { mockBranches } from './mock-branch'
import { mockCommits } from './mock-commit'
import { mockPolls } from './mock-poll'
import { mockSyms } from './mock-sym'
import { mockUsers } from './mock-user'

const base = {
  branchId: mockBranches[0].id,
  symId: mockSyms[0].id,
  commitId: mockCommits[0].id,
  fromDocId: null,
  mergePollId: mockPolls[0].id,
  userId: mockUsers[0].id,
  domain: 'domain0',
  meta: {},
  content: {
    blockUid_discussIds: {},
    symbol_symId: { '[[Google]]': null, $BA: null },
    blocks: mockBlocks,
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockNoteDocs: NoteDocParsed[] = [
  {
    ...base,
    id: 'mock-doc-0_candidate',
    status: 'CANDIDATE',
    meta: base.meta as unknown as NoteDocMeta,
    content: base.content as unknown as NoteDocContent,
  },
  {
    ...base,
    id: 'mock-doc-1_merge',
    status: 'MERGE',
    meta: base.meta as unknown as NoteDocMeta,
    content: base.content as unknown as NoteDocContent,
  },
  {
    ...base,
    id: 'mock-doc-2_reject',
    status: 'REJECT',
    meta: base.meta as unknown as NoteDocMeta,
    content: base.content as unknown as NoteDocContent,
  },
]
