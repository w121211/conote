import { NoteDoc } from '@prisma/client'
import { mockDocBlock_contentBlocks } from '../../components/block-editor/test/__mocks__/mock-block'
import { mockDiffBlocks } from '../../components/block-editor/test/__mocks__/mock-diff-blocks'
import { NoteDocContentBody, NoteDocParsed } from '../../lib/interfaces'
import { mockBranches } from './mock-branch'
import { mockCommits } from './mock-commit'
import { mockNoteDrafts } from './mock-note-draft'
import { mockMergePolls } from './mock-poll'
import { mockSyms } from './mock-sym'
import { mockUsers } from './mock-user'

const contentBody: NoteDocContentBody = {
  discussIds: [],
  symbols: [
    { symbol: mockSyms[0].symbol, symId: mockSyms[0].id },
    { symbol: mockSyms[1].symbol, symId: mockSyms[1].id },
    { symbol: mockSyms[2].symbol, symId: mockSyms[2].id },
  ],
  blocks: mockDocBlock_contentBlocks,
}

const base: NoteDocParsed<NoteDoc> = {
  id: '',
  branchId: mockBranches[0].id,
  symId: mockSyms[0].id,
  commitId: mockCommits[0].id,
  fromDocId: null,
  mergePollId: null,
  userId: mockUsers[0].id,
  status: 'CANDIDATE',
  domain: 'domain0',
  meta: {
    mergeState: 'before_merge',
  },
  contentHead: {},
  contentBody,
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockNoteDocs: NoteDocParsed<NoteDoc>[] = [
  {
    ...base,
    id: '0-candidate_initial_commit',
    status: 'CANDIDATE',
    contentHead: mockNoteDrafts[0].contentHead,
    contentBody: mockNoteDrafts[0].contentBody,
    userId: mockNoteDrafts[0].userId,
  },
  {
    ...base,
    id: '1-rejected',
    symId: mockSyms[1].id,
    status: 'REJECTED',
    meta: {
      mergeState: 'rejected_auto-no_changes',
    },
  },
  {
    ...base,
    id: '2-merged_by_poll',
    symId: mockSyms[2].id,
    status: 'MERGED',
    mergePollId: mockMergePolls[0].id,
    meta: {
      mergeState: 'merged_poll',
    },
    contentBody: {
      ...contentBody,
      blocks: mockDiffBlocks.initial,
    },
  },
  // {
  //   ...base,
  //   id: '3-candidate_got_from_doc__diff_no_changes',
  //   status: 'CANDIDATE',
  //   fromDocId: '2-merged_by_poll',
  //   contentBody: {
  //     ...contentBody,
  //     blocks: mockDiffBlocks.initial,
  //   },
  // },
]
