import React from 'react'
import {
  useDiscussPostsQuery,
  useDiscussQuery,
} from '../../apollo/query.graphql'
import DiscussPostForm from '../discuss-post/discuss-post-form'
import DiscussPostTiles from '../discuss-post/discuss-post-tiles'
import DiscussTile from './discuss-tile'

/**
 * For the modal page which requires to query first
 */
const DiscussModalPageEl = ({ id }: { id: string }) => {
  const qDiscuss = useDiscussQuery({ variables: { id } }),
    qPosts = useDiscussPostsQuery({ variables: { discussId: id } })

  if (qDiscuss.error) {
    throw qDiscuss.error
  }
  if (qPosts.error) {
    throw qPosts.error
  }
  if (qDiscuss.data === undefined || qPosts.data === undefined) {
    return null
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      <DiscussTile data={qDiscuss.data.discuss} />
      <DiscussPostTiles posts={qPosts.data.discussPosts} />
      <DiscussPostForm discussId={qDiscuss.data.discuss.id} />
    </div>
  )
}

export default DiscussModalPageEl
