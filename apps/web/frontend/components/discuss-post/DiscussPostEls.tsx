import React from 'react'
import { DiscussPostFragment } from '../../../apollo/query.graphql'
import DiscussPostEl from './DiscussPostEl'

type Props = {
  // discussId: string
  posts: DiscussPostFragment[]
}

const DiscussPostEls = ({ posts }: Props): JSX.Element | null => {
  if (posts.length === 0) {
    return null
  }
  return (
    <div className="flex flex-col gap-4">
      {posts.map(e => {
        return <DiscussPostEl key={e.id} post={e} />
      })}
    </div>
  )
}

export default DiscussPostEls
