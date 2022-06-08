import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  DiscussDocument,
  DiscussFragment,
  DiscussPostFragment,
  DiscussPostsDocument,
  DiscussPostsQuery,
  DiscussPostsQueryVariables,
  DiscussQuery,
  DiscussQueryVariables,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import DiscussTile from '../../components/discuss/discuss-tile'
import DiscussPostTiles from '../../components/discuss-post/discuss-post-tiles'
import DiscussPostForm from '../../components/discuss-post/discuss-post-form'
import Layout from '../../components/ui-component/layout'

interface Props {
  discuss: DiscussFragment
  discussPosts: DiscussPostFragment[]
}

const DiscussPage = ({ discuss, discussPosts }: Props) => {
  return (
    <Layout backgroundColor="bg-gray-200">
      <div className="flex flex-col gap-4 w-full">
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
}: GetServerSidePropsContext<{ discussid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const id = params.discussid,
    client = getApolloClientSSR(),
    qDiscuss = await client.query<DiscussQuery, DiscussQueryVariables>({
      query: DiscussDocument,
      variables: { id },
    }),
    qPosts = await client.query<DiscussPostsQuery, DiscussPostsQueryVariables>({
      query: DiscussPostsDocument,
      variables: { discussId: id },
    })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      discuss: qDiscuss.data.discuss,
      discussPosts: qPosts.data.discussPosts,
    },
  }
}

export default DiscussPage
