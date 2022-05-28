import { writeBlocks } from '../../components/block-editor/src/utils'
import {
  mockBlockInput,
  mockBlocks,
} from '../../components/block-editor/test/__mocks__/mock-block'
import { NoteDraftParsed } from '../../lib/interfaces'
import { mockBranches } from './mock-branch'
import { mockDiscusses } from './mock-discuss'
import { mockLinks } from './mock-link'
import { mockSyms } from './mock-sym'
import { mockUsers } from './mock-user'

const base: NoteDraftParsed = {
  id: '',
  branchId: mockBranches[0].id,
  symbol: '',
  userId: mockUsers[0].id,
  symId: null,
  commitId: null,
  fromDocId: null,
  linkId: null,
  status: 'EDIT',
  domain: 'domain0',
  contentHead: {},
  contentBody: {
    discussIds: [],
    symbols: [
      { symbol: '[[Google]]', symId: null },
      { symbol: '$BA', symId: null },
    ],
    blocks: writeBlocks(mockBlockInput, { docTitle: mockSyms[0].symbol }),
  },
  createdAt: new Date(),
  updatedAt: new Date(),
}

export const mockNoteDrafts: NoteDraftParsed[] = [
  {
    ...base,
    id: '0-from_empty',
    symbol: mockSyms[0].symbol,
    userId: mockUsers[0].id,
    contentBody: {
      discussIds: [],
      symbols: [
        { symbol: '[[Google]]', symId: null },
        { symbol: '$BA', symId: null },
      ],
      blocks: writeBlocks(mockBlockInput, { docTitle: mockSyms[0].symbol }),
    },
  },
  {
    ...base,
    id: '1-got_discusses',
    symbol: mockSyms[1].symbol,
    userId: mockUsers[1].id,
    contentBody: {
      discussIds: [
        { blockUid: 'uid-0', discussId: mockDiscusses[0].id },
        { blockUid: 'uid-1', discussId: mockDiscusses[1].id },
        { blockUid: 'uid-1', discussId: mockDiscusses[2].id },
      ],
      symbols: [],
      blocks: mockBlocks,
    },
  },
  {
    ...base,
    id: '2-got_from_doc',
    symbol: mockSyms[2].symbol,
    userId: mockUsers[2].id,
    fromDocId: 'testdoc0',
    contentBody: {
      discussIds: [],
      symbols: [],
      blocks: mockBlocks,
    },
  },
  {
    ...base,
    id: '3_got_discusses_with_commitId',
    symbol: mockSyms[1].symbol,
    userId: mockUsers[1].id,
    contentBody: {
      discussIds: [
        {
          blockUid: 'uid-0',
          discussId: mockDiscusses[0].id,
          commitId: 'commit-id-0',
        },
        { blockUid: 'uid-1', discussId: mockDiscusses[1].id },
        {
          blockUid: 'uid-1',
          discussId: mockDiscusses[2].id,
          commitId: 'commit-id-1',
        },
      ],
      symbols: [],
      blocks: mockBlocks,
    },
  },
  {
    ...base,
    id: '4-got-linkId',
    symbol: mockLinks[0].url,
    userId: mockUsers[1].id,
    linkId: mockLinks[0].id,
    contentBody: {
      discussIds: [],
      symbols: [],
      blocks: mockBlocks,
    },
  },
  {
    ...base,
    id: '5-some_more_for_draft_entry',
    symbol: '$AAPL',
    contentHead: {
      title: 'Apple Inc.',
    },
    contentBody: {
      discussIds: [],
      symbols: [],
      blocks: writeBlocks(mockBlockInput, { docTitle: '$AAPL' }),
    },
  },
  {
    ...base,
    id: '6-some_more_for_draft_entry',
    symbol: 'https://storybook.js.org/',
    contentHead: {
      title: 'Storybook: UI component explorer for frontend developers',
      webpage: {
        title: 'Storybook: UI component explorer for frontend developers',
      },
    },
    contentBody: {
      discussIds: [],
      symbols: [],
      blocks: writeBlocks(mockBlockInput, {
        docTitle: 'https://storybook.js.org/',
      }),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
