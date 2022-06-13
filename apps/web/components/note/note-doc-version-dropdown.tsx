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
      summary={<span className="btn-normal-md">{curLabel}</span>}
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
    // <>
    //   <button
    //     id="dropdownDefault"
    //     // data-dropdown-toggle="dropdown"
    //     className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
    //     type="button"
    //     onClick={() => setHide(!hide)}
    //   >
    //     {curLabel + ' '}
    //     {/* <svg
    //       className="w-4 h-4 ml-2"
    //       fill="none"
    //       stroke="currentColor"
    //       viewBox="0 0 24 24"
    //       xmlns="http://www.w3.org/2000/svg"
    //     >
    //       <path
    //         stroke-linecap="round"
    //         stroke-linejoin="round"
    //         stroke-width="2"
    //         d="M19 9l-7 7-7-7"
    //       ></path>
    //     </svg> */}
    //   </button>
    //   <div
    //     className={`z-10 ${
    //       hide ? 'hidden ' : ''
    //     }bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700`}
    //   >
    //     <ul
    //       className="py-1 text-sm text-gray-700 dark:text-gray-200"
    //       aria-labelledby="dropdownDefault"
    //     >
    //       {noteDraft && (
    //         <li>
    //           <Link href={getNotePageURL('edit', symbol)}>
    //             <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
    //               Draft
    //             </a>
    //           </Link>
    //         </li>
    //       )}

    //       {note && (
    //         <li>
    //           <Link href={getNotePageURL('view', symbol)}>
    //             <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
    //               Head
    //             </a>
    //           </Link>
    //         </li>
    //       )}

    //       {qDocsToMerge.data &&
    //         qDocsToMerge.data.noteDocsToMergeByNote.map(e => (
    //           <li key={e.id}>
    //             <Link href={getNotePageURL('doc', symbol, e.id)}>
    //               <a
    //                 href="#"
    //                 className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
    //               >
    //                 #{e.id.slice(-6)}
    //               </a>
    //             </Link>
    //           </li>
    //         ))}
    //     </ul>
    //   </div>
    // </>
  )
}

export default NoteDocVersionDropdown
