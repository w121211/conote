import { nanoid } from 'nanoid'
import { Doc } from '../../src/interfaces'
import {
  mockDocBlock_contentBlocks,
  mockDocBlockWithoutContent,
} from './mock-block'

const base: Omit<Doc, 'uid' | 'symbol' | 'blockUid'> = {
  branch: 'default',
  domain: 'domain',
  contentHead: {},
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
