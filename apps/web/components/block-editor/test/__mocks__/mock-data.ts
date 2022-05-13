import {
  Block,
  GQLNote,
  GQLNoteDraft,
  InlineDiscuss,
  SearchHit,
} from '../../src/interfaces'
import { writeBlocks } from '../../src/utils'
import { mockBlocks } from './mock-block'

//
// Mock note, note-draft
//
//
//
//
//
//

type MockQuerySymbolResult = {
  title: string
  note?: GQLNote
  draft?: GQLNoteDraft
}

// const mockBlocks: Block[] = [
//   {
//     uid: '8YKgEDhlUX',
//     str: '[[Hello Note]]',
//     docTitle: '[[Hello Note]]',
//     order: 0,
//     parentUid: null,
//     childrenUids: ['15aO4YfzgD'],
//   },
//   {
//     uid: '15aO4YfzgD',
//     str: 'a [[Hello Note]] child block',
//     order: 0,
//     parentUid: '8YKgEDhlUX',
//     childrenUids: [],
//   },
// ]

const mockDraftFromNoteBlocks: Block[] = [
  {
    uid: 'k1D353kSry',
    str: '[[Hello]]',
    docTitle: '[[Hello]]',
    order: 0,
    parentUid: null,
    childrenUids: ['6Y097lLu9g', 'St7fTuJyDG'],
  },
  {
    uid: '6Y097lLu9g',
    str: 'a [[Hello]] doc block',
    order: 0,
    parentUid: 'k1D353kSry',
    childrenUids: [],
  },
  {
    uid: 'St7fTuJyDG',
    str: 'a [[Hello Note]] draft block',
    order: 1,
    parentUid: 'k1D353kSry',
    childrenUids: [],
  },
]

const mockDraftFromNothingBlocks: Block[] = [
  {
    uid: 'cb2g_hLzPU',
    str: '[[Hello Draft]]',
    docTitle: '[[Hello Draft]]',
    order: 0,
    parentUid: null,
    childrenUids: ['drYi_YJ0pZ'],
  },
  {
    uid: 'drYi_YJ0pZ',
    str: 'a [[Hello Draft]] child block',
    order: 0,
    parentUid: 'cb2g_hLzPU',
    childrenUids: [],
  },
]

/**
 * Got nothing
 */
export const mockGotNothing: MockQuerySymbolResult = {
  title: '[[Got Nothing]]',
}

/**
 * Got note only
 */
export const mockGotNoteOnly: MockQuerySymbolResult = {
  title: '[[Got Note Only]]',
  note: {
    symbol: '[[Got Note Only]]',
    id: 'ttsZotJMy9',
    branch: 'playground',
    doc: {
      id: 'isy9ApWV0c',
      userId: 'nESCpMF5lg',
      noteMeta: {},
      content: writeBlocks([
        '[[Got Note Only]]',
        [
          'self -> [[Got Note Only]]',
          '[[Got Note And Draft]]',
          '[[Got Draft Only]]',
          '[[Got Nothing]]',
          ['child 3', ['child-child 1', 'child-child 2']],
        ],
      ]),
    },
  },
}

/**
 * Got draft only
 */
export const mockGotDraftOnly: MockQuerySymbolResult = {
  title: '[[Got Draft Only]]',
  draft: {
    id: '08xc91MX8v',
    // content: mockDraftFromNothingBlocks,
    content: writeBlocks([
      '[[Got Draft Only]]',
      [
        'self -> [[Got Draft Only]]',
        'child 2',
        ['child 3', ['child-child 1', 'child-child 2']],
      ],
    ]),
  },
}

/**
 * Got both note & draft
 */
const gotNoteAndDraftBlocks = writeBlocks([
  '[[Got Note And Draft]]',
  [
    'self -> [[Got Note And Draft]]',
    '[[Got Note Only]]',
    '[[Got Draft Only]]',
    ['child 3', ['child-child 1', 'child-child 2']],
  ],
])

export const mockGotNoteAndDraft: MockQuerySymbolResult = {
  title: '[[Got Note And Draft]]',
  note: {
    __typename: 'Note',
    id: 'ttsZotJMy9',
    branch: 'playground',
    updatedAt: '',
    sym: {
      __typename: 'Sym',
      id: '',
      type: 'TOPIC',
      symbol: '[[Got Note And Draft]]',
    },
    doc: {
      __typename: 'NoteDoc',
      id: 'isy9ApWV0c',
      commitId: 'string',
      fromDocId: undefined,
      userId: 'nESCpMF5lg',
      status: 'MERGE',
      domain: '',
      meta: {},
      content: {
        discussIds: [],
        diff: {},
        symbolIdDict: {},
        blocks: gotNoteAndDraftBlocks,
      },
      updatedAt: '',
    },
  },
  draft: {
    __typename: 'NoteDraft',
    id: 'afxAdVY2U',
    userId: '',
    updatedAt: '',
    status: 'EDIT',
    content: {
      discussIds: [],
      diff: {},
      symbolIdDict: {},
      blocks: gotNoteAndDraftBlocks,
    },
  },
}

export const mockMyAllDrafts: NoteDraft[] = [
  mockGotDraftOnly.draft,
  mockGotNoteAndDraft.draft,
].filter((e): e is NoteDraft => e !== undefined)

//
// Mock search hits
//
//
//
//
//
//

const searchHitSymbols: SearchHit[] = [
  { id: '3zRRf0i5iB', note: { symbol: 'Apple' } },
  { id: 'x6F8ffEA4z', note: { symbol: 'Banana' } },
  { id: 'Inz8albP1X', note: { symbol: 'Campfire' } },
  { id: 'Fm5HyxvyVe', note: { symbol: 'DOM' } },
  { id: 'ZM3Ffvg6EM', note: { symbol: 'Elephant' } },
]

export const mockSearchHit = {
  symbols: searchHitSymbols,
}

//
// Mock local doc
//
//
//
//
//
//

export const mockLocalDoc = {
  doc: {
    title: '[[Mock Local Doc]]',
    blockUid: mockBlocks[0].uid,
  },
  blocks: mockBlocks,
}

//
// Mock inline items
//
//
//
//
//
//

const inlineDiscussHasId: InlineDiscuss = {
  type: 'inline-discuss',
  str: 'string',
  title: 'string',
  id: 'string',
}

const inlineDiscussHasNoId: InlineDiscuss = {
  type: 'inline-discuss',
  str: 'string',
  title: 'string',
}

export const inlineItems = {
  inlineDiscussHasId,
  inlineDiscussHasNoId,
}

export const mockBlockStrDict = {
  // inline items
  symbolTitle: '[[React (web framework)]] in cljs',
  symbolTicker: 'Buy $GOOG is just on time',
  symbolUrl: '',
  symbolMix: '',

  discussHasId:
    '#Recommend tutorials/resources on [[Clojure]] for begginners?-u129038012983091#',
  discussHasNoId:
    '#Recommend tutorials/resources on [[Clojure]] for begginners?#',

  // Markdown
  h1: '',
  h2: '',
  h3: '',
  bold: '',

  // Mix markdown and inline items
  mixHAndSymbol: '',
}
