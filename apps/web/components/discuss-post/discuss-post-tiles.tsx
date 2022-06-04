import React from 'react'
import { DiscussPostFragment } from '../../apollo/query.graphql'
import DiscussPostTile from './discuss-post-tile'

const DiscussPostTiles = ({ posts }: { posts: DiscussPostFragment[] }) => {
  return (
    <div className="flex flex-col gap-3 mb-3">
      {posts.map(e => {
        return <DiscussPostTile key={e.id} post={e} />
      })}
    </div>
  )
}

export default DiscussPostTiles
