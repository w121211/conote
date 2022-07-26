import Link from 'next/link'
import React from 'react'
import type {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../../apollo/query.graphql'
import { Alert } from '../ui-component/alert'
import NoteDocLink from './note-doc-link'

/**
 * Show alert cases
 * - If current viewing doc is not the head
 * - If there are docs waiting to merge
 *
 * TODO
 * - Remember user's action?
 */
const NoteAlerts = ({
  cur,
  note,
  noteDocsToMerge,
}: {
  cur: NoteDocFragment | NoteDraftFragment
  note: NoteFragment | null
  noteDocsToMerge: NoteDocFragment[]
}) => {
  return (
    <div className="mb-4">
      {cur.__typename === 'NoteDoc' && note && cur.id !== note.headDoc.id && (
        <div>The current viewing doc is not the head.</div>
      )}
      {noteDocsToMerge.length > 0 && (
        <Alert type="announce">
          {noteDocsToMerge.map(e => {
            if (e.mergePollId === undefined)
              throw new Error('e.mergePollId === undefined')
            return (
              <p key={e.id}>
                <NoteDocLink doc={e} /> is requesting to merge.
                <Link href={`/poll/${e.mergePollId}`}>
                  <a className="link">Go to Poll</a>
                </Link>
              </p>
            )
          })}
        </Alert>
      )}
    </div>
  )
}

export default NoteAlerts
