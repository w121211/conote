import React from 'react'
import { useDiscussesByUserQuery } from '../../../apollo/query.graphql'
import DiscussList from './DiscussList'
import DiscussListBtnGroup from './DiscussListBtnGroup'

interface Props {
  userId: string
  afterId?: string
  beforeId?: string
}

const DiscussListByUser = ({ userId, afterId, beforeId }: Props) => {
  const { data, refetch } = useDiscussesByUserQuery({
    variables: { userId, afterId, beforeId },
  })

  if (data) {
    const { discusses, hasNext, hasPrevious } = data.discussesByUser
    const onClickPrevious = () => {
      if (hasPrevious) {
        refetch({ userId, beforeId: discusses[0].id })
      }
    }
    const onClickNext = () => {
      if (hasNext) {
        refetch({
          userId,
          afterId: discusses[discusses.length - 1].id,
        })
      }
    }

    return (
      <>
        <DiscussList discusses={discusses} />
        <DiscussListBtnGroup
          {...{ hasNext, hasPrevious, onClickNext, onClickPrevious }}
        />
      </>
    )
  }
  return null
}

export default DiscussListByUser
