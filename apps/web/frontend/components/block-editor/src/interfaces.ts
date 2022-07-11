import type { Token } from 'prismjs'
import type {
  NoteDocContentBodyInput,
  NoteDocContentHeadInput,
} from 'graphql-let/__generated__/__types__'
import type {
  NoteDraftEntryFragment,
  NoteDraftFragment,
  NoteFragment,
  SearchHitFragment,
} from '../../../../apollo/query.graphql'

//
// Component State - commonly used in various components & handlers
//
//
//
//
//
//

export type CaretPosition = {
  top: number
  left: number
  height: number
}

export type DragTarget = 'first' | 'before' | 'after'

/**
 * athens naming:
 * - term -> query
 * - hit-index -> index
 * - hits -> results
 */
export type Search = {
  type: SearchType | null
  term: string | null
  hitIndex: number | null
  // hits: SearchHit[]
  hits: SearchHitFragment[]
}

// export type SearchHit = Omit<SearchHitFragment, '__typename'> & {
//   discussTitle?: string
//   note?: {
//     symbol: string
//     webpageTitle?: string
//   }
// }

export type SearchType = 'topic' | 'discuss' // | 'slash' | 'hashtag' | 'template'

//
// Events & Dom events
//
//
//
//
//
//

export type DestructTextareaKeyEvent = {
  value: string
  start: number
  end: number
  head: string
  tail: string
  selection: string
  key: string // keyboard key
  keyCode: number
  target: HTMLTextAreaElement
  shift: boolean
  meta: boolean
  ctrl: boolean
  alt: boolean
}

/**
 * A block's relative position, defined by a reference block / a doc
 *
 * @param refBlockUid ref-block uid
 * @param docTitle if ref-block is a doc, use doc-title instead of block-uid
 * @param relation position relate to ref-block
 */
export type BlockPosition = {
  refBlockUid?: string

  // TODO: Consider to remove?
  docTitle?: string

  relation: BlockPositionRelation
}

/**
 * parent-child relation: 'first' | 'last'
 * siblings relation: 'before' | 'after'
 */
export type BlockPositionRelation = 'first' | 'last' | 'before' | 'after'

//
// Stores
//
//
//
//
//
//

// export type NodeProps = {
//   db: {
//     id?: string
//   }
//   block: {
//     uid?: string
//     children?: { uid: string }[]
//   }
//   node: {
//     title?: string
//   }
//   page: {
//     sidebar?: false
//   }
// }

// export type NodeElProps = {
//   menu: {
//     show: boolean
//   }
//   title: {
//     initial?: string
//     local?: string
//   }
//   alert: {
//     show?: null
//     message?: null
//     confirmFn?: null
//     cancelFn?: null
//   }
//   // LinkedReferences: true
//   // UnlinkedReferences: false
//   node?: NodeProps
// }

export type Block = {
  uid: string

  // Null for doc-block
  parentUid: string | null
  childrenUids: string[]
  order: number

  // Doc block only, equals to doc.str
  docSymbol?: string

  str: string
  open?: boolean

  // TBC, consider to drop
  editTime?: number
}

export type BlockWithChildren = Block & { children: BlockWithChildren[] }

/**
 * In athensresearch, 'Doc' is named as 'Node' and 'Page',
 * alone with a concept of node-block (node-page-block), ndoe-title, page-title, page-block (or context-block)
 */
export type Doc = {
  // Client side only id, generate one when first open the doc
  uid: string

  // Should be unique most of time except when renaming
  symbol: string

  branch: string

  domain: string

  // Note-doc-content-head is editable and stores here
  contentHead: NoteDocContentHeadInput

  // Use 'input' instead of 'fragment' for updating the note-draft
  contentBody: Omit<NoteDocContentBodyInput, 'blocks'>

  // Refer to root-block-uid
  blockUid: string

  // The note & head-doc that used to create the draft, ie the from-doc
  noteCopy: Omit<NoteFragment, '__typename'> | null

  // The current saved note-draft
  noteDraftCopy: Omit<NoteDraftFragment, '__typename'>
}

/**
 *
 */
export type CursorProp = {
  cursor: {
    blockUid: string
    caretIndex: number
  } | null
}

/**
 * The final single stop to store all required info for the editor
 *
 * One browser window can only have one editor, an editor includes
 * - route
 * - one main-doc
 * - one modal-doc (optional)
 * - one sidebar
 *   - all editing draft-entries
 * - alert
 */
export type EditorProps = {
  alert: {
    show?: null
    message?: null
    confirmFn?: null
    cancelFn?: null
  }
  leftSidebar: {
    show: boolean
    droppedItems: NoteDraftEntryFragment[]
    editingItems: NoteDraftEntryFragment[]
  }
  modal: {
    discuss?: {
      id?: string
      title: string
    }
    doc?: {
      title: string
    }
    mainEditorCursor?: {
      blockUid: string
      anchor: number
      offset: number
    }
  }
  opening: {
    main: {
      symbol: string | null
      docUid: string | null
    }
    modal: {
      symbol: string | null
      docUid: string | null
    }

    // (Future) when open a block
    // blockUid?: string
  }

  // Experimental
  draftEntries: NoteDraftEntryFragment[]
  chains: NoteDraftEntryFragment[][]

  // Only allow to open one tab, so no need to be a list
  tab: {
    chain: {
      entry: NoteDraftEntryFragment
      docUid: string
    }[]
    // Modify by chainItemOpen event
    openDraftId: string | null
    //
    loading: boolean
  }
}

//
// Inline Items
//
//
//
//
//
//

export interface InlineBase {
  type: string
  str: string
  token: Token
}

export interface InlineText extends InlineBase {
  type: 'text'
}

// export type InlineAuthor = {
//   type: 'author'
//   str: string
//   authorName: string
// }

export interface InlineDiscuss extends InlineBase {
  type: 'inline-discuss'
  title: string
  id?: string
}

export interface InlineFiltertag extends InlineBase {
  type: 'inline-filtertag'
}

// export type InlineMirror = {
//   type: 'inline-mirror'
//   str: string
//   // symbolType: SymbolType
//   mirrorSymbol: string
//   author?: string // 需要 parse 取得，eg ::$XX @cnyes
// }

// export type InlineEmoji = {
//   type: 'emoji'
//   str: string
//   id: number
//   hashtag?: GQLHashtag
// }

// export type InlineNewHashtag = {
//   type: 'new-hashtag'
//   str: string
// }

export interface InlinePoll extends InlineBase {
  type: 'inline-poll'
  id?: string
  choices: string[]
  // pollCopy?: PollFragment
  // vote?: author vote
}

export interface InlineRate extends InlineBase {
  type: 'inline-rate'
  id?: string
  params: string[]
  // rateCopy?: RateFragment
  authorName?: string
  targetSymbol?: string
  // choice?: RateChoice
  // vote?: author vote
}

export interface InlineSymbol extends InlineBase {
  type: 'inline-symbol'
  // symbolType: SymbolType
  symbol: string
}

export interface InlineComment extends InlineBase {
  type: 'inline-comment'
}

export type InlineItem =
  | InlineText
  // | InlineAuthor
  | InlineDiscuss
  | InlineFiltertag
  // | InlineMirror
  // | InlineHashtag
  // | InlineNewHashtag
  | InlinePoll
  | InlineRate
  | InlineSymbol
  | InlineComment

function isInlinePoll(item: InlineItem): item is InlinePoll {
  return item.type === 'inline-poll'
}

function isInlineRate(item: InlineItem): item is InlineRate {
  return item.type === 'inline-rate'
}
