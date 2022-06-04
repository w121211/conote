import React, { useState } from 'react'
import Modal from './modal/modal'
import NoteMetaForm from './note-meta-form/note-meta-form'
import { Doc } from './workspace/doc'

const NoteMetaModal = ({ doc, modal }: { doc: Doc; modal?: boolean }) => {
  const [showModal, setShowModal] = useState(false)
  const symbol = doc.getSymbol()
  const metaInput = doc.getNoteMetaInput()
  return (
    <React.Fragment>
      <button
        className={` p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100`}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <span
          className={`material-icons !leading-none ${
            modal ? 'text-lg' : 'text-xl'
          }`}
        >
          edit_note
        </span>
        {/* <span className="whitespace-nowrap text-sm">編輯卡片資訊</span> */}
      </button>

      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        mask={!modal}
      >
        <div className="px-2 md:px-4">
          <h2 className="text-lg mb-4 sm:mb-6 sm:text-2xl font-bold text-gray-800">
            卡片資訊
          </h2>
          <NoteMetaForm
            type={doc.noteCopy?.sym.type || symbol}
            metaInput={metaInput}
            onSubmit={input => {
              const { isUpdated } = doc.updateNoteMetaInput(input)
              if (isUpdated) {
                doc.save()
                setShowModal(false)
              } else {
                console.warn('note meta input not updated, skip saving')
              }
            }}
          />
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default NoteMetaModal
