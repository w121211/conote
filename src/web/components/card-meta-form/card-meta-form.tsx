import React, { useState } from 'react'
import { Card, useCardMetaQuery } from '../../apollo/query.graphql'
import HeaderForm from '../header-form/header-form'
import Popover from '../popover/popover'

const CardMetaForm = ({
  symbol,
  selfCard,
  handleCardMetaSubmitted,
}: {
  symbol: string
  selfCard: Card
  handleCardMetaSubmitted: (isSubmitted: boolean) => void
}) => {
  const [showHeaderForm, setShowHeaderForm] = useState(false)

  const { data: cardMetaData } = useCardMetaQuery({
    variables: { symbol },
  })
  return (
    <>
      <button
        className="secondary"
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
          symbol={symbol}
          initialValue={{
            author: cardMetaData?.cardMeta.author ?? '',
            title: (cardMetaData?.cardMeta.title || selfCard.link?.url) ?? '',
            url: (cardMetaData?.cardMeta.url || selfCard.link?.url) ?? '',
            keywords:
              cardMetaData?.cardMeta.keywords?.map(e => {
                return { label: e, value: e }
              }) ?? [],
            redirects: cardMetaData?.cardMeta.redirects?.join(' ') ?? '',
            duplicates: cardMetaData?.cardMeta.duplicates?.join(' ') ?? '',
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
