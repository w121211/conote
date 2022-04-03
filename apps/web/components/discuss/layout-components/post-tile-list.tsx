import React from 'react'
import { DiscussPostFragment, useMeQuery } from '../../../apollo/query.graphql'
import { PostTile } from './post-tile'

export const PostTileList = ({ postList }: { postList: DiscussPostFragment[] }) => {
  const { data: meData } = useMeQuery()
  return (
    <div className="flex flex-col gap-3 mb-3">
      {postList.map(post => {
        return <PostTile key={post.id} post={post} userId={meData?.me.id ?? ''} />
      })}
    </div>
  )
}
