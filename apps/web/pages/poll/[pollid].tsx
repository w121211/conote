import { isNil } from 'lodash'
import moment from 'moment'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import React from 'react'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  PollDocument,
  PollFragment,
  PollQuery,
  PollQueryVariables,
} from '../../apollo/query.graphql'
import NoteDocLink from '../../frontend/components/note/note-doc-link'
import MergePollVoteForm from '../../frontend/components/poll/merge-poll-vote-form'
import { LayoutChildrenPadding } from '../../frontend/components/ui/layout/layout-children-padding'
import UserLink from '../../frontend/components/user/user-link'
import { AppPageProps } from '../../frontend/interfaces'

type Props = AppPageProps & {
  poll: PollFragment
  // discuss: DiscussFragment
  // discussPosts: DiscussPostFragment[]
}

const PollPage = ({ poll }: Props): JSX.Element | null => {
  const { noteDocToMerge } = poll

  if (isNil(noteDocToMerge))
    throw new Error('Currently only support merge poll')

  return (
    <LayoutChildrenPadding>
      <h4 className="mb-4">Merge request</h4>
      <p>
        <NoteDocLink doc={noteDocToMerge} /> wants to merge.
      </p>
      <p className="mb-4">
        Committer <UserLink userId={noteDocToMerge.userId} />{' '}
        <span className="text-sm text-gray-400">
          {moment(poll.createdAt).fromNow()}
        </span>
      </p>
      <MergePollVoteForm poll={poll} />
    </LayoutChildrenPadding>
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

export default PollPage
