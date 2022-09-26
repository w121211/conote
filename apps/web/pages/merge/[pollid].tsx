import { isNil } from 'lodash'
import moment from 'moment'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import Link from 'next/link'
import React from 'react'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  PollDocument,
  PollFragment,
  PollQuery,
  PollQueryVariables,
} from '../../apollo/query.graphql'
import { useMeContext } from '../../frontend/components/auth/use-me-context'
import MergePollVoteForm from '../../frontend/components/poll/merge-poll-vote-form'
import { AppPageProps } from '../../frontend/interfaces'
import { getNotePageURL, shortenUserId } from '../../frontend/utils'

type Props = AppPageProps & {
  poll: PollFragment
  // discuss: DiscussFragment
  // discussPosts: DiscussPostFragment[]
}

const MergePage = ({ poll }: Props): JSX.Element | null => {
  const { me } = useMeContext()
  const { noteDocToMerge } = poll

  if (isNil(noteDocToMerge))
    throw new Error('Currently only support merge poll')

  return (
    <>
      <h1 className="mt-6 mb-4">
        <span className="material-icons-outlined text-3xl align-bottom">
          merge
        </span>{' '}
        Merge Request
      </h1>

      <div className="flex flex-col pb-4 gap-3 text-gray-800 dark:text-gray-400">
        <p>
          <span className="material-icons-outlined align-bottom mr-1">
            description
          </span>
          <Link href={getNotePageURL(noteDocToMerge.symbol, noteDocToMerge.id)}>
            <a className="link">
              {noteDocToMerge.symbol}#{noteDocToMerge.id.slice(-6)}
            </a>
          </Link>

          <span className="text-gray-500 italic">
            {' '}
            Click to see differences
          </span>
        </p>

        <p>
          <span className="material-icons-outlined align-bottom mr-1">
            person
          </span>
          <Link
            href={{
              pathname: '/user/[userid]',
              query: { userid: noteDocToMerge.userId },
            }}
          >
            <a className="link">{shortenUserId(noteDocToMerge.userId, me)}</a>
          </Link>
        </p>

        <p className="text-gray-600">
          <span className="material-icons-outlined align-bottom mr-1">
            schedule
          </span>
          {moment(poll.createdAt).fromNow()}
        </p>
      </div>

      <MergePollVoteForm poll={poll} />
    </>
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

  // if (isNil(qPoll.data.poll.discuss))
  //   throw new Error('qPoll.data.poll.discuss is NIL')

  // const qPosts = await client.query<
  //   DiscussPostsQuery,
  //   DiscussPostsQueryVariables
  // >({
  //   query: DiscussPostsDocument,
  //   variables: { discussId: qPoll.data.poll.discuss.id },
  // })

  res.setHeader(
    'Cache-Control',
    'public, s-maxage=200, stale-while-revalidate=259',
  )
  return {
    props: {
      protected: true,
      poll: qPoll.data.poll,
      // discuss: qPoll.data.poll.discuss,
      // discussPosts: qPosts.data.discussPosts,
    },
  }
}

export default MergePage
