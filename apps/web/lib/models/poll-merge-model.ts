import { NoteDoc, Poll } from '@prisma/client'
import { isEqual } from 'lodash'
import { MERGE_POLL_V1_0 } from '../../shared/constants'
import { PollMeta, PollParsed } from '../interfaces'
import prisma from '../prisma'
import { PollModel } from './poll-model'
import { getBotId } from './user-model'

const defaultMergePollMeta: PollMeta = {
  openInDays: 5,
  spec: MERGE_POLL_V1_0.spec,
}

const defaultChoices = MERGE_POLL_V1_0.codes.map(e => e[0])

class PollMergeModel extends PollModel {
  /**
   * Create the merge-poll through note-doc update,
   *  this is to prevent duplicate creations of merge-polls
   */
  async createMergePoll(doc: NoteDoc) {
    return this.create({
      userId: await getBotId(),
      choices: defaultChoices,
      meta: defaultMergePollMeta,
      noteDocToMerge: doc,
    })
  }

  /**
   * Determine a merge-poll to accept or reject
   *
   * Throws
   * - If the poll has not ended
   * - If the poll's choices not equal to the merge-poll's choices (may happen if the choices got updated)
   *
   * Accept requires
   * - Poll is ended according to its end time
   * - Number of accepts >= rejects
   * - Has zero vote is taken as 'accept'
   *
   *
   *
   * TODOS
   * - [] Check 'count' is correct
   *
   */
  async verdict(mergePoll: Poll): Promise<{
    poll: PollParsed<Poll>
    result: 'accept' | 'reject'
    nAccepts: number
    nRejects: number
  }> {
    // if (doc.mergePollId === null)
    //   throw new Error('[mergeOrReject] doc.mergePollId === null')

    // const poll = await prisma.poll.findUnique({
    //   where: { id: pollId },
    //   include: { count: true, votes: true },
    // })

    const poll = await prisma.poll.update({
        data: { status: 'CLOSE_SUCCESS' },
        where: { id: mergePoll.id },
        include: { count: true, votes: true },
      }),
      poll_ = this.parse(poll)

    if (!isEqual(poll_.choices, defaultChoices))
      throw new Error('[mergeOrReject] !isEqual(poll_.choices, defaultChoices)')

    // if (poll_.createdAt + poll_.meta.openInDays < Date.now())
    //   throw new Error(
    //     '[mergeOrReject] poll_.meta.closedAt && Date.now() < poll_.meta.closedAt',
    //   )

    // Trick, all choices other than 'ACCEPT' are 'REJECT'
    const acceptIdx = poll.choices.indexOf(defaultChoices[0]),
      nAccepts = poll_.count.nVotes[acceptIdx],
      nRejects = poll_.count.nVotes.reduce(
        (acc, cur, i) => (i === acceptIdx ? acc : acc + cur),
        0,
      )

    return {
      poll: poll_,
      result: nAccepts < nRejects ? 'reject' : 'accept',
      nAccepts,
      nRejects,
    }
  }
}

export const pollMergeModel = new PollMergeModel()
