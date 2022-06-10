import React, { useEffect } from 'react'
import Link from 'next/link'
import { NoteDocFragment, NoteFragment } from '../../apollo/query.graphql'
import { getNotePageURL } from './note-helpers'
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
  noteDocsToMerge,
}: {
  doc: NoteDocFragment
  note: NoteFragment
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const isHeadDoc = doc.id === note.headDoc.id,
    { blocks, docBlock } = convertGQLBlocks(doc.contentBody.blocks)

  return (
    <Layout>
      {/* <NoteAlerts cur={doc} note={note} noteDocsToMerge={noteDocsToMerge} /> */}

      <NoteDocVersionDropdown cur={doc} note={note} />

      <div>
        <Link href={getNotePageURL('edit', note.sym.symbol)}>
          <a>Edit</a>
        </Link>
      </div>

      <NoteHead symbol={doc.symbol} doc={doc} />

      {/* <div>Content head</div> */}
      {/* <NoteHead /> */}

      <BlockViewer blocks={blocks} uid={docBlock.uid} />
    </Layout>
  )
}

export default NoteViewEl
