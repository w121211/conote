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
  useDiscussPostsQuery,
  useDiscussQuery,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import DiscussEl from '../../frontend/components/discuss/DiscussEl'
import DiscussPostEls from '../../frontend/components/discuss-post/DiscussPostEls'
import DiscussPostCreateForm from '../../frontend/components/discuss-post/DiscussPostCreateForm'

interface Props {
  initialApolloState: any
  discuss: DiscussFragment
  discussPosts: DiscussPostFragment[]
}

/**
 * Recall queries to enjoy extra features of `useQuery`, eg update
 */
const DiscussPage = ({ discuss }: Props) => {
  const qDiscuss = useDiscussQuery({
      variables: { id: discuss.id },
    }),
    qPosts = useDiscussPostsQuery({
      variables: { discussId: discuss.id },
    })

  if (qDiscuss.error) throw qDiscuss.error
  if (qPosts.error) throw qPosts.error
  if (qDiscuss.data === undefined || qPosts.data === undefined) {
    return null
  }
  return (
    <div className="flex flex-col gap-4 pb-32">
      <DiscussEl data={qDiscuss.data.discuss} />
      <DiscussPostEls posts={qPosts.data.discussPosts} />
      <DiscussPostCreateForm discussId={qDiscuss.data.discuss.id} />
    </div>
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
      initialApolloState: client.cache.extract(),
      discuss: qDiscuss.data.discuss,
      discussPosts: qPosts.data.discussPosts,
    },
  }
}

export default DiscussPage
