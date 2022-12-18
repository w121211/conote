import React from 'react'
import { useCommitsLatestQuery } from '../../../apollo/query.graphql'
import CommitList from './CommitList'
import CommitListBtnGroup from './CommitListBtnGroup'

interface Props {
  // initCommits: CommitFragment[]
  afterId?: string
  beforeId?: string
}

/**
 * Todo:
 * - [] Load initial commits from SSR
 */
const CommitListLatest = ({ afterId, beforeId }: Props) => {
  const { data, refetch } = useCommitsLatestQuery({
    variables: { afterId, beforeId },
  })

  if (data) {
    const { commits, hasNext, hasPrevious } = data.commitsLatest
    const onClickPrevious = () => {
      if (hasPrevious) {
        refetch({ beforeId: commits[0].id })
      }
    }
    const onClickNext = () => {
      if (hasNext) {
        refetch({ afterId: commits[commits.length - 1].id })
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

export default CommitListLatest
