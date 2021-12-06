import React, { useState } from 'react'
import { Card, useCardQuery } from '../../apollo/query.graphql'
import HeaderForm from '../header-form/header-form'
import Modal from '../modal/modal'
import Popover from '../popover/popover'

const CardMetaForm = ({
  cardId,
  selfCard,
  handleCardMetaSubmitted,
  btnClassName,
  showBtn,
}: {
  cardId: string
  selfCard?: Card
  handleCardMetaSubmitted: (isSubmitted: boolean) => void
  btnClassName?: string
  showBtn?: boolean
}): JSX.Element => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  const { data: cardData } = useCardQuery({
    variables: { id: cardId },
  })
  return (
    <>
      <button
        className={btnClassName ? btnClassName : ''}
        style={showBtn ? { opacity: 1, pointerEvents: 'auto' } : { opacity: 0, pointerEvents: 'none' }}
        onClick={() => {
          setShowHeaderForm(true)
        }}
      >
        <span className="material-icons">edit_note</span>
        編輯卡片資訊
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
