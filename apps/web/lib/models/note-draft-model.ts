import { NoteDraft, PrismaPromise, SymType } from '@prisma/client'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { NoteDocContent, NoteDocMeta, NoteDraftParsed } from '../interfaces'
import prisma from '../prisma'
import { LinkService } from './link-model'
import { SymModel } from './sym-model'

class NoteDraftModel {
  async create(
    branch: string,
    symbol: string,
    userId: string,
    { fromDocId, domain, meta, content }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    // const { fromDocId, domain, meta, content } = draftInput
    // TODO: access branchId from context
    const prismaBranch = await prisma.branch.findUnique({
      where: { name: branch },
      select: { id: true },
    })
    if (prismaBranch === null) {
      throw new Error('[createNoteDraft] branch does not exist')
    }

    const { type } = SymModel.parse(symbol)
    // if its type is url, get or create link after checking
    const linkParsed =
      type === SymType.URL ? LinkService.getOrCreateLink({ url: symbol }) : null
    // if (type === SymType.URL) {
    //   const link = LinkService.getOrCreateLink({ url: symbol })
    // }
    // if (type === SymType.TICKER)

    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null

    if (fromDocId && fromDoc === null) {
      throw new Error('[createNoteDraft] fromDocId && fromDoc === null')
    }

    const draft = await prisma.noteDraft.create({
      data: {
        symbol,
        branch: { connect: { id: prismaBranch.id } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
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
  }

  async drop(id: string): Promise<NoteDraftParsed> {
    const draft = await prisma.noteDraft.update({
      data: { status: 'DROP' },
      where: { id },
    })
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.content as unknown as NoteDocContent,
    }
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
