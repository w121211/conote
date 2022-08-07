import { PollVote } from '@prisma/client'
import { MERGE_POLL_V1_0 } from '../../share/constants'
// import { MERGE_POLL_CHOICES } from '../../lib/models/poll-merge.model'
import { mockMergePolls } from './poll.mock'
import { mockUsers } from './user.mock'

let countId = 0

function mockVoteMergePoll(
  pollId: string,
  userId: string,
  choice: string,
): PollVote {
  const choiceIdx = MERGE_POLL_V1_0.codes.findIndex(([code]) => code === choice)

  if (choiceIdx < 0) throw new Error('choiceIdx < 0: ' + choice)

  return {
    id: countId++,
    discussPostId: null,
    pollId,
    userId,
    choiceIdx,
    createdAt: new Date(),
    updatedAt: new Date(),
  }
}

export const mockMergePollVotes = {
  accepts: [
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[0].id, 'accept'),
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[1].id, 'accept'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[0].id, 'accept'),
  ],
  rejects: [
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[2].id, 'reject-abuse'),
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[3].id, 'reject-others'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[2].id, 'reject-abuse'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[3].id, 'reject-others'),
  ],
}
