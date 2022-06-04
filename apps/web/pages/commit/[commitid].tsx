import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  CommitDocument,
  CommitFragment,
  CommitQuery,
  CommitQueryVariables,
} from '../../apollo/query.graphql'
import Layout from '../../components/ui-component/layout'

interface Props {
  commit: CommitFragment
}

const CommitPage = ({ commit }: Props) => {
  return (
    <Layout>
      <div></div>
    </Layout>
  )
}

export async function getServerSideProps({
  res,
  params,
}: GetServerSidePropsContext<{ commitid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')

  const client = getApolloClientSSR(),
    qCommit = await client.query<CommitQuery, CommitQueryVariables>({
      query: CommitDocument,
      variables: { id: params.commitid },
    })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      commit: qCommit.data.commit,
    },
  }
}
export default CommitPage
