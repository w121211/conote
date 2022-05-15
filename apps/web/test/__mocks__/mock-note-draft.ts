import { writeBlocks } from '../../components/block-editor/src/utils'
import {
  mockBlockInput,
  mockBlocks,
} from '../../components/block-editor/test/__mocks__/mock-block'
import { NoteDraftParsed } from '../../lib/interfaces'
import { mockDiscusses } from './mock-discuss'
import { mockLinks } from './mock-link'
import { mockSyms } from './mock-sym'
import { mockUsers } from './mock-user'

export const mockNoteDrafts: Omit<
  NoteDraftParsed,
  'symId' | 'branchId' | 'commitId'
>[] = [
  {
    id: 'mock-draft-0_from-empty',
    symbol: mockSyms[0].symbol,
    userId: mockUsers[0].id,
    fromDocId: null,
    linkId: null,
    status: 'EDIT',
    domain: 'domain0',
    meta: {},
    content: {
      discussIds: [],
      symbols: [
        { symbol: '[[Google]]', symId: null },
        { symbol: '$BA', symId: null },
      ],
      blocks: writeBlocks(mockBlockInput, { docTitle: mockSyms[0].symbol }),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-1_got-discusses',
    symbol: mockSyms[1].symbol,
    userId: mockUsers[1].id,
    fromDocId: null,
    linkId: null,
    status: 'EDIT',
    domain: 'domain0',
    meta: {},
    content: {
      discussIds: [
        { blockUid: 'uid-0', discussId: mockDiscusses[0].id },
        { blockUid: 'uid-1', discussId: mockDiscusses[1].id },
        { blockUid: 'uid-1', discussId: mockDiscusses[2].id },
      ],
      symbols: [],
      blocks: mockBlocks,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-2_got-from-doc',
    symbol: mockSyms[2].symbol,
    userId: mockUsers[2].id,
    fromDocId: 'testdoc0',
    linkId: null,
    status: 'EDIT',
    domain: 'domain1',
    meta: {},
    content: {
      discussIds: [],
      symbols: [],
      blocks: mockBlocks,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-3_got-discusses-with-commitId',
    symbol: mockSyms[1].symbol,
    userId: mockUsers[1].id,
    fromDocId: null,
    linkId: null,
    status: 'EDIT',
    domain: 'domain0',
    meta: {},
    content: {
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
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-4_got-linkId',
    symbol: mockLinks[0].url,
    userId: mockUsers[1].id,
    fromDocId: null,
    linkId: mockLinks[0].id,
    status: 'EDIT',
    domain: 'domain0',
    meta: {},
    content: {
      discussIds: [],
      symbols: [],
      blocks: mockBlocks,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-5_more-for-draft-entry',
    symbol: '$AAPL',
    userId: mockUsers[0].id,
    fromDocId: null,
    linkId: null,
    status: 'EDIT',
    domain: 'domain0',
    meta: {
      title: 'Apple Inc.',
    },
    content: {
      discussIds: [],
      symbols: [],
      blocks: writeBlocks(mockBlockInput, { docTitle: '$AAPL' }),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'mock-draft-6_more-for-draft-entry',
    symbol: 'https://storybook.js.org/',
    userId: mockUsers[0].id,
    fromDocId: null,
    linkId: null,
    status: 'EDIT',
    domain: 'domain0',
    meta: {
      title: 'Storybook: UI component explorer for frontend developers',
      webpage: {
        title: 'Storybook: UI component explorer for frontend developers',
      },
    },
    content: {
      discussIds: [],
      symbols: [],
      blocks: mockBlocks,
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
