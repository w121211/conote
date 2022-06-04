import React, { useEffect } from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  DiscussFragment,
  DiscussPostFragment,
  DiscussPostsDocument,
  DiscussPostsQuery,
  DiscussPostsQueryVariables,
  PollDocument,
  PollFragment,
  PollQuery,
  PollQueryVariables,
} from '../../apollo/query.graphql'
import DiscussTile from '../../components/discuss/discuss-tile'
import DiscussPostTiles from '../../components/discuss-post/discuss-post-tiles'
import DiscussPostForm from '../../components/discuss-post/discuss-post-form'
import Layout from '../../components/ui-component/layout'

interface Props {
  poll: PollFragment
  discuss: DiscussFragment
  discussPosts: DiscussPostFragment[]
}

const PollPage = ({
  poll,
  discuss,
  discussPosts,
}: Props): JSX.Element | null => {
  const { choices } = poll

  return (
    <Layout>
      <div className="flex flex-col gap-3 w-full">
        <DiscussTile data={discuss} />
        <DiscussPostTiles posts={discussPosts} />
        <DiscussPostForm discussId={discuss.id} />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({
  res,
  params,
}: GetServerSidePropsContext<{ pollid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const id = params.pollid,
    client = getApolloClientSSR(),
    qPoll = await client.query<PollQuery, PollQueryVariables>({
      query: PollDocument,
      variables: { id },
    })

  if (qPoll.data.poll.discuss === null || qPoll.data.poll.discuss === undefined)
    throw new Error('qPoll.data.poll.discuss === null')

  const qPosts = await client.query<
    DiscussPostsQuery,
    DiscussPostsQueryVariables
  >({
    query: DiscussPostsDocument,
    variables: { discussId: qPoll.data.poll.discuss.id },
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      poll: qPoll.data.poll,
      discuss: qPoll.data.poll.discuss,
      discussPosts: qPosts.data.discussPosts,
    },
  }
}

export default PollPage
