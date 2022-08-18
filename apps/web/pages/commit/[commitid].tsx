import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  CommitDocument,
  CommitFragment,
  CommitQuery,
  CommitQueryVariables,
} from '../../apollo/query.graphql'
import { getNotePageURL } from '../../frontend/utils'
import Link from 'next/link'
import moment from 'moment'
import UserLink from '../../frontend/components/user/user-link'
import { styleSymbol } from '../../frontend/components/ui/style-fc/style-symbol'

interface Props {
  commit: CommitFragment
}

const CommitPage = ({ commit }: Props) => {
  return (
    <>
      <h1 className="mb-1 text-gray-900">Commit #{commit.id.slice(-6)}</h1>
      <div className="text-gray-700">
        by <UserLink userId={commit.userId} />
      </div>
      <div className="text-gray-400 text-sm">
        {moment(commit.createdAt).fromNow()}
      </div>
      <div className="mt-8">
        <ul>
          {commit.noteDocs.map(e => (
            <ol key={e.id} className="flex mb-4">
              <span className="material-icons-outlined mt-0.5 mr-2 text-green-600">
                check_circle
              </span>
              <div>
                <div>
                  <Link href={getNotePageURL(e.symbol, e.id)}>
                    <a>
                      <span className="symbol-link mr-2">
                        {styleSymbol(e.symbol)}
                      </span>
                      <span className="link text-gray-400 text-sm">
                        #{e.id.slice(-6)}
                      </span>
                    </a>
                  </Link>
                </div>
                <MergeStateLabel
                  mergeState={e.meta.mergeState}
                  mergePollId={e.mergePollId ?? undefined}
                />
              </div>
            </ol>
          ))}
        </ul>
      </div>
    </>
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
