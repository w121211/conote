import { PollVote } from '@prisma/client'
import { MERGE_POLL_CHOICES } from '../../lib/models/poll-merge-model'
import { mockMergePolls } from './mock-poll'
import { mockUsers } from './mock-user'

let countId = 0

export function mockVoteMergePoll(
  pollId: string,
  userId: string,
  choice: string,
): PollVote {
  const choiceIdx = MERGE_POLL_CHOICES.indexOf(choice)

  if (choiceIdx < 0) throw new Error('choiceIdx < 0')

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
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[0].id, 'accpet'),
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[1].id, 'accpet'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[0].id, 'accpet'),
  ],
  rejects: [
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[2].id, 'reject-abuse'),
    mockVoteMergePoll(mockMergePolls[0].id, mockUsers[3].id, 'reject-others'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[2].id, 'reject-abuse'),
    mockVoteMergePoll(mockMergePolls[1].id, mockUsers[3].id, 'reject-others'),
  ],
}
