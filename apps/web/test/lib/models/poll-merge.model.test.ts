import { Poll, PollCount, PollStatus, PollVote } from '@prisma/client'
import { pollMergeModel } from '../../../lib/models/poll-merge.model'
import { pollVoteModel } from '../../../lib/models/poll-vote.model'
import prisma from '../../../lib/prisma'
import { testHelper } from '../../test-helpers'
import { mockMergePolls } from '../../__mocks__/poll.mock'
import { mockMergePollVotes } from '../../__mocks__/poll-vote.mock'

async function createMockMergePolls(mockPolls = mockMergePolls) {
  return await Promise.all(
    mockPolls.map(e => testHelper.createMergePoll(prisma, e)),
  )
}

export async function createMockVotes(votes: PollVote[]) {
  const votes_: PollVote[] = []

  for (const e of votes) {
    const { choiceIdx, pollId, userId } = e,
      v = await pollVoteModel.create({
        choiceIdx,
        pollId,
        userId,
      })
    votes_.push(v)
  }

  return votes_
}

function c<T extends Poll & { count: PollCount }>(poll: T) {
  const {
    status,
    count: { nVotes },
  } = poll
  return { count: nVotes.join(','), status }
}

beforeAll(async () => {
  // Reset database
  await prisma.$queryRaw`TRUNCATE "Author", "Branch", "User" CASCADE;`
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll", "PollVote" CASCADE;`
  await testHelper.createUsers(prisma)
  await testHelper.createBranches(prisma)
})

afterAll(async () => {
  // Bug: comment out to avoid rerun loop  @see https://github.com/facebook/jest/issues/2516
  // fetcher.dump()
  await prisma.$disconnect()
})

beforeEach(async () => {
  await prisma.$queryRaw`TRUNCATE "Note", "NoteDoc", "NoteDraft", "Sym", "Commit", "Link", "Poll", "PollVote" CASCADE;`
})

describe('verdict()', () => {
  it('throws if the poll has not ended', async () => {
    //
  })

  it("throws if the poll's choices not equal to the merge-poll's choices", async () => {
    //
  })

  it('accepts if number of accepts > rejects', async () => {
    const polls = await createMockMergePolls()
    const votes = await createMockVotes(mockMergePollVotes.accepts)
    await createMockVotes(mockMergePollVotes.rejects.slice(0, 1))

    const { poll, ...rest } = await pollMergeModel.verdict(polls[0])

    expect(rest).toMatchInlineSnapshot(`
      Object {
        "nAccepts": 2,
        "nRejects": 1,
        "result": "accept",
      }
    `)
    expect(c(poll)).toMatchInlineSnapshot(`
      Object {
        "count": "2,0,1,0,0,0,0,0",
        "status": "CLOSE_SUCCESS",
      }
    `)
  })

  it('accepts if number of accepts == rejects', async () => {
    const polls = await createMockMergePolls()
    await createMockVotes(mockMergePollVotes.accepts)
    await createMockVotes(mockMergePollVotes.rejects)

    const { poll, ...rest } = await pollMergeModel.verdict(polls[0])

    expect(rest).toMatchInlineSnapshot(`
      Object {
        "nAccepts": 2,
        "nRejects": 2,
        "result": "accept",
      }
    `)
    expect(c(poll)).toMatchInlineSnapshot(`
      Object {
        "count": "2,0,1,0,0,0,0,1",
        "status": "CLOSE_SUCCESS",
      }
    `)
  })

  it('rejects if number of accepts < rejects', async () => {
    const polls = await createMockMergePolls()
    await createMockVotes(mockMergePollVotes.accepts.slice(0, 1))
    await createMockVotes(mockMergePollVotes.rejects)

    const { poll, ...rest } = await pollMergeModel.verdict(polls[0])

    expect(rest).toMatchInlineSnapshot(`
      Object {
        "nAccepts": 1,
        "nRejects": 2,
        "result": "reject",
      }
    `)
    expect(c(poll)).toMatchInlineSnapshot(`
      Object {
        "count": "1,0,1,0,0,0,0,1",
        "status": "CLOSE_SUCCESS",
      }
    `)
  })

  it('accepts if has zero vote', async () => {
    const polls = await createMockMergePolls()
    const { poll, ...rest } = await pollMergeModel.verdict(polls[0])

    expect(rest).toMatchInlineSnapshot(`
      Object {
        "nAccepts": 0,
        "nRejects": 0,
        "result": "accept",
      }
    `)
    expect(c(poll)).toMatchInlineSnapshot(`
      Object {
        "count": "0,0,0,0,0,0,0,0",
        "status": "CLOSE_SUCCESS",
      }
    `)
  })
})

describe('getMergePollsReadyToVerdict()', () => {
  it('get merge polls ready to verdict', async () => {
    const polls = [
      ...mockMergePolls,
      {
        ...mockMergePolls[0],
        id: '98-before_deadline',
        createdAt: new Date(),
      },
      {
        ...mockMergePolls[0],
        id: '99-after_deadline_but_the_poll_is_not_open',
        createdAt: new Date(2022, 1, 1),
        status: PollStatus.CLOSE_FAIL,
      },
    ]
    await createMockMergePolls(polls)
    const result = await pollMergeModel.getMergePollsReadyToVerdict()

    expect(result.map(e => e.id)).toMatchInlineSnapshot(`
      Array [
        "1-merge_poll",
        "2-merge_poll",
      ]
    `)
  })
})
