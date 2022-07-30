import Link from 'next/link'
import React, { useState } from 'react'
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
  const [showAlert, setShowAlert] = useState(true)
  const [showWarning, setShowWarning] = useState(true)
  return (
    <div className="flex flex-col gap-2 mb-4">
      {cur.__typename === 'NoteDoc' && note && cur.id !== note.headDoc.id && (
        <Alert
          type="warning"
          visible={showWarning}
          onClose={() => {
            setShowWarning(false)
          }}
        >
          The current viewing doc is not the head.
        </Alert>
      )}
      {noteDocsToMerge.length > 0 && (
        <Alert
          type="announce"
          visible={showAlert}
          onClose={() => {
            setShowAlert(false)
          }}
        >
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
          <p>fasdf</p>
        </Alert>
      )}
    </div>
  )
}

export default NoteAlerts
