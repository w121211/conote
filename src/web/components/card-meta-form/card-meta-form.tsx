import React, { useState } from 'react'
import { CardFragment, useCardQuery } from '../../apollo/query.graphql'
import HeaderForm from '../header-form/header-form'
import Modal from '../modal/modal'
import Popover from '../popover/popover'

const CardMetaForm = ({
  cardId,
  selfCard,
  handleCardMetaSubmitted,
  showBtn,
}: {
  cardId: string
  selfCard?: CardFragment
  handleCardMetaSubmitted: (isSubmitted: boolean) => void
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
        <span className="material-icons">edit_note</span>
        <span className="whitespace-nowrap">編輯卡片資訊</span>
      </button>
      <Modal
        visible={showHeaderForm}
        onClose={() => {
          setShowHeaderForm(false)
        }}
      >
        <HeaderForm
          cardId={cardId}
          initialValue={{
            author: cardData?.card?.meta.author ?? '',
            title: cardData?.card?.meta.title ?? '',
            url: cardData?.card?.meta.url ?? '',
            keywords:
              cardData?.card?.meta.keywords?.map(e => {
                return { label: e, value: e }
              }) ?? [],
            redirects: cardData?.card?.meta.redirects?.join(' ') ?? '',
            duplicates: cardData?.card?.meta.duplicates?.join(' ') ?? '',
            description: '',
            date: '',
          }}
          handleSubmitted={handleCardMetaSubmitted}
        />
      </Modal>
    </>
  )
}

export default CardMetaForm
