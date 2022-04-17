import {
  Block,
  Doc,
  InlineDiscuss,
  Note,
  NoteDraft,
  SearchHit,
} from '../../src/interfaces'

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
  note?: Note
  draft?: NoteDraft
}

const mockBlocks: Block[] = [
  {
    uid: '8YKgEDhlUX',
    str: '[[Hello Note]]',
    docTitle: '[[Hello Note]]',
    order: 0,
    parentUid: null,
    childrenUids: ['15aO4YfzgD'],
  },
  {
    uid: '15aO4YfzgD',
    str: 'a [[Hello Note]] child block',
    order: 0,
    parentUid: '8YKgEDhlUX',
    childrenUids: [],
  },
]

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
  title: '[[Hello Note]]',
  note: {
    symbol: '[[Hello Note]]',
    id: 'ttsZotJMy9',
    branch: 'playground',
    doc: {
      id: 'isy9ApWV0c',
      userId: 'nESCpMF5lg',
      noteMeta: {},
      content: mockBlocks,
    },
  },
}

/**
 * Got draft only
 */
export const mockGotDraftOnly: MockQuerySymbolResult = {
  title: '[[Hello Draft]]',
  draft: {
    id: '08xc91MX8v',
    content: mockDraftFromNothingBlocks,
  },
}

/**
 * Got both note & draft
 */
export const mockGotNoteAndDraft: MockQuerySymbolResult = {
  title: '[[Hello]]',
  note: {
    symbol: '[[Hello]]',
    id: 'ttsZotJMy9',
    branch: 'playground',
    doc: {
      id: 'isy9ApWV0c',
      userId: 'nESCpMF5lg',
      noteMeta: {},
      content: mockDraftFromNoteBlocks.slice(0, 2),
    },
  },
  draft: {
    id: 'afxAdVY2U',
    content: mockDraftFromNoteBlocks,
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
    blockUid: 'Nu9RRlYtUm',
  },
  blocks: [
    {
      uid: 'Nu9RRlYtUm',
      docTitle: '[[Mock Local Doc]]',
      parentUid: null,
      order: 0,
      childrenUids: ['v3HRC2gEyq'],
      str: '[[Mock Local Doc]]',
    },
    {
      uid: 'v3HRC2gEyq',
      parentUid: 'Nu9RRlYtUm',
      order: 0,
      childrenUids: [],
      str: 'child block [[Hello world]]',
    },
  ],
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
