import React from 'react'
import {
  useDiscussPostsQuery,
  useDiscussQuery,
} from '../../../apollo/query.graphql'
import { useMeContext } from '../auth/use-me-context'
import DiscussPostCreateForm from '../discuss-post/DiscussPostCreateForm'
import DiscussPostEls from '../discuss-post/DiscussPostEls'
import DiscussEl from './DiscussEl'

/**
 * For the modal page which requires to query first.
 */
const DiscussModalPageEl = ({ id }: { id: string }) => {
  const { me } = useMeContext()
  const qDiscuss = useDiscussQuery({ variables: { id } }),
    qPosts = useDiscussPostsQuery({ variables: { discussId: id } })

  if (qDiscuss.error) throw qDiscuss.error
  if (qPosts.error) throw qPosts.error
  if (qDiscuss.data === undefined || qPosts.data === undefined) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 w-full pb-5">
      <DiscussEl data={qDiscuss.data.discuss} />
      <DiscussPostEls posts={qPosts.data.discussPosts} />
      <DiscussPostCreateForm discussId={qDiscuss.data.discuss.id} />
    </div>
  )
}

export default DiscussModalPageEl
