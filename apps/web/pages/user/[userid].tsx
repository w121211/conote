import React from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import {
  CommitsByUserDocument,
  CommitsByUserQuery,
  CommitsByUserQueryVariables,
  DiscussesByUserDocument,
  DiscussesByUserQuery,
  DiscussesByUserQueryVariables,
} from '../../apollo/query.graphql'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import { getNotePageURL, shortenUserId } from '../../frontend/utils'
import { useMeContext } from '../../frontend/components/auth/use-me-context'
import Link from 'next/link'
import SymbolDecorate from '../../frontend/components/symbol/SymbolDecorate'
import moment from 'moment'
import CardList from '../../frontend/components/ui/CardList'
import CommitListByUser from '../../frontend/components/commit/CommitListByUser'
import CommitList from '../../frontend/components/commit/CommitList'
import DiscussListByUser from '../../frontend/components/discuss/DiscussListByUser'
import DiscussList from '../../frontend/components/discuss/DiscussList'
import { AppPageProps } from '../../frontend/interfaces'

interface Props extends AppPageProps {
  userId: string
  commitsByUserQuery: CommitsByUserQuery
  discussesByUserQuery: DiscussesByUserQuery
}

const UserPage = ({
  userId,
  commitsByUserQuery: { commitsByUser },
  discussesByUserQuery: { discussesByUser },
}: Props): JSX.Element | null => {
  const { me } = useMeContext()
  // console.log(noteDocsByUser, discussesByUser)
  // const [showMentionedPopup, setShowMentionedPopup] = useState(false)
  // if (!data === undefined || error || loading) {
  //   return null
  // }

  return (
    <div className="max-w-2xl flex flex-col gap-12 pb-12">
      <div className="flex flex-col">
        {/* <span className="material-icons mr-2 leading-none text-xl text-gray-300 dark:text-gray-400">
            account_circle
          </span> */}

        <div className="truncate">
          <h1>
            {shortenUserId(userId, me)}
            {/* <span className="pl-2 text-gray-500 font-light">/Anonymous</span> */}
          </h1>
          {/* <div className="mb-2 text-lg text-gray-500 dark:text-gray-400">
              Architect
              </div>
              <p className="flex text-sm text-gray-500 dark:text-gray-400">
              <span className="material-icons text-base leading-none">
              cake
              </span>
              10 year member
            </p> */}
        </div>
      </div>

      <div className="dark:bg-gray-800 dark:bowrder-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="leading-none">Commits</h2>
          <Link
            href={{
              pathname: '/user/commits/[userid]',
              query: { userid: userId },
            }}
          >
            <a className="text-sm text-blue-600 hover:underline dark:text-blue-500">
              View all
            </a>
          </Link>
        </div>
        <CommitList commits={commitsByUser.commits} />
      </div>

      <div className="dark:bg-gray-800 dark:bowrder-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="leading-none">Discussions</h2>
          <Link
            href={{
              pathname: '/user/discussions/[userid]',
              query: { userid: userId },
            }}
          >
            <a className="text-sm text-blue-600 hover:underline dark:text-blue-500">
              View all
            </a>
          </Link>
        </div>
        <DiscussList discusses={discussesByUser.discusses} />
      </div>
    </div>
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

  const client = getApolloClientSSR()
  const qDiscusses = await client.query<
    DiscussesByUserQuery,
    DiscussesByUserQueryVariables
  >({
    query: DiscussesByUserDocument,
    variables: { userId },
  })
  const qCommits = await client.query<
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
      commitsByUserQuery: qCommits.data,
      discussesByUserQuery: qDiscusses.data,
    },
  }
}

export default UserPage
