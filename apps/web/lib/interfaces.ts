import type { TreeNodeChange } from '@conote/docdiff'
import type {
  Link,
  NoteDoc,
  NoteDraft,
  Poll,
  PollCount,
  SymType,
} from '@prisma/client'
import type { Block } from '../frontend/components/block-editor/src/interfaces'

//
// Data models
//
//
//
//
//
//

export type CommitInputErrorItem = {
  draftId: string
  msg: string
}

export type DiscussMeta = {
  // The note that create this discuss
  noteCreated: { id: string; symbol: string }

  // The notes that connect to the discuss
  notesConntected: { id: string; symbol: string }[]
}

export type LinkParsed = Omit<Link, 'scraped'> & {
  scraped: LinkScrapedResult
}

export type LinkScrapedResult = {
  domain: string
  finalUrl: string
  srcId?: string
  srcType: 'video' | 'post' | 'author' | 'other'

  // metascraper
  authorId?: string
  authorName?: string
  date?: string
  description?: string
  lang?: string
  title?: string

  // ./packages/scraper
  keywords?: string[]
  tickers?: string[]
  error?: string
}

export type NoteDocParsed<T extends NoteDoc> = Omit<
  T,
  'meta' | 'contentHead' | 'contentBody'
> & {
  meta: NoteDocMeta
  contentHead: NoteDocContentHead
  contentBody: NoteDocContentBody
}

export type NoteDocMeta = {
  mergeState: NoteDocMetaMergeState
}

export type NoteDocMetaMergeState =
  // Not apply the merge yet, happens when doc is just created
  | 'before_merge'
  // A merge poll is open and waiting to merge by poll
  | 'wait_to_merge-by_poll'
  | 'merged_auto-same_user'
  | 'merged_auto-initial_commit'
  | 'merged_auto-only_insertions'
  | 'merged_poll'
  | 'rejected_auto-no_changes'
  | 'rejected_poll'
  // Merge poll is paused because the from-doc is not the current's head
  | 'paused-from_doc_not_head'

export type NoteDocContentHead = {
  // If provided, use it to update the current note's symbol when merged
  symbol?: string

  // Use for ticker, webpage symbols to display a title aside with symbol
  title?: string

  // to store Sym.symbols refering to the same note (e.g $BA, [[Boeing]] both to Boeing)
  duplicatedSymbols?: string[]

  // note keywords
  keywords?: string[]

  // used when duplicate symbol exists
  redirectFroms?: string[]
  redirectTo?: string

  // fields of webpage is not allowed to change
  webpage?: {
    authors?: string[]
    title?: string

    // when the webpage content publish at
    publishedAt?: string

    // tickers mentioned in the webpage content
    tickers?: string[]
  }
}

/**
 * Store each block's discussion id (if exist)
 * include commit-id for better tracking each discuss
 * if one block has multiple discussion-ids, store as two items
 *
 * [{blockUid: 'b1', discussId: 'd1'}, {blockUid: 'b1', discussId: 'd2'}]
 */
type BlockUid_DiscussId = {
  blockUid: string
  discussId: string
  commitId?: string
}

/**
 * Store (symbol-string, sym-id) to handle later symbol-string change case
 * symId can be null if not yet created (in draft)
 *
 * @example {symbol: '$GOOG', symId: '123'}
 *
 */
type Symbol_SymId = {
  symbol: string
  symId: string | null
}

export type NoteDocContentBody = {
  //
  discussIds: BlockUid_DiscussId[]

  //
  symbols: Symbol_SymId[]

  blocks: Omit<Block, 'childrenUids'>[]

  // Experimental
  blockDiff: TreeNodeChange[]
}

export type NoteDraftMeta = {
  // Join note drafts as a chain
  chain?: {
    prevId: string | null
  }
}

export type NoteDraftParsed = Omit<
  NoteDraft,
  'meta' | 'contentHead' | 'contentBody'
> & {
  meta: NoteDraftMeta
  contentHead: NoteDocContentHead
  contentBody: NoteDocContentBody
}

export type PollMeta = {
  // Consider to include, eg 'merge_poll-v1'
  spec?: string

  // Clase the poll after the given period
  openInDays: number
}

export type PollParsed<T extends Poll> = Omit<
  T & { count: PollCount },
  'meta'
> & {
  meta: PollMeta
}

/**
 * Symbol types and its format:
 * - Ticker, start with '$', capital letter or number, eg $AB, $A01
 * - Topic, a title enclosed by `[[...]]`, eg [[what ever]], [[中文範例]]
 * - URL, a valide http url start with 'http://' or 'https://', eg [[https://github.com/typescript-eslint]]
 */
export type SymbolParsed = {
  type: SymType
  symbol: string
  url?: string
}
