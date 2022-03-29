import React from 'react'
import { DiscussPostFragment, useMeQuery } from '../apollo/query.graphql'
import DiscussPostEmojis from '../components/discuss/post/post-emojis'
import PostOptionsMenu from '../components/discuss/post/post-options-menu'
import { PostTile } from './post-tile'

export const PostTileList = ({ postList }: { postList: DiscussPostFragment[] }) => {
  const { data: meData } = useMeQuery()
  return (
    <div className="flex flex-col gap-3">
      {postList.map(post => {
        return <PostTile key={post.id} post={post} userId={meData?.me.id ?? ''} />
      })}
    </div>
  )
}
