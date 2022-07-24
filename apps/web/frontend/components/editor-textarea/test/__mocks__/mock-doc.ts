import { nanoid } from 'nanoid'
import type { Doc } from '../../src/interfaces'
import {
  mockDocBlock_contentBlocks,
  mockDocBlockWithoutContent,
} from './mock-block'

const mockNoteDraftCopy: Doc['noteDraftCopy'] = {
  id: 'mockNoteDraftCopy',
  branchName: 'branchName',
  symbol: 'symbol',
  userId: 'userId',
  domain: 'domain',
  status: 'EDIT',
  updatedAt: 'updatedAt',
  meta: {
    __typename: 'NoteDraftMeta',
  },
  contentHead: {
    __typename: 'NoteDocContentHead',
  },
  contentBody: {
    __typename: 'NoteDocContentBody',
    // discussIds: [],
    // symbols: [],
    // blocks: [],
    blocks: mockDocBlock_contentBlocks.map(e => ({
      ...e,
      __typename: 'Block',
    })),
    blockDiff: [],
  },
}

const base: Omit<Doc, 'uid' | 'symbol' | 'blockUid'> = {
  noteCopy: null,
  noteDraftCopy: mockNoteDraftCopy,
  contentHead: {},
  contentBody: {
    blockDiff: [],
    // discussIds: [],
    // symbols: [],
  },
}

export const mockDocs: Doc[] = [
  {
    ...base,
    uid: nanoid(),
    blockUid: mockDocBlock_contentBlocks[0].uid,
    noteDraftCopy: {
      ...base.noteDraftCopy,
      symbol: mockDocBlock_contentBlocks[0].str,
    },
  },
  {
    ...base,
    uid: nanoid(),
    blockUid: mockDocBlockWithoutContent.uid,
    noteDraftCopy: {
      ...base.noteDraftCopy,
      symbol: mockDocBlockWithoutContent.str,
    },
  },
]
