import { Doc } from '../../src/interfaces'
import {
  mockDocBlock_contentBlocks,
  mockDocBlockWithoutContent,
} from './mock-block'

const base = {
  branch: 'branch',
  domain: 'domain',
  contentHead: {},
}

export const mockDocs: Doc[] = [
  {
    ...base,
    title: mockDocBlock_contentBlocks[0].str,
    blockUid: mockDocBlock_contentBlocks[0].uid,
  },
  {
    ...base,
    title: mockDocBlockWithoutContent.str,
    blockUid: mockDocBlockWithoutContent.uid,
  },
]
