/**
 * Modified from note-state-model.ts
 */
import { NoteDoc, NoteDraft, Sym } from '@prisma/client'
import prisma from '../prisma'
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

export const NoteDocModel = {
  getDiscussIdsFromDraft(draft: NoteDraft): string[] {
    // get the meta in the draft
    const meta = draft.meta as unknown as NoteDocMeta
    // get the snippet for discussIds (need to know what the snippet looks like)
    return meta.blockUidAnddiscussIdsDict ? meta.blockUidAnddiscussIdsDict : []
  },

  async updateSymIdMap(docs: NoteDoc[], symbolIds: Map<string, string>): Promise<void> {
    if (symbolIds.size === 0) return
    const docContentDicts = docs.map(e => ({
      id: e.id,
      content: e.content as unknown as NoteDocContent,
    }))
    for (const e of docContentDicts) {
      const { symbolIdMap } = e.content
      if (symbolIdMap) {
        for (const symbol in symbolIdMap) {
          if (symbolIds.has(symbol)) {
            symbolIdMap[symbol] = symbolIds.get(symbol) ?? ''
          }
        }
      }
      const newContent = { ...e, symbolIdMap }
      await prisma.noteDoc.update({ where: { id: e.id }, data: { content: newContent } })
    }
  },
}
