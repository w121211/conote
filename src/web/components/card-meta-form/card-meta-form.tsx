import React, { useState } from 'react'
import { Card, useCardQuery } from '../../apollo/query.graphql'
import HeaderForm from '../header-form/header-form'
import Popover from '../popover/popover'

const CardMetaForm = ({
  cardId,
  selfCard,
  handleCardMetaSubmitted,
  btnClassName,
}: {
  cardId: string
  selfCard?: Card
  handleCardMetaSubmitted: (isSubmitted: boolean) => void
  btnClassName?: string
}): JSX.Element => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  const { data: cardData } = useCardQuery({
    variables: { id: cardId },
  })
  return (
    <>
      <button
        className={btnClassName ? btnClassName : ''}
        onClick={() => {
          setShowHeaderForm(true)
        }}
      >
        編輯卡片資訊
      </button>
      <Popover
        visible={showHeaderForm}
        hideBoard={() => {
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
      </Popover>
    </>
  )
}

export default CardMetaForm
