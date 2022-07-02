import { TreeNodeChange, treeNodeDifferencer, treeUtil } from '@conote/docdiff'
import type {
  Branch,
  Note,
  NoteDoc,
  NoteDocStatus,
  Poll,
  PrismaPromise,
  Sym,
} from '@prisma/client'
import { isEqual } from 'lodash'
import { differenceContentBody } from '../../shared/note-doc.common'
import type { NoteDocMeta } from '../interfaces'
import prisma from '../prisma'
import { NoteDocModel } from './note-doc-model'
import { pollMergeModel } from './poll-merge-model'

type MergeErrorFlag = 'paused-from_doc_not_head' | 'fail_to_auto_merge'

class MergeError extends Error {
  flag: MergeErrorFlag

  // In cases the error can be handled,
  // and store the updated note-doc for others to use
  updatedNoteDoc:
    | (NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null })
    | undefined

  constructor(
    flag: MergeErrorFlag,
    updatedNoteDoc?: NoteDoc & {
      branch: Branch
      sym: Sym
      mergePoll: Poll | null
    },
  ) {
    super(flag)
    // this.name = 'MergeError'

    // Set the prototype explicitly.
    // See https://stackoverflow.com/questions/31626231/custom-error-class-in-typescript
    Object.setPrototypeOf(this, MergeError.prototype)

    this.flag = flag
    this.updatedNoteDoc = updatedNoteDoc
  }
}

class NoteDocMergeModel extends NoteDocModel {
  async _createMergePoll(
    doc: NoteDoc,
  ): Promise<NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null }> {
    const doc_ = await prisma.noteDoc.findUnique({
      where: { id: doc.id },
      include: { mergePoll: true },
    })

    if (doc_ === null) throw new Error('[_createMergePoll] Unexpected error')
    if (doc_.mergePoll !== null)
      throw new Error('[_createMergePoll] Doc already has a merge poll')

    const poll = await pollMergeModel.createMergePoll(doc_),
      doc__ = this._update(doc_.id, 'CANDIDATE', 'wait_to_merge-by_poll')

    return doc__
  }

  /**
   * Try to auto merge if meet one of the following cases, use this method during commit
   * - Note has no previous-doc, ie the first commit
   * - Note has no waiting-docs &&
   *   - Head-doc is created by the same user
   *   - Only insertions apply to the previous doc, no deletions, mutations, movings
   *
   * Auto reject if:
   * - No changes found, ie is the same as from-doc  ->  TODO: Check this during commit drafts, not here (implementing in validateCommit)
   *
   * @returns NoteDoc if auto merged, otherwise returns null
   * @throws MergeAutoFail if not able to auto merge
   *
   * TODOS:
   * - [] Check does content-head only have insertions -> can auto merge
   *
   */
  async _mergeAuto(
    doc: NoteDoc & { fromDoc: NoteDoc | null; mergePoll: Poll | null },
  ): Promise<NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null }> {
    this._validateOnMerge(doc)

    if (doc.fromDoc === null) {
      return await this._update(doc.id, 'MERGED', 'merged_auto-initial_commit')
    }

    const { branchId, symId, fromDoc } = doc,
      doc_ = this.parse(doc),
      fromDoc_ = this.parse(fromDoc),
      waitingDocs = await this.getCandidates(doc),
      headDoc = await this.getHeadDoc(branchId, symId),
      // TODO
      contentHead_isEqual = isEqual(doc_.contentHead, fromDoc_.contentHead),
      contentBody_changes = differenceContentBody(
        doc_.contentBody,
        fromDoc_.contentBody,
      ),
      contentBody_inserts = contentBody_changes.filter(
        e => e.type === 'insert',
      ),
      contentBody_onlyInserts =
        contentBody_inserts.length > 0 &&
        contentBody_inserts.length === contentBody_changes.length

    if (contentHead_isEqual && contentBody_changes.length === 0) {
      console.debug(contentBody_changes)
      return await this._update(doc.id, 'REJECTED', 'rejected_auto-no_changes')
    }

    if (waitingDocs.length <= 1) {
      if (headDoc && headDoc.userId === doc.userId)
        return await this._update(doc.id, 'MERGED', 'merged_auto-same_user')

      if (contentHead_isEqual && contentBody_onlyInserts)
        return await this._update(
          doc.id,
          'MERGED',
          'merged_auto-only_insertions',
        )
    }
    // console.debug(waitingDocs, contentBody_changes, contentBody_inserts)
    throw new MergeError('fail_to_auto_merge')
  }

  /**
   * Throws
   * - If from-doc is behind head-doc, 'paused'
   *
   * If merge-poll is finished and
   * - If number of accepts more than rejects, 'merged', otherwise 'rejected'
   */
  async _mergeByPoll(
    doc: NoteDoc & {
      fromDoc: NoteDoc | null
      mergePoll: Poll | null
      note: Note
    },
  ): Promise<
    NoteDoc & {
      branch: Branch
      sym: Sym
    }
  > {
    const doc_ = this.parse(doc),
      { meta, mergePoll } = doc_

    if (mergePoll === null) {
      throw new Error('[_mergeByPoll] mergePoll === null')
    }
    if (meta.mergeState !== 'wait_to_merge-by_poll') {
      throw new Error(
        '[_mergeByPoll] meta.mergeState !== wait_to_merge-by_poll',
      )
    }
    try {
      await this._validateOnMerge(doc)
    } catch (err) {
      if (err instanceof MergeError && err.updatedNoteDoc) {
        return err.updatedNoteDoc
      }
      throw err
    }

    const { result } = await pollMergeModel.verdict(mergePoll)

    if (result === 'accept') {
      return await this._update(doc.id, 'MERGED', 'merged_poll')
    } else {
      return await this._update(doc.id, 'REJECTED', 'rejected_poll')
    }
  }

  _update(
    id: string,
    status: NoteDocStatus,
    mergeState: NoteDocMeta['mergeState'],
    // mergePoll?: Poll,
  ): PrismaPromise<
    NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null }
  > {
    const meta: NoteDocMeta = {
        mergeState,
      },
      doc = prisma.noteDoc.update({
        data: { status, meta },
        where: { id },
        include: { branch: true, sym: true, mergePoll: true },
      })
    return doc
  }

  /**
   * Throws
   * - If doc is not candidate
   * - If rom-doc is not the head -> pause merge
   */
  async _validateOnMerge(
    doc: NoteDoc & { fromDoc: NoteDoc | null; mergePoll: Poll | null },
  ): Promise<void> {
    const doc_ = this.parse(doc),
      { fromDoc, status, meta, mergePoll } = doc_,
      headDoc = fromDoc && (await this.getHeadDoc(doc.branchId, doc.symId))

    if (status !== 'CANDIDATE')
      throw new Error('[_validateOnMerge] Doc.status not CANDIDATE')
    if (!['before_merge', 'wait_to_merge-by_poll'].includes(meta.mergeState))
      throw new Error(
        '[_validateOnMerge] Doc.status is CANDIDATE but Doc.meta.mergeState is not either "before_merge",  "wait_to_merge-by_poll"',
      )
    if (fromDoc) {
      if (headDoc === null || headDoc.id !== fromDoc.id) {
        if (mergePoll) {
          await prisma.poll.update({
            data: { status: 'PAUSE' },
            where: { id: mergePoll.id },
          })
        }
        const doc_ = await this._update(
          doc.id,
          'PAUSE',
          'paused-from_doc_not_head',
        )
        throw new MergeError('paused-from_doc_not_head', doc_)
      }
    }
  }

  /**
   * Merge on periodical checks:
   * - poll is open for a specific time && ups is higher than downs
   *
   * Reject on periodical checks:
   * - poll is open for a specific time && ups is lower than downs
   */
  async mergePeriodical(
    doc: NoteDoc & {
      fromDoc: NoteDoc | null
      mergePoll: Poll | null
      note: Note
    },
  ): Promise<NoteDoc & { branch: Branch; sym: Sym }> {
    return await this._mergeByPoll(doc)
  }

  /**
   * For the given note-doc, try auto merge, if failed create a merge poll for it
   */
  async mergeOnCreate(
    doc: NoteDoc & { fromDoc: NoteDoc | null; mergePoll: Poll | null },
  ): Promise<NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null }> {
    try {
      return await this._mergeAuto(doc)
    } catch (err) {
      if (err instanceof MergeError) {
        if (err.flag === 'fail_to_auto_merge') {
          return await this._createMergePoll(doc)
        } else if (err.updatedNoteDoc) {
          return err.updatedNoteDoc
        }
      }
      throw err
    }
  }
}

export const noteDocMergeModel = new NoteDocMergeModel()
