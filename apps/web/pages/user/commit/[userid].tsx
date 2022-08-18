import moment from 'moment'
import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import Link from 'next/link'
import {
  CommitFragment,
  CommitsByUserDocument,
  CommitsByUserQuery,
  CommitsByUserQueryVariables,
} from '../../../apollo/query.graphql'
import { getApolloClientSSR } from '../../../apollo/apollo-client-ssr'
import { shortenUserId } from '../../../frontend/utils'
import { useMeContext } from '../../../frontend/components/auth/use-me-context'
import CommitList from '../../../frontend/components/commit/CommitList'

interface Props {
  userId: string
  commitsByUser: CommitFragment[]
}

const UserCommitPage = ({ userId, commitsByUser }: Props) => {
  const { me } = useMeContext()

  return (
    <>
      <div className="flex flex-col gap-12">
        <div className="flex flex-col">
          {/* <span className="material-icons mr-2 leading-none text-xl text-gray-300 dark:text-gray-400">
            account_circle
          </span> */}

          <div className="truncate">
            <h1 className="text-4xl">
              {shortenUserId(userId, me)}
              <span className="pl-3 text-gray-500 font-light">Anonymous</span>
            </h1>

            <CommitList commits={commitsByUser} />
          </div>
        </div>
      </div>
    </>
  )
}

/**
 * TODO:
 * - Currently draft is not able for server-side rendering
 *   because apollo's schema-link does not have 'request' which session data stored in it
 */
export async function getServerSideProps({
  params,
  res,
}: GetServerSidePropsContext<{ userid: string }>): Promise<
  GetServerSidePropsResult<Props>
> {
  if (params === undefined) throw new Error('params === undefined')
  const { userid: userId } = params

  const client = getApolloClientSSR(),
    qCommits = await client.query<
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
      userId,
      commitsByUser: qCommits.data.commitsByUser,
    },
  }
}

export default UserCommitPage
