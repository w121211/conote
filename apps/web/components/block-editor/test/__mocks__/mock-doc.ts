import { Doc } from '../../src/interfaces'
import {
  mockDocBlockAndContentBlocks,
  mockDocBlockHasNoContent,
} from './mock-block'

const base = {
  branch: 'branch',
  domain: 'domain',
  meta: {},
}

export const mockDocs: Doc[] = [
  {
    ...base,
    title: mockDocBlockAndContentBlocks[0].str,
    blockUid: mockDocBlockAndContentBlocks[0].uid,
  },
  {
    ...base,
    title: mockDocBlockHasNoContent.str,
    blockUid: mockDocBlockHasNoContent.uid,
  },
]
