/**
 * Modified from note-state-model.ts
 */
import { NoteDraft } from '@prisma/client'
export type NoteDocMeta = {
  duplicatedSymbols?: string[] // to store Sym.symbols refering to the same note (e.g $BA, [[Boeing]] both to Boeing)
  blockUidAnddiscussIdsDict?: string[] // store discussion ids
  keywords?: string[] // note keywords
  redirectFroms?: string[] // used when duplicate symbol exists
  redirectTo?: string
  // fields of webpage is not allowed to change
  webpage?: {
    authors?: string[]
    title?: string
    publishedAt?: Date // when the webpage content publish at
    tickers?: string[] // tickers mentioned in the webpage content
  }
}

export type Block = {
  uid: string
  str: string
  parentUid?: string
  docTitle?: string
}

export type NoteDocContent = {
  diff?: any
  symbolIdMap?: Record<string, string>
  blocks: Block[]
}

export type PrismaNoteDocMeta = {}

export const NoteDocModel = {
  async getIdsFromDraft(draftMeta: NoteDocMeta): Promise<string[]> {},
}
