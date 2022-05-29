import React from 'react'
import { useDiscussPostsQuery, useMeQuery } from '../../../apollo/query.graphql'
import { useMe } from '../../auth/use-me'
import { PostTile } from './post-tile'

export const PostList = ({ discussId }: { discussId: string }) => {
  const { me } = useMe()
  // const { data: meData } = useMeQuery()
  const { data } = useDiscussPostsQuery({ variables: { discussId } })
  return (
    <div className="flex flex-col gap-3 mb-3">
      {data?.discussPosts.map(post => {
        return <PostTile key={post.id} post={post} userId={me?.id ?? ''} />
      })}
    </div>
  )
}
