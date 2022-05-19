import React from 'react'
import {
  DiscussPostFragment,
  useDiscussPostsQuery,
  useMeQuery,
} from '../../../apollo/query.graphql'
import { PostTile } from './post-tile'

export const PostTileList = ({ discussId }: { discussId: string }) => {
  const { data: meData } = useMeQuery()
  const { data } = useDiscussPostsQuery({ variables: { discussId } })
  return (
    <div className="flex flex-col gap-3 mb-3">
      {data?.discussPosts.map(post => {
        return (
          <PostTile key={post.id} post={post} userId={meData?.me.id ?? ''} />
        )
      })}
    </div>
  )
}
