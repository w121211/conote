import { nanoid } from 'nanoid'
import type { Doc } from '../../src/interfaces'
import {
  mockDocBlock_contentBlocks,
  mockDocBlockWithoutContent,
} from './mock-block'

const mockNoteDraftCopy: Doc['noteDraftCopy'] = {
  id: 'mockNoteDraftCopy',
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
    discussIds: [],
    symbols: [],
    blocks: [],
    blockDiff: [],
  },
}

const base: Omit<Doc, 'uid' | 'symbol' | 'blockUid'> = {
  branch: 'default',
  domain: 'domain',
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
    symbol: mockDocBlock_contentBlocks[0].str,
    blockUid: mockDocBlock_contentBlocks[0].uid,
  },
  {
    ...base,
    uid: nanoid(),
    symbol: mockDocBlockWithoutContent.str,
    blockUid: mockDocBlockWithoutContent.uid,
  },
]
