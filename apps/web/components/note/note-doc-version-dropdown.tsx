import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
  useNoteDocsToMergeByNoteQuery,
} from '../../apollo/query.graphql'
import { getNotePageURL } from '../../shared/note-helpers'
import { DropdownListItem } from '../ui-component/dropdown-list-item'
import ToggleMenu from '../ui-component/toggle-menu'

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
  const { symbol } = note.sym,
    qDocsToMerge = useNoteDocsToMergeByNoteQuery({
      variables: { noteId: note.id },
    }),
    [hide, setHide] = useState(true)

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
        <span className="btn-normal-md flex items-center">
          {curLabel}
          <span className="material-icons-outlined ml-1 text-lg leading-none">
            keyboard_arrow_down
          </span>
        </span>
      }
    >
      <ul>
        {noteDraft && (
          <DropdownListItem>
            <Link href={getNotePageURL('edit', symbol)}>
              <a>Draft</a>
            </Link>
          </DropdownListItem>
        )}
        {note && (
          <DropdownListItem>
            <Link href={getNotePageURL('view', symbol)}>
              <a>Head</a>
            </Link>
          </DropdownListItem>
        )}
        {qDocsToMerge.data &&
          qDocsToMerge.data.noteDocsToMergeByNote.map(e => (
            <DropdownListItem key={e.id}>
              <Link href={getNotePageURL('doc', symbol, e.id)}>
                <a href="#">#{e.id.slice(-6)}</a>
              </Link>
            </DropdownListItem>
          ))}
      </ul>
    </ToggleMenu>
  )
}

export default NoteDocVersionDropdown
