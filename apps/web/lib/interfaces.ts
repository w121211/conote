import { NoteDoc, NoteDraft } from '@prisma/client'
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

export type NoteDocParsed = Omit<NoteDoc, 'meta' | 'content'> & {
  meta: NoteDocMeta
  content: NoteDocContent
}

export type NoteDocMeta = {
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
    publishedAt?: Date // when the webpage content publish at
    tickers?: string[] // tickers mentioned in the webpage content
  }
}

export type NoteDocContent = {
  discussIds: BlockUid_DiscussId[]
  symbols: Symbol_SymId[]
  diff?: any
  blocks: Block[]
}

export type NoteDraftParsed = Omit<NoteDraft, 'meta' | 'content'> & {
  meta: NoteDocMeta
  content: NoteDocContent
}
