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
import moment from 'moment'
import UserLink from '../../components/user/user-link'

interface Props {
  commit: CommitFragment
}

const mergeState_text: Record<string, string | undefined> = {
  before_merge: '',
  'wait_to_merge-by_poll': 'A merge poll is open',
  'merged_auto-same_user': 'Auto merged (same user rule)',
  'merged_auto-initial_commit': 'Auto merged (first commit rule)',
  'merged_auto-only_insertions': 'Auto merged (only insertions rule)',
  merged_poll: 'Merged by poll',
  'rejected_auto-no_changes': '',
  rejected_poll: '',
  'paused-from_doc_not_head': '',
}

const MergeStateLabel = ({
  mergeState,
  mergePollId,
}: {
  mergeState: string
  mergePollId?: string
}): JSX.Element => {
  const t = mergeState_text[mergeState]

  if (t === undefined)
    throw new Error('[reableMergeState] Merge state not found')

  if (mergePollId) {
    return (
      <Link href={`/poll/${mergePollId}`}>
        <a>{t}</a>
      </Link>
    )
  }
  return <>{t}</>
}

const CommitPage = ({ commit }: Props) => {
  return (
    <div>
      <h1>Commit #{commit.id.slice(-6)}</h1>
      <div>
        by <UserLink userId={commit.userId} />
      </div>
      <div>{moment(commit.createdAt).fromNow()}</div>
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
                <MergeStateLabel
                  mergeState={e.meta.mergeState}
                  mergePollId={e.mergePollId ?? undefined}
                />
              </span>
            </ol>
          ))}
        </ul>
      </div>
    </div>
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
