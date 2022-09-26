import React from 'react'
import { useCommitsByUserQuery } from '../../../apollo/query.graphql'
import CommitList from './CommitList'
import CommitListBtnGroup from './CommitListBtnGroup'

interface Props {
  userId: string
  // initCommits: CommitFragment[]
  afterId?: string
  beforeId?: string
}

/**
 * Todo:
 * - [] Load initial commits from SSR
 */
const CommitListByUser = ({ userId, afterId, beforeId }: Props) => {
  const { data, refetch } = useCommitsByUserQuery({
    variables: { userId, afterId, beforeId },
  })

  if (data) {
    const { commits, hasNext, hasPrevious } = data.commitsByUser
    const onClickPrevious = () => {
      if (hasPrevious) {
        refetch({ userId, beforeId: commits[0].id })
      }
    }
    const onClickNext = () => {
      if (hasNext) {
        refetch({
          userId,
          afterId: commits[commits.length - 1].id,
        })
      }
    }

    return (
      <>
        <CommitList commits={commits} />
        <CommitListBtnGroup
          {...{ hasNext, hasPrevious, onClickNext, onClickPrevious }}
        />
      </>
    )
  }
  return null
}

export default CommitListByUser
