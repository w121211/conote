import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  CommitsByUserDocument,
  CommitsByUserQuery,
  CommitsByUserQueryVariables,
} from '../../../apollo/query.graphql'
import { getApolloClientSSR } from '../../../apollo/apollo-client-ssr'
import { shortenUserId } from '../../../frontend/utils'
import { useMeContext } from '../../../frontend/components/auth/use-me-context'
import DiscussListByUser from '../../../frontend/components/discuss/DiscussListByUser'
import { AppPageProps } from '../../../frontend/interfaces'

interface Props extends AppPageProps {
  userId: string
  queryResult: CommitsByUserQuery
}

const UserDiscussionsPage = ({ userId }: Props) => {
  const { me } = useMeContext()

  return (
    <>
      <h2 className="pb-4">Discussions of {shortenUserId(userId, me)}</h2>
      <DiscussListByUser userId={userId} />
    </>
  )
}

export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext<{ userid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const { userid: userId } = params
  const client = getApolloClientSSR()
  const { data } = await client.query<
    CommitsByUserQuery,
    CommitsByUserQueryVariables
  >({
    query: CommitsByUserDocument,
    variables: { userId },
  })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      protected: true,
      userId,
      queryResult: data,
    },
  }
}

export default UserDiscussionsPage
