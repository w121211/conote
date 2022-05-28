import { NoteDoc, NoteDraft, Poll, PollCount } from '@prisma/client'
import { Block } from '../components/block-editor/src/interfaces'

/**
 * Store (symbol-string, sym-id) to handle later symbol-string change case
 * symId can be null if not yet created (in draft)
 *
 * @example {symbol: '$GOOG', symId: '123'}
 *
 */
export type Symbol_SymId = {
  symbol: string
  symId: string | null
}

/**
 * Store each block's discussion id (if exist)
 * include commit-id for better tracking each discuss
 * if one block has multiple discussion-ids, store as two items
 *
 * [{blockUid: 'b1', discussId: 'd1'}, {blockUid: 'b1', discussId: 'd2'}]
 */
export type BlockUid_DiscussId = {
  blockUid: string
  discussId: string
  commitId?: string
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
    publishedAt?: number

    // tickers mentioned in the webpage content
    tickers?: string[]
  }
}

export type NoteDocContentBody = {
  discussIds: BlockUid_DiscussId[]
  symbols: Symbol_SymId[]
  diff?: any
  blocks: Omit<Block, 'childrenUids'>[]
}

export type NoteDraftParsed = Omit<NoteDraft, 'contentHead' | 'contentBody'> & {
  contentHead: NoteDocContentHead
  contentBody: NoteDocContentBody
}

export type PollMeta = {
  // Consider to include, eg 'merge_poll-v1'
  // spec?: string

  // Clase the poll after the given period
  openInDays: number
}

export type PollParsed = Omit<Poll & { count: PollCount }, 'meta'> & {
  meta: PollMeta
}
