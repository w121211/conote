import type { Branch, NoteDoc, Sym } from '@prisma/client'
import { writeBlocks } from '../../components/block-editor/src/utils/block-writer'
import {
  mockBlockInputs,
  mockBlocks,
} from '../../components/block-editor/test/__mocks__/mock-block'
import type { NoteDocParsed, NoteDraftParsed } from '../../lib/interfaces'
import { mockBranches } from './mock-branch'
import { mockDiscusses } from './mock-discuss'
import { mockLinks } from './mock-link'
import { mockSyms } from './mock-sym'
import { mockUsers } from './mock-user'

const base: Omit<NoteDraftParsed, 'createdAt' | 'updatedAt'> = {
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
  meta: {},
  contentHead: {},
  contentBody: {
    discussIds: [],
    symbols: [
      { symbol: '[[Google]]', symId: null },
      { symbol: '$BA', symId: null },
    ],
    blocks: writeBlocks(mockBlockInputs[0], { docSymbol: mockSyms[0].symbol }),
  },
}

const mockDiscusses_ = mockDiscusses('')

export const mockNoteDrafts: Omit<
  NoteDraftParsed,
  'createdAt' | 'updatedAt'
>[] = [
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
      blocks: writeBlocks(mockBlockInputs[0], {
        docSymbol: mockSyms[0].symbol,
      }),
    },
  },
  {
    ...base,
    id: '1-got_discusses',
    symbol: mockSyms[1].symbol,
    userId: mockUsers[1].id,
    contentBody: {
      discussIds: [
        { blockUid: 'uid-0', discussId: mockDiscusses_[0].id },
        { blockUid: 'uid-1', discussId: mockDiscusses_[1].id },
        { blockUid: 'uid-1', discussId: mockDiscusses_[2].id },
      ],
      symbols: [],
      blocks: writeBlocks(mockBlockInputs[0], {
        docSymbol: mockSyms[1].symbol,
      }),
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
      blocks: writeBlocks(mockBlockInputs[0], {
        docSymbol: mockSyms[2].symbol,
      }),
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
          discussId: mockDiscusses_[0].id,
          commitId: 'commit-id-0',
        },
        { blockUid: 'uid-1', discussId: mockDiscusses_[1].id },
        {
          blockUid: 'uid-1',
          discussId: mockDiscusses_[2].id,
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
]

export function mockNoteDrafts_gotFromDoc(
  userId: string,
  fromDoc: NoteDocParsed<NoteDoc & { sym: Sym; branch: Branch }>,
): Omit<NoteDraftParsed, 'createdAt' | 'updatedAt'>[] {
  const { id, branchId, symId, sym, domain, contentHead, contentBody } =
      fromDoc,
    base: Omit<NoteDraftParsed, 'createdAt' | 'updatedAt'> = {
      id: '',
      branchId,
      symId,
      symbol: sym.symbol,
      userId: '',
      commitId: null,
      fromDocId: id,
      linkId: null,
      status: 'EDIT',
      domain: domain,
      xmeta: {},
      contentHead,
      contentBody: {
        ...contentBody,
        blocks: writeBlocks(mockBlockInputs[1], {
          docSymbol: fromDoc.sym.symbol,
        }),
      },
    }

  return [
    {
      ...base,
      id: '90-from_doc_modify_and_create_poll',
      userId,
    },
    // { ...base, id: '91-from_doc_insert_only_and_merged', userId: mockUsers[4].id },
    // { ...base, id: '92-from_doc_add_discuss', userId: mockUsers[4].id },
    // { ...base, id: '93-from_doc_insert_only', userId: mockUsers[4].id },
  ]
}
