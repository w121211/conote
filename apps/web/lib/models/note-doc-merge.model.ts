import {
  Branch,
  Note,
  NoteDoc,
  NoteDocStatus,
  Poll,
  PrismaPromise,
  Sym,
} from '@prisma/client'
import { isEqual } from 'lodash'
import { differenceContentBody } from '../../share/utils'
import type { NoteDocMeta, NoteDocParsed } from '../interfaces'
import prisma from '../prisma'
import { NoteDocModel } from './note-doc.model'
import { pollMergeModel } from './poll-merge.model'
import { symModel } from './sym.model'

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

    if (doc_ === null) throw new Error('Unexpected error')
    if (doc_.mergePoll !== null) throw new Error('Doc already has a merge poll')

    const poll = await pollMergeModel.createMergePoll(doc_),
      doc__ = this._update(doc_, 'CANDIDATE', 'wait_to_merge-by_poll')

    return doc__
  }

  /**
   * Do the merge
   * - Update doc's status to 'MERGED'
   * - If content-head symbol got modified, update symbol's name
   *
   */
  async _mergeAccept(
    doc: NoteDocParsed<
      NoteDoc & {
        sym: Sym
        fromDoc: NoteDoc | null
        mergePoll: Poll | null
      }
    >,
    mergeState: NoteDocMeta['mergeState'],
  ) {
    if (doc.contentHead.symbol && doc.contentHead.symbol !== doc.sym.symbol) {
      // Content-head symbol changed, update sym
      await symModel.update(doc.symId, doc.contentHead.symbol)
    }
    return this._update(doc, NoteDocStatus.MERGED, mergeState)
  }

  async _mergePause(
    doc: NoteDocParsed<
      NoteDoc & {
        sym: Sym
        fromDoc: NoteDoc | null
        mergePoll: Poll | null
      }
    >,
    mergeState: NoteDocMeta['mergeState'],
  ) {
    const { mergePoll } = doc

    if (mergePoll) {
      await prisma.poll.update({
        data: { status: 'PAUSE' },
        where: { id: mergePoll.id },
      })
    }

    return this._update(doc, NoteDocStatus.PAUSE, mergeState)
  }

  async _mergeReject(doc: NoteDoc, mergeState: NoteDocMeta['mergeState']) {
    return this._update(doc, NoteDocStatus.REJECTED, mergeState)
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
    doc: NoteDoc & {
      sym: Sym
      fromDoc: NoteDoc | null
      mergePoll: Poll | null
    },
  ): Promise<NoteDoc & { branch: Branch; sym: Sym; mergePoll: Poll | null }> {
    const { docParsed } = await this._validateOnMerge(doc),
      { branchId, symId, fromDoc } = docParsed

    if (fromDoc === null)
      return this._mergeAccept(docParsed, 'merged_auto-initial_commit')

    const fromDoc_ = this.parse(fromDoc),
      waitingCndidates = await this.getCandidates(docParsed),
      headDoc = await this.getHeadDoc(branchId, symId),
      // TODO: Content head is insert only?
      contentHead_isEqual = isEqual(
        docParsed.contentHead,
        fromDoc_.contentHead,
      ),
      { blockChanges: contentBody_changes } = differenceContentBody(
        docParsed.contentBody,
        fromDoc_.contentBody,
      ),
      contentBody_inserts = contentBody_changes.filter(
        e => e.type === 'insert',
      ),
      contentBody_onlyInserts =
        contentBody_inserts.length > 0 &&
        contentBody_inserts.length === contentBody_changes.length

    if (contentHead_isEqual && contentBody_changes.length === 0) {
      return this._mergeReject(docParsed, 'rejected_auto-no_changes')
    }

    if (waitingCndidates.length <= 1) {
      if (headDoc && headDoc.userId === docParsed.userId)
        return this._mergeAccept(docParsed, 'merged_auto-same_user')
      if (contentHead_isEqual && contentBody_onlyInserts)
        return this._mergeAccept(docParsed, 'merged_auto-only_insertions')
    }
    // console.debug(waitingDocs, contentBody_changes, contentBody_inserts)
    throw new MergeError('fail_to_auto_merge')
  }

  /**
   * Use the merge poll result to accept or reject merge
   */
  async _mergeByPoll(
    doc: NoteDoc & {
      sym: Sym
      fromDoc: NoteDoc | null
      mergePoll: Poll
    },
  ): Promise<
    NoteDoc & {
      branch: Branch
      sym: Sym
    }
  > {
    const doc_ = this.parse(doc),
      { meta, mergePoll } = doc_

    if (meta.mergeState !== 'wait_to_merge-by_poll')
      throw new Error('meta.mergeState !== wait_to_merge-by_poll')

    try {
      const { docParsed } = await this._validateOnMerge(doc)
      const { result } = await pollMergeModel.verdict(mergePoll)

      return result === 'accept'
        ? this._mergeAccept(docParsed, 'merged_poll')
        : this._mergeReject(docParsed, 'rejected_poll')
    } catch (err) {
      if (err instanceof MergeError && err.updatedNoteDoc) {
        return err.updatedNoteDoc
      }
      throw err
    }
  }

  _update(
    doc: NoteDoc,
    status: NoteDocStatus,
    mergeState: NoteDocMeta['mergeState'],
  ) {
    const meta: NoteDocMeta = {
        mergeState,
      },
      doc_ = prisma.noteDoc.update({
        data: { status, meta },
        where: { id: doc.id },
        include: { branch: true, sym: true, mergePoll: true },
      })
    return doc_
  }

  /**
   * @throws
   * - If doc is not candidate
   * - If from-doc is not the head -> pause merge
   */
  async _validateOnMerge(
    doc: NoteDoc & {
      sym: Sym
      fromDoc: NoteDoc | null
      mergePoll: Poll | null
    },
  ) {
    const docParsed = this.parse(doc),
      { fromDoc, status, meta } = docParsed,
      headDoc = fromDoc && (await this.getHeadDoc(doc.branchId, doc.symId))

    if (status !== 'CANDIDATE') {
      throw new Error('Doc.status not CANDIDATE')
    }
    if (!['before_merge', 'wait_to_merge-by_poll'].includes(meta.mergeState)) {
      throw new Error(
        'Doc.status is CANDIDATE but Doc.meta.mergeState is not either "before_merge",  "wait_to_merge-by_poll"',
      )
    }
    if (fromDoc) {
      if (headDoc === null || headDoc.id !== fromDoc.id) {
        const doc_ = await this._mergePause(
          docParsed,
          'paused-from_doc_not_head',
        )
        throw new MergeError('paused-from_doc_not_head', doc_)
      }
    }

    return {
      docParsed,
      headDoc,
    }
  }

  /**
   * Merge on routine checks:
   * - poll is open for a specific time && ups is higher than downs
   *
   * Reject on routine checks:
   * - poll is open for a specific time && ups is lower than downs
   *
   * TODO:
   * - [] Insert to activty feed
   */
  async mergeSchedule() {
    const mergePolls = await pollMergeModel.getMergePollsReadyToVerdict()
    const res: (NoteDoc & { branch: Branch; sym: Sym })[] = []

    for (const mergePoll of mergePolls) {
      const { noteDocToMerge } = mergePoll

      if (noteDocToMerge === null) throw new Error('noteDocToMerge === null')

      try {
        const doc = await this._mergeByPoll({ ...noteDocToMerge, mergePoll })
        res.push(doc)
      } catch (err) {
        console.debug(err)
      }
    }

    return res
  }

  /**
   * For the given note-doc, try auto merge, if failed create a merge poll for it
   */
  async mergeOnCreate(
    doc: NoteDoc & {
      sym: Sym
      fromDoc: NoteDoc | null
      mergePoll: Poll | null
    },
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
