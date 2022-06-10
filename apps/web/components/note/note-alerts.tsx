import React, { useEffect } from 'react'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../apollo/query.graphql'

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
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  return (
    <div>
      {cur.__typename === 'NoteDoc' && note && cur.id !== note.headDoc.id && (
        <div>The current viewing doc is not the head.</div>
      )}
      {noteDocsToMerge && noteDocsToMerge.length > 0 && (
        <div>
          {noteDocsToMerge.map(e => (
            <span key={e.id}>
              Doc <NoteDocLink doc={e} />
            </span>
          ))}
          is/are waiting to merge.
        </div>
      )}
    </div>
  )
}

export default NoteAlerts
