import { NoteDoc, Poll, PollCount, Prisma, PrismaPromise } from '@prisma/client'
import { NoteDocMetaWebpageFragmentDoc } from '../../apollo/query.graphql'
import { NoteDocContent, NoteDocMeta, NoteDraftParsed } from '../interfaces'
import prisma from '../prisma'
import { getContentDiff, isMetaChanged, metaDiff } from './change-model'
import { createMergePoll } from './poll-model'

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
async function merge(doc: NoteDoc) {
  const poll = await prisma.poll.update({
    data: { status: 'CLOSE_SUCCESS' },
    where: { id: doc.mergePollId },
    include: { count: true },
  })
  if (poll === null) {
    throw new Error('[Merge] Poll not found.')
  }
  if (poll.count === null) {
    throw new Error('[Merge] pollCount not found.')
  }

  const upIdx = poll?.choices.indexOf('UP')
  const downIdx = poll?.choices.indexOf('DOWN')
  const ups = poll.count!.nVotes[upIdx]
  const downs = poll.count!.nVotes[downIdx]
  if (ups < downs) {
    return await prisma.noteDoc.update({
      data: { status: 'REJECT' },
      where: { id: doc.id },
    })
  } else {
    return await prisma.noteDoc.update({
      data: { status: 'MERGE' },
      where: { id: doc.id },
    })
  }
}

/**
 * Merge automatcially if:
 * - no previous-doc
 * - no deletions, changes to the previous-doc's content (ie, has only additions to the previous-doc)
 *
 * Auto reject if:
 * - no changes, the same as fromDoc  ->  move to commit-drafts input checking (implementing in validateCommit)
 *
 */
export async function mergeAutomatical(doc: NoteDoc): Promise<NoteDoc | null> {
  if (doc.fromDocId === null) {
    return await prisma.noteDoc.update({
      data: { status: 'MERGE' },
      where: { id: doc.id },
    })
  }
  // { fromDocId, domain, meta, content }: NoteDraftInput
  const fromDoc = await prisma.noteDoc.findUnique({
    where: { id: doc.fromDocId! },
  })
  const metaChanged = isMetaChanged(
    fromDoc!.meta as unknown as NoteDocMeta,
    doc.meta as unknown as NoteDocMeta,
  )
  const contentDiff = getContentDiff(
    fromDoc?.content as unknown as NoteDocContent,
    doc.content as unknown as NoteDocContent,
  )
  // no deletions, changes to the previous-doc's content, but addition
  // TODO: compare meta and content
  const poll = await prisma.poll.findUnique({
    where: { id: doc.mergePollId },
    include: { count: true },
  })
  if (doc.domain === fromDoc?.domain && !metaChanged && contentDiff.change) {
    return merge(doc)
  }
  return null
}

/**
 * Merge on periodical checks:
 * - poll is open for a specific time && ups is higher than downs
 *
 * Reject on periodical checks:
 * - poll is open for a specific time && ups is lower than downs
 */
export async function mergePeriodical(doc: NoteDoc): Promise<NoteDoc> {
  return await merge(doc)
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
  // static fromJSON(json: Prisma.JsonValue | undefined): NoteDocMeta {
  //   // TODO
  //   if (json === undefined) {
  //     return {}
  //   }
  //   const jsonParsed = json as object
  //   // const parsed = JSON.parse(jsonString)
  //   return {
  //     keywords: ,
  //     // duplicatedSymbols: parsed.duplicatedSymbols,
  //     // keywords: parsed.keywords,
  //     // redirectFroms: parsed.redirectFroms,
  //     // redirectTo: parsed.redirectTo,
  //     webpage: {
  //       ...parsed.webpage,
  //       // authors: parsed.webpage.authors,
  //       // title: parsed.webpage.title,
  //       publishedAt: new Date(parsed.webpage.publishedAt),
  //       // tickers: parsed.webpage.tickers,
  //     },
  //   }
  // }
  /**
   * @returns JSON, cannot return native JSON due to prisma's bug: https://github.com/prisma/prisma/issues/9247
   */
  // static toJSON(meta: NoteDocMeta): Prisma.InputJsonValue {
  //   // TODO
  //   return {
  //     ...meta,
  //     webpage: {
  //       ...meta.webpage,
  //       publishedAt: meta.webpage?.publishedAt?.toISOString(),
  //     },
  //   }
  // }
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
  async createDoc(
    draft: NoteDraftParsed,
    commitId: string,
    symId: string,
    userId: string,
    incomingSymbolsDict: Record<string, string>,
  ): Promise<NoteDoc> {
    const { branchId, fromDocId, domain, meta, content } = draft,
      content_ = this.updateContent(content, commitId, incomingSymbolsDict)
    const poll = await createMergePoll({ meta: {}, userId })
    return await prisma.noteDoc.create({
      data: {
        branch: { connect: { id: branchId } },
        sym: { connect: { id: symId } },
        commit: { connect: { id: commitId } },
        fromDoc: fromDocId ? { connect: { id: fromDocId } } : undefined,
        mergePoll: { connect: { id: poll.id } },
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
        meta: meta as object,
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
    const { discussIds, symbolIdMap } = content,
      discussIds_ = discussIds.map(e => {
        return e.commitId ? e : { ...e, commitId }
      }),
      symbols_ = symbolIdMap.map(e => {
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
      symbolIdMap: symbols_,
    }
  }
}

export const noteDocModel = new NoteDocModel()
