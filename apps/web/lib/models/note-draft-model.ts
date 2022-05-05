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
    const { fromDocId, domain, meta, content } = draftInput
    // TODO: access branchId from context
    const branchId = ''
    const { type } = SymModel.parse(symbol)
    if (type === SymType.URL) {
      throw new Error('createNoteDraft not allow to create from url')
    }
    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null
    if (fromDocId && fromDoc === null) {
      throw new Error('[createNoteDraft] fromDocId && fromDoc === null')
    }
    const draft = await prisma.noteDraft.create({
      data: {
        symbol,
        branch: { connect: { id: branchId } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDoc ? { connect: { id: fromDoc.id } } : undefined,
        user: { connect: { id: userId } },
        domain,
        meta,
        content,
      },
    })
    // convert JSON to GQL type
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
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
