import React, { useState } from 'react'
import Link from 'next/link'
import { differenceBlocks, parseGQLBlocks } from '../../../share/utils'
import { getDraftPageURLBySymbol } from '../../utils'
import NoteDocAlerts from './NoteDocAlerts'
import NoteDocHead from './NoteDocHead'
import NoteDocVersionDropdown from './note-doc-version-dropdown'
import BlocksViewer from '../editor-textarea/src/components/block/BlocksViewer'
import { NoteDocElProps } from '../../interfaces'
import Modal from '../modal/modal'
import MergePollAsync from '../poll/MergePollAsync'

/**
 * Read only note doc
 */
const NoteDocEl = (props: NoteDocElProps) => {
  const { doc, note } = props,
    isHeadDoc = doc.id === note.headDoc.id,
    { blocks } = parseGQLBlocks(doc.contentBody.blocks),
    { blocks: headBlocks } = parseGQLBlocks(note.headDoc.contentBody.blocks)
  const [showModal, setShowModal] = useState(false)
  const diff = differenceBlocks(blocks, headBlocks)

  return (
    <>
      <Modal visible={showModal} onClose={() => setShowModal(false)}>
        {doc.mergePollId && (
          <div className="w-full px-4 md:py-6 md:px-10">
            <MergePollAsync mergePollId={doc.mergePollId} />
          </div>
        )}
      </Modal>

      <div className="pb-32">
        <div className="flex flex-col gap-2 mb-4">
          <NoteDocAlerts
            {...{ ...props, setShowMergePollModal: setShowModal }}
          />
        </div>

        <div className="flex mb-2 space-x-2">
          {/* <div className="flex-1 flex items-stretch">
            <span className="self-center">{doc.domain}</span>
            <div className="w-[1px] mx-3 border-l border-gray-200"></div>
          </div> */}

          <NoteDocVersionDropdown cur={doc} note={note} noteDraft={null} />

          <Link href={getDraftPageURLBySymbol(note.sym.symbol)}>
            <a className="btn-secondary text-sm">EDIT</a>
          </Link>
        </div>

        <NoteDocHead
          symbol={doc.symbol}
          doc={doc}
          isHeadDoc={isHeadDoc}
          setShowMergePollModal={setShowModal}
        />
        <BlocksViewer blocks={blocks} />
      </div>
    </>
  )
}

export default NoteDocEl
