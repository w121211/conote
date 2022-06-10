import React, { useEffect } from 'react'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../apollo/query.graphql'
import { getNotePageURL } from '../../shared/note-helpers'
import BlockViewer from '../block-editor/src/components/block/block-viewer'
import Layout from '../ui-component/layout'
import { convertGQLBlocks } from '../../shared/block-helpers'
import NoteHead from './note-head'
import NoteDocVersionDropdown from './note-doc-version-dropdown'

/**
 * View only note-doc
 */
const NoteViewEl = ({
  doc,
  note,
  noteDraft,
  noteDocsToMerge,
}: {
  doc: NoteDocFragment
  note: NoteFragment
  noteDraft: NoteDraftFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const isHeadDoc = doc.id === note.headDoc.id,
    { blocks, docBlock } = convertGQLBlocks(doc.contentBody.blocks)

  return (
    <Layout>
      {/* <NoteAlerts cur={doc} note={note} noteDocsToMerge={noteDocsToMerge} /> */}

      <NoteDocVersionDropdown cur={doc} note={note} noteDraft={noteDraft} />

      <div>
        <Link href={getNotePageURL('edit', note.sym.symbol)}>
          <a>EDIT</a>
        </Link>
      </div>

      <div>{doc.domain}</div>

      <NoteHead symbol={doc.symbol} doc={doc} />

      {/* <div>Content head</div> */}
      {/* <NoteHead /> */}

      <BlockViewer blocks={blocks} uid={docBlock.uid} omitParent />
    </Layout>
  )
}

export default NoteViewEl
