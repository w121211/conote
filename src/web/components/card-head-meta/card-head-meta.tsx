import React, { useState } from 'react'
import { CardMetaInput } from 'graphql-let/__generated__/__types__'
import { CardFragment, useCardQuery } from '../../apollo/query.graphql'
import CardMetaForm from '../card-meta-form/card-meta-form'
import Modal from '../modal/modal'
import Popover from '../popover/popover'

const CardHeadMeta = ({
  cardId,
  initialValue,
  // selfCard,
  onSubmit,
  showBtn,
}: {
  cardId: string
  initialValue: CardMetaInput
  // selfCard?: CardFragment
  onSubmit: (input: CardMetaInput) => void
  showBtn?: boolean
}): JSX.Element => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  const { data: cardData } = useCardQuery({
    variables: { id: cardId },
  })

  return (
    <>
      <button
        className={`btn-reset-style inline-flex items-center text-gray-500 hover:text-gray-700 ${
          showBtn ? 'opacity-100' : 'opacity-0'
        }`}
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
          cardId={cardId}
          initialValue={{
            author: initialValue?.author ?? '',
            title: initialValue?.title ?? '',
            url: initialValue?.url ?? '',
            keywords:
              initialValue?.keywords?.map(e => {
                return { label: e, value: e }
              }) ?? [],
            redirects: initialValue?.redirects?.join(' ') ?? '',
            duplicates: initialValue?.duplicates?.join(' ') ?? '',
            description: '',
            date: '',
          }}
          // onSubmitted={onSubmit}
        />
      </Modal>
    </>
  )
}

export default CardHeadMeta
