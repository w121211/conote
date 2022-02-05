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
    <div className="flex flex-col w-12 top-4">
      <span
        className="material-icons relative flex items-center justify-center w-8 h-8 rounded-full cursor-pointer select-none text-xl text-gray-400 mix-blend-multiply hover:bg-gray-200"
        onClick={e => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        sentiment_satisfied_alt
        <Tooltip
          className="right-full -translate-y-2/3 mr-2 px-1 py-1"
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
      </span>
      {pinEmojiData ? (
        <CardEmojiBtn cardEmoji={pinEmojiData} />
      ) : (
        <CreateCardEmojiBtn cardId={cardId} emojiCode="PIN" />
      )}
      {emojis.map((e, i) => {
        const foundData = emojiData?.cardEmojis.find(el => el.code === e)
        return foundData !== undefined && foundData.count.nUps > 0 ? (
          <div className="flex items-center">
            <CardEmojiBtn key={i} cardEmoji={foundData} />
            <span className={`min-w-[10px] ml-1 text-gray-500 text-sm font-['Red Hat Mono'] `}>
              {foundData.count.nUps}
            </span>
          </div>
        ) : null
      })}
    </div>
  )
}
export default HeaderCardEmojis
