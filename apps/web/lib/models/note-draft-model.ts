import { NoteDraft } from '@prisma/client'
import { NoteDraftInput } from 'graphql-let/__generated__/__types__'
import { parseGQLContentBody } from '../../shared/block-helpers'
import {
  NoteDocContentBody,
  NoteDocContentHead,
  NoteDraftParsed,
} from '../interfaces'
import prisma from '../prisma'
import { noteDocModel } from './note-doc-model'
import { symModel } from './sym-model'

/**
 *
 */
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
   * - If symbol has wrong format
   * - If sym is found but not has from-doc (because sym is created along with note-doc)
   * - [] If not made any changes compare to the from-doc
   *
   */
  async validateCreateInput(
    branchName: string,
    symbol?: string,
    fromDocId?: string,
    linkId?: string,
  ) {
    if (symbol) {
      const symbol_ = symModel.parse(symbol)
      if (symbol_.type !== 'TOPIC')
        throw new Error('[updateSymbol] symbol_.type !== TOPIC')
    }

    const branch = await prisma.branch.findUnique({
        where: { name: branchName },
      }),
      sym = symbol && (await prisma.sym.findUnique({ where: { symbol } })),
      headDoc =
        branch && sym ? await noteDocModel.getHeadDoc(branch.id, sym.id) : null,
      link = linkId
        ? await prisma.link.findUnique({ where: { id: linkId } })
        : null

    // const fromDoc = fromDocId
    //   ? await prisma.noteDoc.findUnique({ where: { id: fromDocId } })
    //   : null

    if (branch === null)
      throw new Error('[NoteDraftModel.createByLink] Branch not found.')
    if (fromDocId && fromDocId !== headDoc?.id)
      throw new Error(
        '[NoteDraftModel.createByLink] From-doc is not the head-doc.',
      )
    if (sym && fromDocId === undefined)
      throw new Error(
        '[NoteDraftModel.createByLink] Sym is found but not has from-doc.',
      )
    if (linkId && link === null)
      throw new Error('[NoteDraftModel.createByLink] Link not found.')
    // if (fromDocId && fromDoc === null)
    //   throw new Error('[NoteDraftModel.createByLink] From-doc not found.')

    return {
      branch,
      fromDoc: headDoc,
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
    {
      fromDocId,
      domain,
      contentHead,
      contentBody: contentBodyInput,
    }: NoteDraftInput,
  ): Promise<NoteDraftParsed> {
    const { branch, fromDoc } = await this.validateCreateInput(
        branchName,
        symbol,
        fromDocId ?? undefined,
      ),
      contentBody = parseGQLContentBody(symbol, contentBodyInput)

    const draft = await prisma.noteDraft.create({
      data: {
        symbol,
        branch: { connect: { id: branch.id } },
        sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        user: { connect: { id: userId } },
        domain,
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
   *
   * @param newSymbol Only allow to update the symbol if sym is not connected
   */
  async update(
    draftId: string,
    userId: string,
    {
      fromDocId,
      domain,
      contentHead,
      contentBody: contentBodyInput,
    }: NoteDraftInput,
    newSymbol?: string,
  ): Promise<NoteDraftParsed> {
    const draft = await prisma.noteDraft.findUnique({
      where: { id: draftId },
      include: { sym: true },
    })

    if (draft === null) throw new Error('NoteDraft not found.')
    if (draft.userId !== userId)
      throw new Error('User is not the owner, cannot update')
    if (newSymbol) {
      const newSymbol_ = symModel.parse(newSymbol)
      if (newSymbol_.type !== 'TOPIC')
        throw new Error('newSymbol_.type !== TOPIC')
      if (draft.sym !== null)
        throw new Error('Not allow to modify draft symbol if it has sym')
    }

    // if (newSymbol) {
    //   validateContentBody(newSymbol, contentBody)
    // } else {
    //   validateContentBody(draft.symbol, contentBody)
    // }

    const contentBody = newSymbol
      ? parseGQLContentBody(newSymbol, contentBodyInput)
      : parseGQLContentBody(draft.symbol, contentBodyInput)

    const draft_ = await prisma.noteDraft.update({
      data: {
        // TODO: Check
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        domain: domain,
        contentHead,
        contentBody,
        symbol: newSymbol,
      },
      where: { id: draftId },
    })
    return this.parse(draft_)
  }

  /**
   * TODO: validate content head, content body
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
