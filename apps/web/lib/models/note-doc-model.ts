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
  symbolIdDict?: SymbolIdDict
  blocks: Block[]
}

/**
 * key: symbol
 * value: sym.id or null
 */
export type SymbolIdDict = Record<string, string | null>

class NoteDocModel {
  getDiscussIdsFromDraft(draft: NoteDraft): string[] {
    // get the meta in the draft
    const meta = draft.meta as unknown as NoteDocMeta
    // get the snippet for discussIds (need to know what the snippet looks like)
    return meta.blockUidAnddiscussIdsDict ? meta.blockUidAnddiscussIdsDict : []
  }

  async updateSymbolIdDict(
    doc: NoteDoc,
    incomingSymbols: SymbolIdDict,
  ): Promise<void> {
    const docContent = doc.content as unknown as NoteDocContent
    const symbolIdDict = docContent?.symbolIdDict ?? null

    for (const symbol in symbolIdDict) {
      if (symbol in incomingSymbols) {
        symbolIdDict[symbol] = incomingSymbols[symbol]
      }
    }
    const newContent = {
      diff: docContent.diff,
      symbolIdDict: symbolIdDict,
      blocks: docContent.blocks,
    }
    await prisma.noteDoc.update({
      where: { id: doc.id },
      data: { content: newContent },
    })
  }
}

export const noteDocModel = new NoteDocModel()
