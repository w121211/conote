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
import { parseGQLBlocks } from '../../shared/block-helpers'
import NoteHead from './note-head'
import NoteDocVersionDropdown from './note-doc-version-dropdown'
import { Badge } from '../ui-component/badge'
import NoteAlerts from './note-alerts'
// import { NoteDocVersionDropdown } from '../domain/domain-select'

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
    { blocks, docBlock } = parseGQLBlocks(doc.contentBody.blocks)

  return (
    <div className="pb-32">
      <NoteAlerts cur={doc} note={note} noteDocsToMerge={noteDocsToMerge} />

      <div className="flex">
        <div className="flex-1 flex items-stretch">
          <span className="self-center">{doc.domain}</span>

          <div className="w-[1px] mx-3 border-l border-gray-200"></div>

          <Link href={getNotePageURL('edit', note.sym.symbol)}>
            <a className="btn-primary-md">EDIT</a>
          </Link>
        </div>

        <NoteDocVersionDropdown cur={doc} note={note} noteDraft={noteDraft} />
      </div>

      <div className="-ml-4">
        <NoteHead symbol={doc.symbol} doc={doc} />

        {/* <div>Content head</div> */}
        {/* <NoteHead /> */}

        <BlockViewer blocks={blocks} uid={docBlock.uid} omitParent />
      </div>
    </div>
  )
}

export default NoteViewEl
