import React, { useEffect, useRef } from 'react'
import { useDiscussQuery } from '../../../apollo/query.graphql'
import DiscussBody from '../post/discuss-posts'
import DiscussHeader from '../discuss-header'
import { CreatePostForm } from '../post/create-post-form'
import { ApolloProvider } from '@apollo/client'

export const DiscussModalPage = ({
  id,
  title,
}: {
  id: string
  title: string
}) => {
  const { data } = useDiscussQuery({ variables: { id } })

  useEffect(() => {
    console.log('DiscussModalPage')
  }, [])

  if (!data?.discuss) {
    return null
  }
  return (
    <>
      {/* // <div id="modal-discuss" className="flex flex-col gap-3 "> */}
      <DiscussHeader data={data.discuss} />
      <DiscussBody discussId={data.discuss.id} />
      <CreatePostForm discussId={data.discuss.id} isModal />
      {/* // </div> */}
    </>
  )
}
