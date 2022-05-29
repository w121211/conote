import { Branch, NoteDoc, PrismaPromise } from '@prisma/client'
import {
  NoteDocContentBody,
  NoteDocContentHead,
  NoteDocMeta,
  NoteDocParsed,
  NoteDraftParsed,
} from '../interfaces'
import prisma from '../prisma'

export class NoteDocModel {
  /**
   * For all discuss-ids whose commit-id is undefined, set its commit-id
   * For all symbols whose sym-id is null, try to find sym-id in the incoming symbols
   */
  _updateContentBodyProps(
    contentBody: NoteDocContentBody,
    commitId: string,
    incomingSymbolsDict: Record<string, string>,
  ): NoteDocContentBody {
    const { discussIds, symbols } = contentBody,
      discussIds_ = discussIds.map(e => {
        return e.commitId ? e : { ...e, commitId }
      }),
      symbols_ = symbols.map(e => {
        if (e.symId === null && incomingSymbolsDict[e.symbol]) {
          return {
            ...e,
            symId: incomingSymbolsDict[e.symbol],
          }
        }
        return e
      })

    return {
      ...contentBody,
      discussIds: discussIds_,
      symbols: symbols_,
    }
  }

  /**
   * If has from-doc, is doc and from-doc both point to the same note
   * Is content head valid?
   * Is content body valid? Include a valide tree
   */
  _validateOnCreate() {
    // TODO
  }

  /**
   * TODO: validate on create
   *
   * @param incomingSymbolsDict { [symbol]: sym-id } dict
   */
  create(
    draft: NoteDraftParsed,
    commitId: string,
    symId: string,
    userId: string,
    incomingSymbolsDict: Record<string, string>,
  ): PrismaPromise<NoteDoc> {
    const { branchId, fromDocId, domain, contentHead, contentBody } = draft,
      contentBody_ = this._updateContentBodyProps(
        contentBody,
        commitId,
        incomingSymbolsDict,
      ),
      meta: NoteDocMeta = {
        mergeState: 'before_merge',
      },
      doc = prisma.noteDoc.create({
        data: {
          branch: { connect: { id: branchId } },
          sym: { connect: { id: symId } },
          commit: { connect: { id: commitId } },
          fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,

          // TODO: Create only when the doc is not auto merged
          // mergePoll: { connect: { id: poll.id } },

          user: { connect: { id: userId } },
          note: {
            connect: {
              branchId_symId: {
                branchId,
                symId: symId,
              },
            },
          },
          meta,
          domain,
          contentHead,
          contentBody: contentBody_,
        },
      })
    return doc
  }

  /**
   *
   */
  async getCandidates(doc: NoteDoc) {
    const { symId, branchId } = doc,
      docs = await prisma.noteDoc.findMany({
        where: {
          AND: [{ note: { symId, branchId } }, { status: 'CANDIDATE' }],
        },
        orderBy: { createdAt: 'asc' },
        include: { branch: true },
      })
    return docs.map(e => noteDocModel.parse(e))
  }

  /**
   * Get the head-doc of the note, hdad-note-doc is the same as the latest merged note-doc
   *
   */
  async getHeadDoc(branchId: string, symId: string) {
    const doc = await prisma.noteDoc.findFirst({
      where: { branchId, symId, status: 'MERGED' },
      orderBy: { updatedAt: 'desc' },
      include: { branch: true },
    })
    if (doc) {
      return this.parse(doc)
    }
    throw new Error(
      '[getHeadNoteDoc] Not found head-note-doc, unexpected error',
    )
  }

  /**
   *
   */
  parse<T extends NoteDoc & { branch?: Branch }>(doc: T): NoteDocParsed<T> {
    const { meta, contentBody, contentHead, ...rest } = doc
    return {
      ...rest,
      meta: meta as unknown as NoteDocMeta,
      contentHead: contentHead as unknown as NoteDocContentHead,
      contentBody: contentBody as unknown as NoteDocContentBody,
    }
  }
}

export const noteDocModel = new NoteDocModel()
