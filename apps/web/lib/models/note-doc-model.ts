import { NoteDoc, Prisma, PrismaPromise } from '@prisma/client'
import { NoteDocContent, NoteDocMeta, NoteDraftParsed } from '../interfaces'
import prisma from '../prisma'

//
// Merge functions
//
//
//
//
//
//

/**
 * Steps:
 * - update doc's status
 *
 * Is reject the same as merge?
 *
 */
function merge() {
  throw 'Not implemented'
}

/**
 * Merge automatcially if:
 * - no previous-doc
 * - no deletions, changes to the previous-doc's content (ie, has only additions to the previous-doc)
 *
 * Auto reject if:
 * - no changes  ->  move to commit-drafts input checking
 */
function mergeAutomatical(doc: NoteDoc): void {
  throw 'Not implemented'
}

/**
 * Merge on periodical checks:
 * - poll is open for a specific time && ups is higher than downs
 *
 * Reject on periodical checks:
 * - poll is open for a specific time && ups is lower than downs
 */
function mergePeriodical() {
  throw 'Not implemented'
}

//
// Models
//
//
//
//
//
//

export class NoteDocMetaModel {
  static fromJSON(json: Prisma.JsonValue): NoteDocMeta {
    // TODO
  }

  /**
   * @returns JSON, cannot return native JSON due to prisma's bug: https://github.com/prisma/prisma/issues/9247
   */
  static toJSON(meta: NoteDocMeta): Prisma.InputJsonValue {
    // TODO
  }
}

class NoteDocModel {
  /**
   * throws if:
   * - has previous doc && no changes to previous doc
   *
   */
  checkDraftForCommit(draftId: NoteDraftParsed) {
    throw 'Not implemented'
  }

  /**
   * TODO: validate meta, content
   *
   * @param incomingSymbolsDict { [symbol]: sym-id } dict
   */
  createDoc(
    draft: NoteDraftParsed,
    commitId: string,
    symId: string,
    userId: string,
    incomingSymbolsDict: Record<string, string>,
  ): PrismaPromise<NoteDoc> {
    const { branchId, fromDocId, domain, meta, content } = draft,
      content_ = this.updateContent(content, commitId, incomingSymbolsDict)

    return prisma.noteDoc.create({
      data: {
        branch: { connect: { id: branchId } },
        sym: { connect: { id: symId } },
        commit: { connect: { id: commitId } },
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        user: { connect: { id: userId } },
        note: {
          connect: {
            branchId_symId: {
              branchId,
              symId: symId,
            },
          },
        },
        domain,
        meta: NoteDocMetaModel.toJSON(meta),
        content: content_,
      },
    })
  }

  /**
   * For all discuss-ids whose commit-id is undefined, set its commit-id
   * For all symbols whose sym-id is null, try to find sym-id in the incoming symbols
   */
  private updateContent(
    content: NoteDocContent,
    commitId: string,
    incomingSymbolsDict: Record<string, string>,
  ): NoteDocContent {
    const { discussIds, symbols } = content,
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
      ...content,
      discussIds: discussIds_,
      symbols: symbols_,
    }
  }
}

export const noteDocModel = new NoteDocModel()
