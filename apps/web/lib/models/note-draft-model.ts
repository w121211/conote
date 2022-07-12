import type { Branch, NoteDoc, NoteDraft } from '@prisma/client'
import type {
  NoteDraft as GQLNoteDraft,
  NoteDraftInput,
  NoteDraftMetaInput,
} from 'graphql-let/__generated__/__types__'
import {
  parseBlockValues,
  parseGQLContentBodyInput,
} from '../../share/block.common'
import { toStringProps } from '../helpers'
import type {
  NoteDocContentBody,
  NoteDocContentHead,
  NoteDraftMeta,
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
  checkDraftForCommit(draftId: NoteDraftParsed<NoteDraft>) {
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
        throw new Error('[validateCreateInput] symbol type is not TOPIC')
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

    if (symbol === undefined && linkId === undefined)
      throw new Error(
        '[validateCreateInput] Param require either symbol or linkId.',
      )
    if (branch === null)
      throw new Error('[validateCreateInput] Branch not found.')
    if (fromDocId && fromDocId !== headDoc?.id)
      throw new Error('[validateCreateInput] From-doc is not the head-doc.')
    if (sym && fromDocId === undefined)
      throw new Error(
        '[validateCreateInput] Sym is found but not has from-doc.',
      )
    if (linkId && link === null)
      throw new Error('[validateCreateInput] Link not found.')
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
   * - [] Swap block-uid for new inserted blocks to prevent directly using the client generated uids -> do this when creating the doc
   */
  async create(
    branchName: string,
    symbol: string,
    userId: string,
    data: NoteDraftInput,
  ): Promise<GQLNoteDraft> {
    const {
        fromDocId,
        domain,
        contentHead,
        contentBody: contentBodyInput,
      } = data,
      { branch, fromDoc } = await this.validateCreateInput(
        branchName,
        symbol,
        fromDocId ?? undefined,
      ),
      contentBody = parseGQLContentBodyInput(symbol, contentBodyInput)

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
      include: { branch: true },
    })
    return this.toGQLNoteDraft(draft)
  }

  async createByLink(
    branchName: string,
    linkId: string,
    userId: string,
    { fromDocId, domain, contentHead, contentBody }: NoteDraftInput,
  ): Promise<GQLNoteDraft> {
    const { branch, fromDoc, link } = await this.validateCreateInput(
        branchName,
        undefined,
        fromDocId ?? undefined,
        linkId,
      ),
      draft =
        link &&
        (await prisma.noteDraft.create({
          data: {
            symbol: `[[${link.url}]]`,
            branch: { connect: { id: branch.id } },
            sym: fromDoc ? { connect: { id: fromDoc.symId } } : undefined,
            fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
            link: { connect: { id: link.id } },
            user: { connect: { id: userId } },
            domain,
            contentHead,
            contentBody,
          },
          include: { branch: true },
        }))

    if (draft) {
      return this.toGQLNoteDraft(draft)
    }
    throw new Error()
  }

  /**
   * Drop note-draft by updating its status to 'DROP'
   */
  async drop(id: string): Promise<GQLNoteDraft> {
    const draft = await prisma.noteDraft.update({
      data: { status: 'DROP' },
      where: { id },
      include: { branch: true },
    })
    return this.toGQLNoteDraft(draft)
  }

  /**
   * Save the note-draft by updating its value
   * No needs to check the content here, check on commit
   *
   * Symbol update logic:
   * - Only 'topic' symbols are modifiable, not 'url', 'ticker' symbols
   * - If the draft has from-doc, then not allow to update the draft.symbol here,
   *   and only stores the updated symbol in the content-head.
   *   The symbol will get updated when the merge is accepted, this will also update the sym's symbol.
   * - If the symbol is existed in database, allow to modify but require to fix before merging
   * - Else, update the draft's symbol
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
  ): Promise<GQLNoteDraft> {
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
        throw new Error('Only topic symbol is allowed to modify')
      if (draft.sym !== null)
        throw new Error(
          'Sym existed in database, not allow to modify the symbol directly',
        )
    }

    const contentBody = newSymbol
      ? parseGQLContentBodyInput(newSymbol, contentBodyInput)
      : parseGQLContentBodyInput(draft.symbol, contentBodyInput)

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
      include: { branch: true },
    })
    return this.toGQLNoteDraft(draft_)
  }

  /**
   * Parse shallow
   */
  parse<T extends NoteDraft>(draft: T): NoteDraftParsed<T> {
    return {
      ...draft,
      meta: draft.meta as unknown as NoteDraftMeta,
      contentHead: draft.contentHead as unknown as NoteDocContentHead,
      contentBody: draft.contentBody as unknown as NoteDocContentBody,
    }
  }

  /**
   * TODO: validate content head, content body
   */
  parseReal<T extends NoteDraft>(draft: T): NoteDraftParsed<T> {
    const draft_ = this.parse(draft),
      { discussIds } = parseBlockValues(draft_.contentBody.blocks)

    return {
      ...draft,
      meta: draft.meta as unknown as NoteDraftMeta,
      contentHead: draft.contentHead as unknown as NoteDocContentHead,
      contentBody: {
        ...draft_.contentBody,
        discussIds,
      },
    }
  }

  /**
   * Parse using block values, used before commit
   */
  toMeta(input?: NoteDraftMetaInput): NoteDraftMeta {
    return {
      chain: input
        ? {
            prevId: input.chainPrevId ?? null,
          }
        : undefined,
    }
  }

  toGQLNoteDraft(draft: NoteDraft & { branch: Branch | null }): GQLNoteDraft {
    if (draft.branch === null) throw new Error('draft.branch ==== null')
    const draft_ = {
      ...this.parse(draft),
      branchName: draft.branch.name,
    }
    return toStringProps(draft_)
  }
}

export const noteDraftModel = new NoteDraftModel()
