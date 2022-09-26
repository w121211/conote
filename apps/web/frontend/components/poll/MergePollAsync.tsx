import { isNil } from 'lodash'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { usePollQuery } from '../../../apollo/query.graphql'
import { useMeContext } from '../auth/use-me-context'
import NoteDocLink from '../note/note-doc-link'
import MergePollVoteForm from './merge-poll-vote-form'

const MergePollAsync = ({
  mergePollId,
}: {
  mergePollId: string
}): JSX.Element | null => {
  const { me } = useMeContext()
  const { data, loading } = usePollQuery({
    variables: { id: mergePollId },
  })

  if (me === null)
    return (
      <div className="py-5">
        <span className="pr-3">Login to proceed.</span>
        <Link href={{ pathname: '/login', query: { from: location.pathname } }}>
          <a className="link">Login</a>
        </Link>
      </div>
    )

  if (loading) return null
  if (data === undefined) throw new Error('data === undefined')

  const { poll } = data,
    { noteDocToMerge } = poll

  if (isNil(noteDocToMerge))
    throw new Error('Meanwhile the site only support merge poll')

  return (
    <>
      <h3 className="mb-4">Merge Request</h3>
      <p>
        <NoteDocLink doc={noteDocToMerge} /> is requesting to merge. {'('}
        {moment(poll.createdAt).fromNow()}
        {')'}
      </p>

      <p className="mb-4 text-sm text-gray-400">
        {/* Committer <UserLink userId={noteDocToMerge.userId} />{' '} */}
        {/* <span className="material-icons-outlined mr-1 text-sm align-middle">
          schedule
        </span> */}
      </p>
      <MergePollVoteForm poll={poll} />
    </>
  )
}

export default MergePollAsync
