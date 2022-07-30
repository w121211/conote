import Link from 'next/link'
import React from 'react'
import type {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../../apollo/query.graphql'
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
    <div>
      {cur.__typename === 'NoteDoc' && note && cur.id !== note.headDoc.id && (
        <div>The current viewing doc is not the head.</div>
      )}
      {noteDocsToMerge.length > 0 && (
        <div>
          {noteDocsToMerge.map(e => {
            if (e.mergePollId === undefined)
              throw new Error('e.mergePollId === undefined')
            return (
              <span key={e.id}>
                <NoteDocLink doc={e} />
                is requesting to merge.
                <Link href={`/poll/${e.mergePollId}`}>
                  <a>Go to Poll</a>
                </Link>
              </span>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NoteAlerts
