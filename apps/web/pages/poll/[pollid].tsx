import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  PollDocument,
  PollFragment,
  PollQuery,
  PollQueryVariables,
} from '../../apollo/query.graphql'
import Layout from '../../components/ui-component/layout'
import { isNil } from 'lodash'
import MergePollVoteForm from '../../components/poll/merge-poll-vote-form'
import NoteDocLink from '../../components/note/note-doc-link'
import UserLink from '../../components/user/user-link'
import moment from 'moment'
import { Alert } from '../../components/ui-component/alert'
import { useMeContext } from '../../components/auth/use-me-context'

interface Props {
  poll: PollFragment
  // discuss: DiscussFragment
  // discussPosts: DiscussPostFragment[]
}

const PollPage = ({ poll }: Props): JSX.Element | null => {
  const { noteDocToMerge } = poll,
    { me } = useMeContext()

  if (isNil(noteDocToMerge))
    throw new Error('Currently only support merge poll')

  return (
    <Layout>
      {me === null && <Alert str="Require login to vote" type="warning" />}
      <h4>Merge request</h4>
      <p>
        <NoteDocLink doc={noteDocToMerge} /> wants to merge.
      </p>
      <p>
        Committer <UserLink userId={noteDocToMerge.userId} />{' '}
        {moment(poll.createdAt).fromNow()}
      </p>
      <MergePollVoteForm poll={poll} />
    </Layout>
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
      poll: qPoll.data.poll,
      // discuss: qPoll.data.poll.discuss,
      // discussPosts: qPosts.data.discussPosts,
    },
  }
}

export default PollPage
