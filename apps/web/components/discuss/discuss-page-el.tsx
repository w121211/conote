import React, { useEffect, useRef } from 'react'
import { useDiscussQuery } from '../../apollo/query.graphql'
import { DiscussTile } from './discuss-tile'
import { CreatePostForm } from './post/create-post-form'
import { PostList } from './post/post-list'

const DiscussPageEl = ({ id }: { id: string }) => {
  const { data } = useDiscussQuery({ variables: { id } })

  if (!data?.discuss) {
    return null
  }
  return (
    <div className="flex flex-col gap-3 w-full">
      <DiscussTile data={data.discuss} />
      <PostList discussId={data.discuss.id} />
      <CreatePostForm discussId={data.discuss.id} />
    </div>
  )
}

export default DiscussPageEl
