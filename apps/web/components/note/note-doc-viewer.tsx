import Link from 'next/link'
import React from 'react'
import {
  NoteDocFragment,
  useNoteByBranchSymbolQuery,
  useNoteByIdQuery,
  useNoteDocQuery,
  useNoteDocsToMergeByNoteQuery,
} from '../../apollo/query.graphql'

const NoteDocsToMergeWarnning = ({
  docsToMerge,
}: {
  docsToMerge: {
    id: string
    createdAt: Date
    mergePollId: string
  }[]
}) => {}

const NotHeadDocWarnning = () => {
  return <div>You are viewing doc #12345 is behind the head</div>
}

const NoteDocsToMergeDropdown = ({
  symbol,
  draft,
  headDoc,
  docsToMerge,
}: {
  symbol: string
  draft?: {
    id: string
  }
  headDoc?: {
    id: string
  }
  docsToMerge: {
    id: string
    createdAt: Date
  }[]
}): JSX.Element => {
  return (
    <div>
      {draft && (
        <Link href={`/note/${symbol}?draft`}>
          <a>Draft</a>
        </Link>
      )}
      {headDoc && (
        <Link href={`/note/${symbol}?head`}>
          <a>Head</a>
        </Link>
      )}
      {docsToMerge.map(e => (
        <Link key={e.id} href={`/note/${symbol}/doc/${e.id}`}>
          <a>{e.id}</a>
        </Link>
      ))}
    </div>
  )
}

const NoteDocViewer = ({
  docId,
  symbol,
}: {
  docId: string
  symbol: string
  // doc: NoteDocFragment
}): JSX.Element | null => {
  const { data: noteData } = useNoteByBranchSymbolQuery({
      variables: { branch: 'default', symbol: symbol },
    }),
    { data: noteDocData } = useNoteDocQuery({
      variables: { id: docId },
    }),
    { data: docsToMergeData } = useNoteDocsToMergeByNoteQuery({
      variables: { noteId: doc.noteId },
    })

  if (noteData === undefined || noteDocData === undefined) {
    return null
  }
  if (noteData.noteByBranchSymbol === undefined) {
    throw new Error('Note not found')
  }

  const { sym, noteDoc: headDoc } = noteData.noteById
  // warnDocsWaitToMerge = [],
  // warnViewD

  return (
    <div>
      <div>Warnnings</div>
      <div>
        Dropdown of versions
        {docsToMergeData && (
          <NoteDocsToMergeDropdown
            symbol={sym.symbol}
            headDoc={headDoc}
            docsToMerge={docsToMergeData.noteDocsToMergeByNote}
          />
        )}
      </div>
      <div>Note head (content-head is viewable but not editable)</div>
      <div>Note content</div>
    </div>
  )
}

export default NoteDocViewer
