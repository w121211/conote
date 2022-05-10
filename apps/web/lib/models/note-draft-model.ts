import { NoteDraft, SymType } from '@prisma/client'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { NoteDocContent, NoteDocMeta, NoteDraftParsed } from '../interfaces'
import prisma from '../prisma'
import { symModel } from './sym-model'

class NoteDraftModel {
  async validateCreateInput(
    branch: string,
    symbol?: string,
    fromDocId?: string,
    linkId?: string,
  ) {
    // TODO: validate the symbol
    const prismaBranch = await prisma.branch.findUnique({
      where: { name: branch },
      select: { id: true },
    })
    const symbolParsed = symbol ? symModel.parse(symbol) : null
    const link = linkId
      ? await prisma.link.findUnique({ where: { id: linkId } })
      : null
    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null

    if (prismaBranch === null) {
      throw new Error('[NoteDraftModel.createByLink] branch not found.')
    }
    if (linkId && link === null) {
      throw new Error('[NoteDraftModel.createByLink] link not found.')
    }
    if (fromDocId && fromDoc === null) {
      throw new Error('[NoteDraftModel.createByLink] fromDoc not found.')
    }
    return {
      prismaBranch,
      fromDoc,
      link,
    }
  }
  async create(
    branch: string,
    symbol: string,
    userId: string,
    { fromDocId, domain, meta, content }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const { prismaBranch, fromDoc } = await this.validateCreateInput(
      branch,
      symbol,
      fromDocId ?? undefined,
    )

    const draft = await prisma.noteDraft.create({
      data: {
        symbol,
        branch: { connect: { id: prismaBranch.id } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        user: { connect: { id: userId } },
        domain,
        meta: meta as unknown as NoteDocMeta,
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

  async createByLink(
    branch: string,
    linkId: string,
    userId: string,
    { fromDocId, domain, meta, content }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const { prismaBranch, fromDoc, link } = await this.validateCreateInput(
      branch,
      undefined,
      fromDocId ?? undefined,
      linkId,
    )

    const draft = await prisma.noteDraft.create({
      data: {
        symbol: link!.url,
        branch: { connect: { id: prismaBranch.id } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        link: { connect: { id: linkId } },
        user: { connect: { id: userId } },
        domain,
        meta: meta as unknown as NoteDocMeta,
        content,
      },
    })
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDocMeta,
      content: draft.meta as unknown as NoteDocContent,
    }
  }

  async update(
    draftId: string,
    { fromDocId, domain, meta, content }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const draft = await prisma.noteDraft.findUnique({ where: { id: draftId } })
    if (draft === null) {
      throw new Error('NoteDraft not found.')
    }

    const updatedDraft = await prisma.noteDraft.update({
      data: {
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        domain: domain,
        meta: meta as unknown as NoteDocMeta,
        content,
      },
      where: { id: draftId },
    })
    return {
      ...updatedDraft,
      meta: updatedDraft.meta as unknown as NoteDocMeta,
      content: updatedDraft.content as unknown as NoteDocContent,
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
