import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { CommitFragment } from '../../../apollo/query.graphql'
import { getNotePageURL } from '../../utils'
import SymbolDecorate from '../symbol/SymbolDecorate'

const mergeState_text: Record<string, string | undefined> = {
  before_merge: 'Encounter internal error, merge not proceeded.',
  'wait_to_merge-by_poll': 'A merge poll is open',
  'merged_auto-same_user': 'Auto merged by same-user-rule',
  'merged_auto-initial_commit': 'Auto merged by first-commit-rule',
  'merged_auto-only_insertions': 'Auto merged by only-insertions-rule',
  merged_poll: 'Merged by poll',
  'rejected_auto-no_changes': 'rejected_auto-no_changes',
  rejected_poll: 'rejected_poll',
  'paused-from_doc_not_head': 'paused-from_doc_not_head',
}

export function toMergeComponents(
  mergeState: string,
  mergePollId?: string,
): {
  icon: JSX.Element
  description: JSX.Element
} {
  const t = mergeState_text[mergeState]

  let icon: JSX.Element | undefined
  if (mergeState.startsWith('merged'))
    icon = (
      <span className="material-icons-outlined text-green-500">
        check_circle
      </span>
    )
  if (mergeState.startsWith('rejected'))
    icon = <span className="material-icons-outlined text-gray-500">cancel</span>
  if (mergeState.startsWith('wait_to_merge'))
    icon = (
      <span className="material-icons-outlined text-yellow-500">pending</span>
    )
  if (mergeState.startsWith('paused'))
    icon = (
      <span className="material-icons-outlined text-yellow-500">
        error_outline
      </span>
    )
  if (mergeState === 'before_merge')
    icon = (
      <span className="material-icons-outlined text-yellow-500">
        error_outline
      </span>
    )
  if (icon === undefined) throw new Error('icon === undefined, ' + mergeState)

  let description: JSX.Element
  if (t === undefined) {
    throw new Error('t === undefined, ' + mergeState)
  }
  if (mergeState.startsWith('wait_to_merge')) {
    if (mergePollId) {
      description = (
        <Link
          href={{ pathname: '/merge/[pollid]', query: { pollid: mergePollId } }}
        >
          <a className="link">{t}</a>
        </Link>
      )
    } else {
      throw new Error('Merge poll id not found')
    }
  } else {
    description = <>{t}</>
  }

  return { icon, description }
}

const CommitListItem = ({ commit }: { commit: CommitFragment }) => (
  <div>
    <div className="py-1">
      <p className="text-sm text-gray-500 italic dark:text-gray-400">
        {moment(commit.createdAt).format('L')}
      </p>
    </div>

    <ul role="list">
      {commit.noteDocs.map(({ id, symbol, meta, contentHead, mergePollId }) => {
        const { icon, description } = toMergeComponents(
          meta.mergeState,
          mergePollId ?? undefined,
        )
        return (
          <li key={id}>
            <div className="flex items-center space-x-2 py-2">
              <div className="flex-shrink-0 mt-0.5 mr-2">{icon}</div>
              <div className="flex-1 min-w-0">
                <Link href={getNotePageURL(symbol, id)}>
                  <a className="text-base font-base text-blue-600 dark:text-white hover:underline">
                    <SymbolDecorate
                      symbol={symbol}
                      title={contentHead.title}
                      id={id}
                    />
                  </a>
                </Link>
                <p className="text-sm text-gray-500 truncate italic dark:text-gray-400">
                  {description}
                </p>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  </div>
)

interface Props {
  commits: CommitFragment[]
}

const CommitList = ({ commits }: Props) => {
  return (
    <div className="w-full dark:bg-gray-800 dark:border-gray-700">
      {/* <div className="flex justify-between items-center mb-2">
        <h2 className="leading-none">Commits</h2>
        <a
          href="#"
          className="text-sm text-blue-600 hover:underline dark:text-blue-500"
        >
          View all
        </a>
      </div> */}
      <div>
        {commits.length > 0 ? (
          <ul
            role="list"
            className="divide-y divide-gray-200 dark:divide-gray-700"
          >
            {commits.map(e => (
              <li key={e.id} className="py-2 sm:py-3">
                <div className="flex items-center space-x-4">
                  <CommitListItem commit={e} />
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic">Empty :{'('}</p>
        )}
      </div>
    </div>
  )
}

export default CommitList
