import { NoteDraft } from '@prisma/client'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { NoteDocContent, NoteDocMeta, NoteDraftParsed } from '../interfaces'
import prisma from '../prisma'

class NoteDraftModel {
  async create(
    branch: string,
    symbol: string,
    userId: string,
    { fromDocId, domain, meta, content }: NoteDraftInput,
  ) {
    return prisma.noteDraft.create({
      data: {
        symbol: symbol,
        branch: { connect: { name: branch } },
        user: { connect: { id: userId } },
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        domain: domain,
        meta,
        content,
      },
    })
  }

  /**
   * TODO: validate meta, content
   */
  parse(draft: NoteDraft): NoteDraftParsed {
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
  }
}

export const noteDraftModel = new NoteDraftModel()
