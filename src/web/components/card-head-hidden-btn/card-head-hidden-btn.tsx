import React, { useState } from 'react'
import CardHeadMeta from '../card-head-meta/card-head-meta'
import CardMetaForm from '../card-meta-form/card-meta-form'
import Modal from '../modal/modal'
import { Doc } from '../workspace/doc'
import { workspace } from '../workspace/workspace'

const CardHeadHiddenBtn = ({ doc, visible }: { doc: Doc; visible: boolean }) => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)
  return (
    <div className={`flex items-center gap-4 mb-2 ${visible ? 'opacity-100' : 'opacity-0'}`}>
      {doc.cardCopy && (
        <>
          <button
            className={`btn-reset-style inline-flex items-center px-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-200`}
            onClick={() => {
              setShowHeaderForm(true)
            }}
          >
            <span className="material-icons text-base">edit_note</span>
            <span className="whitespace-nowrap text-sm">編輯卡片資訊</span>
          </button>
          <Modal
            visible={showHeaderForm}
            onClose={() => {
              setShowHeaderForm(false)
            }}
          >
            <h2 className="mb-6 text-2xl font-bold text-gray-800">卡片資訊</h2>
            <CardMetaForm
              initialValue={doc.cardCopy.meta}
              onSubmit={input => {
                const { isUpdated } = doc.updateCardMetaInput(input)
                if (isUpdated) {
                  workspace.save(doc)
                }
              }}
              submitSuccessful={(boo: boolean) => {
                boo && setShowHeaderForm(false)
              }}
            />
          </Modal>
        </>
        // <CardHeadMeta initialValue={doc.cardCopy.meta} onSubmit={input => {
        //     const { isUpdated } = doc.updateCardMetaInput(input)
        //     if (isUpdated) {
        //       workspace.save(doc)
        //     }
        //   }}/>
      )}
    </div>
  )
}
export default CardHeadHiddenBtn
