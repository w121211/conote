import React, { useState } from 'react'
import { AuthorFragment, useAuthorQuery } from '../apollo/query.graphql'
import AuthorMetaForm from './author-meta-form'
import Modal from './modal/modal'
import { Doc } from './workspace/doc'

const AuthorMetaModal = ({ data, modal }: { data: AuthorFragment; modal?: boolean }) => {
  const [showModal, setShowModal] = useState(false)

  return (
    <React.Fragment>
      <button
        className={`btn-reset-style p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100`}
        onClick={() => {
          setShowModal(true)
        }}
      >
        <span className={`material-icons !leading-none ${modal ? 'text-lg' : 'text-xl'}`}>edit_note</span>
        {/* <span className="whitespace-nowrap text-sm">編輯卡片資訊</span> */}
      </button>

      <Modal
        visible={showModal}
        onClose={() => {
          setShowModal(false)
        }}
        mask={false}
      >
        <div className="px-2 md:px-4">
          <h2 className="text-lg mb-4 sm:mb-6 sm:text-2xl font-bold text-gray-800">卡片資訊</h2>
          <AuthorMetaForm
            id={data.id}
            data={data}
            onUpdated={input => {
              // const { isUpdated } = doc.updateNoteMetaInput(input)
              // if (isUpdated) {
              //   doc.save()
              //   setShowModal(false)
              // } else {
              //   console.warn('note meta input not updated, skip saving')
              // }
            }}
          />
        </div>
      </Modal>
    </React.Fragment>
  )
}

export default AuthorMetaModal
