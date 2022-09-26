import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
  useNoteDocsToMergeByNoteQuery,
} from '../../../apollo/query.graphql'
import { getDraftPageURL, getNotePageURL } from '../../utils'
import ToggleMenu from '../ui/toggle-menu'

/**
 * Only show if note is created
 */
const NoteDocVersionDropdown = ({
  cur,
  note,
  noteDraft,
}: {
  cur: NoteDocFragment | NoteDraftFragment | null
  note: NoteFragment
  noteDraft: NoteDraftFragment | null
}): JSX.Element => {
  const { symbol } = note.sym
  const qDocsToMerge = useNoteDocsToMergeByNoteQuery({
    variables: { noteId: note.id },
  })
  const [hide, setHide] = useState(true)

  let curLabel = ''
  if (cur === null || cur.__typename === 'NoteDraft') {
    curLabel = 'Draft'
  } else if (cur.__typename === 'NoteDoc') {
    curLabel = cur.id === note.headDoc.id ? 'Head' : cur.id.slice(-6)
  }

  return (
    <ToggleMenu
      className="left-full -translate-x-full"
      summary={
        <span className="btn-normal flex items-center text-sm">
          {curLabel}
          <span className="material-icons-outlined ml-1 text-lg leading-none">
            keyboard_arrow_down
          </span>
        </span>
      }
    >
      <ul>
        {noteDraft && (
          <Link href={getDraftPageURL(noteDraft.id)}>
            <a className="dropdown-list-item">Draft</a>
          </Link>
        )}
        {note && (
          <Link href={getNotePageURL(symbol)}>
            <a className="dropdown-list-item">Head</a>
          </Link>
        )}
        {qDocsToMerge.data &&
          qDocsToMerge.data.noteDocsToMergeByNote.map(e => (
            <Link href={getNotePageURL(symbol, e.id)} key={e.id}>
              <a className="dropdown-list-item" href="#">
                #{e.id.slice(-6)}
              </a>
            </Link>
          ))}
      </ul>
    </ToggleMenu>
  )
}

export default NoteDocVersionDropdown
