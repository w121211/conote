import React from 'react'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../../apollo/query.graphql'
import { differenceBlocks, parseGQLBlocks } from '../../../share/utils'
import { getDraftPageURLBySymbol } from '../../utils'
import { LayoutChildrenPadding } from '../ui-component/layout/layout-children-padding'
import NoteAlerts from './note-alerts'
import NoteHead from './note-head'
import NoteDocVersionDropdown from './note-doc-version-dropdown'

/**
 * Read only note doc
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
  noteDocsToMerge: NoteDocFragment[]
}) => {
  const isHeadDoc = doc.id === note.headDoc.id,
    { blocks, docBlock } = parseGQLBlocks(doc.contentBody.blocks),
    { blocks: headBlocks } = parseGQLBlocks(note.headDoc.contentBody.blocks)

  const diff = differenceBlocks(blocks, headBlocks)

  return (
    <LayoutChildrenPadding>
      <div className="pb-32">
        <NoteAlerts cur={doc} note={note} noteDocsToMerge={noteDocsToMerge} />

        <div className="flex mb-2 space-x-2">
          {/* <div className="flex-1 flex items-stretch">
            <span className="self-center">{doc.domain}</span>
            <div className="w-[1px] mx-3 border-l border-gray-200"></div>
          </div> */}

          <NoteDocVersionDropdown cur={doc} note={note} noteDraft={noteDraft} />

          <Link href={getDraftPageURLBySymbol(note.sym.symbol)}>
            <a className="btn-secondary text-sm">EDIT</a>
          </Link>
        </div>

        <div className="ml-4">
          <NoteHead symbol={doc.symbol} doc={doc} isHeadDoc={isHeadDoc} />
          {/* <BlockViewer blocks={blocks} uid={docBlock.uid} omitParent /> */}
        </div>
      </div>
    </LayoutChildrenPadding>
  )
}

export default NoteViewEl
