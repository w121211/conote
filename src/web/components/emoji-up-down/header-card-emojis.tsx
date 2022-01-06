import React from 'react'
import { useCardEmojisQuery } from '../../apollo/query.graphql'
import CreateCardEmojiBtn from './create-card-emoji-btn'
import CardEmojiBtn from './card-emoji-btn'
import { EmojiCode } from '@prisma/client'

const HeaderCardEmojis = ({ cardId }: { cardId: string }): JSX.Element | null => {
  const { data: emojiData } = useCardEmojisQuery({ variables: { cardId } })
  const emojis: EmojiCode[] = ['PIN', 'UP', 'DOWN']

  return (
    <div className="flex flex-col gap-1">
      {emojis.map((e, i) => {
        const foundData = emojiData?.cardEmojis.find(el => el.code === e)
        return foundData !== undefined ? (
          <CardEmojiBtn key={i} cardEmoji={foundData} />
        ) : (
          <CreateCardEmojiBtn key={i} cardId={cardId} emojiCode={e} />
        )
      })}
    </div>
  )
}
export default HeaderCardEmojis
