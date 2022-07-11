import React from 'react'
import { DiscussPostFragment } from '../../../apollo/query.graphql'
import DiscussPostTile from './discuss-post-tile'

const DiscussPostTiles = ({
  posts,
}: {
  posts: DiscussPostFragment[]
}): JSX.Element | null => {
  if (posts.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-4">
      {posts.map(e => {
        return <DiscussPostTile key={e.id} post={e} />
      })}
    </div>
  )
}

export default DiscussPostTiles
