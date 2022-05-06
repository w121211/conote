import { mockBlocks } from '../../components/block-editor/test/__mocks__/mock-block'
import { NoteDraftParsed } from '../../lib/interfaces'
import { mockDiscusses } from './mock-discuss'
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
      blocks: mockBlocks,
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
    id: 'mock-draft-2-from-doc',
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
    id: 'mock-draft-3_got-linkId',
    symbol: mockSyms[3].symbol,
    userId: mockUsers[1].id,

    fromDocId: null,
    linkId: mockSyms[3].id,

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
]
