import React, { useState } from 'react'
import { CardMetaInput } from 'graphql-let/__generated__/__types__'

import Modal from '../modal/modal'
import CardMetaForm from '../card-meta-form/card-meta-form'
import { Doc } from '../workspace/doc'

const CardHeadMeta = ({
  initialValue,
  onSubmit,
}: {
  initialValue: CardMetaInput
  onSubmit: (input: CardMetaInput) => void
}): JSX.Element => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  return (
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
          initialValue={initialValue}
          onSubmit={onSubmit}
          submitSuccessful={(boo: boolean) => {
            boo && setShowHeaderForm(false)
          }}
        />
      </Modal>
    </>
  )
}

export default CardHeadMeta
