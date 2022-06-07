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
import { getNotePageURL } from '../../shared/note-helpers'
import Link from 'next/link'

interface Props {
  commit: CommitFragment
}

const CommitPage = ({ commit }: Props) => {
  return (
    <Layout>
      <h1>Commit #{commit.id.slice(-6)}</h1>
      <span>
        @{commit.userId} {commit.createdAt}
      </span>
      <div>
        <ul>
          {commit.noteDocs.map(e => (
            <ol key={e.id}>
              <span>
                <Link href={getNotePageURL('doc', e.symbol, e.id)}>
                  <a>
                    {e.symbol}
                    <span>#{e.id.slice(-6)}</span>
                  </a>
                </Link>
                ({e.meta.mergeState})
              </span>
            </ol>
          ))}
        </ul>
      </div>
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
