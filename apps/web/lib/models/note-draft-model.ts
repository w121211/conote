import { NoteDraft } from '@prisma/client'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import {
  NoteDocContentBody,
  NoteDocContentHead,
  NoteDraftParsed,
} from '../interfaces'
import prisma from '../prisma'
import { symModel } from './sym-model'

class NoteDraftModel {
  /**
   * throws if:
   * - has previous doc && no changes to previous doc
   *
   */
  checkDraftForCommit(draftId: NoteDraftParsed) {
    throw 'Not implemented'
  }

  /**
   * Throws
   * - [] If not made any changes compare to the from-doc
   */
  async validateCreateInput(
    branchName: string,
    symbol?: string,
    fromDocId?: string,
    linkId?: string,
  ) {
    // TODO: Validate the symbol
    const branch = await prisma.branch.findUnique({
      where: { name: branchName },
      select: { id: true },
    })
    const symbolParsed = symbol ? symModel.parse(symbol) : null
    const link = linkId
      ? await prisma.link.findUnique({ where: { id: linkId } })
      : null
    const fromDoc = fromDocId
      ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
      : null

    if (branch === null)
      throw new Error('[NoteDraftModel.createByLink] branch not found.')
    if (linkId && link === null)
      throw new Error('[NoteDraftModel.createByLink] link not found.')
    if (fromDocId && fromDoc === null)
      throw new Error('[NoteDraftModel.createByLink] fromDoc not found.')

    return {
      branch,
      fromDoc,
      link,
    }
  }

  /**
   * TODO
   * - [] Swap block-uid for new inserted blocks to prevent directly using the client generated uids
   */
  async create(
    branchName: string,
    symbol: string,
    userId: string,
    { fromDocId, domain, contentHead, contentBody }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const { branch, fromDoc } = await this.validateCreateInput(
        branchName,
        symbol,
        fromDocId ?? undefined,
      ),
      draft = await prisma.noteDraft.create({
        data: {
          symbol,
          branch: { connect: { id: branch.id } },
          sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
          fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
          user: { connect: { id: userId } },
          domain,
          // meta: meta as unknown as NoteDocMeta,
          contentHead,
          contentBody,
        },
      })
    return this.parse(draft)
  }

  async createByLink(
    branchName: string,
    linkId: string,
    userId: string,
    { fromDocId, domain, contentHead, contentBody }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const { branch, fromDoc, link } = await this.validateCreateInput(
      branchName,
      undefined,
      fromDocId ?? undefined,
      linkId,
    )

    if (link === null) throw new Error('[createByLink] link === null')

    const draft = await prisma.noteDraft.create({
      data: {
        symbol: link.url,
        branch: { connect: { id: branch.id } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        link: { connect: { id: linkId } },
        user: { connect: { id: userId } },
        domain,
        contentHead,
        contentBody,
      },
    })
    return this.parse(draft)
  }

  /**
   * Drop note-draft by updating its status to 'DROP'
   */
  async drop(id: string): Promise<NoteDraftParsed> {
    const draft = await prisma.noteDraft.update({
      data: { status: 'DROP' },
      where: { id },
    })
    return this.parse(draft)
  }

  /**
   * 'Save' the note-draft by updating its value
   * No needs to check the content here, check on commit
   */
  async update(
    draftId: string,
    { fromDocId, domain, contentHead, contentBody }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const draft = await prisma.noteDraft.findUnique({ where: { id: draftId } })
    if (draft === null) {
      throw new Error('NoteDraft not found.')
    }
    const draft_ = await prisma.noteDraft.update({
      data: {
        // TODO: Check
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        domain: domain,
        contentHead,
        contentBody,
      },
      where: { id: draftId },
    })
    return this.parse(draft_)
  }

  /**
   * TODO: validate meta, content
   */
  parse(draft: NoteDraft): NoteDraftParsed {
    return {
      ...draft,
      contentHead: draft.contentHead as unknown as NoteDocContentHead,
      contentBody: draft.contentBody as unknown as NoteDocContentBody,
    }
  }
}

export const noteDraftModel = new NoteDraftModel()
