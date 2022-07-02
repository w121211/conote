import React from 'react'
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { getApolloClientSSR } from '../../apollo/apollo-client-ssr'
import {
  CommitDocument,
  CommitFragment,
  CommitQuery,
  CommitQueryVariables,
} from '../../apollo/query.graphql'
import Layout from '../../components/ui-component/layout/layout'
import { getNotePageURL } from '../../components/page-utils'
import Link from 'next/link'
import moment from 'moment'
import UserLink from '../../components/user/user-link'
import { styleSymbol } from '../../components/ui-component/style-fc/style-symbol'
import { LayoutChildrenPadding } from '../../components/ui-component/layout/layout-children-padding'

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
  'rejected_auto-no_changes': 'rejected_auto-no_changes',
  rejected_poll: 'rejected_poll',
  'paused-from_doc_not_head': 'paused-from_doc_not_head',
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
        <a className="link text-xs italic">{styleSymbol(t)}</a>
      </Link>
    )
  }
  return <span className="text-gray-400 text-xs italic">{t}</span>
}

const CommitPage = ({ commit }: Props) => {
  return (
    <LayoutChildrenPadding>
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
                  <Link href={getNotePageURL('doc', e.symbol, e.id)}>
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
    </LayoutChildrenPadding>
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
