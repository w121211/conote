import React, { useState } from 'react'
import { useCardEmojisQuery } from '../../apollo/query.graphql'
import CreateCardEmojiBtn from './create-card-emoji-btn'
import CardEmojiBtn from './card-emoji-btn'
import { EmojiCode } from '@prisma/client'
import Tooltip from '../tooltip/tooltip'

const HeaderCardEmojis = ({ cardId }: { cardId: string }): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { data: emojiData } = useCardEmojisQuery({ variables: { cardId } })
  const emojis: EmojiCode[] = ['UP', 'DOWN']
  const pinEmojiData = emojiData?.cardEmojis.find(e => e.code === 'PIN')

  return (
    <div className="flex  ">
      {emojis.map((e, i) => {
        const foundData = emojiData?.cardEmojis.find(el => el.code === e)
        return foundData !== undefined && foundData.count.nUps > 0 ? (
          <div key={i} className="flex items-center">
            <CardEmojiBtn cardEmoji={foundData} showCounts />
          </div>
        ) : null
      })}
      {pinEmojiData ? (
        <CardEmojiBtn cardEmoji={pinEmojiData} />
      ) : (
        <CreateCardEmojiBtn cardId={cardId} emojiCode="PIN" />
      )}
      <div
        className="relative"
        onClick={e => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        <span
          className="material-icons  flex items-center justify-center p-1 rounded
        cursor-pointer select-none text-xl leading-none text-gray-500 mix-blend-multiply hover:bg-gray-100"
        >
          sentiment_satisfied_alt
        </span>
        <Tooltip
          className="px-1 py-1 left-1/2 -translate-x-1/2"
          visible={showTooltip}
          onClose={() => setShowTooltip(false)}
        >
          {emojis.map((e, i) => {
            const foundData = emojiData?.cardEmojis.find(el => el.code === e)
            return foundData !== undefined ? (
              <CardEmojiBtn key={i} cardEmoji={foundData} />
            ) : (
              <CreateCardEmojiBtn key={i} cardId={cardId} emojiCode={e} />
            )
          })}
        </Tooltip>
      </div>
    </div>
  )
}
export default HeaderCardEmojis
