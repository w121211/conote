import { EmojiCode } from '@prisma/client'
import React, { useState } from 'react'
import EmojiIcon from '../emoji-up-down/emoji-icon'
import Tooltip from '../tooltip/tooltip'

const DiscussEmojis = (): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  // const { data: emojiData } = useCardEmojisQuery({ variables: { cardId } })
  const emojis: EmojiCode[] = ['UP', 'DOWN']
  // const pinEmojiData = emojiData?.cardEmojis.find(e => e.code === 'PIN')

  return (
    <div className="relative w-fit ">
      <span
        className="material-icons-outlined rounded-full  cursor-pointer select-none leading-none text-xl text-gray-400 mix-blend-multiply hover:bg-gray-200/70"
        onClick={e => {
          e.stopPropagation()
          setShowTooltip(!showTooltip)
        }}
      >
        sentiment_satisfied_alt
      </span>
      <Tooltip
        className="left-0 mb-1 px-1 py-1"
        direction="top"
        visible={showTooltip}
        onClose={() => setShowTooltip(false)}
      >
        {emojis.map((e, i) => {
          return (
            <div key={i} className="flex items-center gap-1">
              <button
                className={`btn-reset-style group w-6 h-6 rounded-full
                   hover:bg-blue-100
                  `}
                onClick={() => {
                  // handleLike('UP')
                }}
              >
                <EmojiIcon
                  code={e}
                  // liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
                  upDownClassName="!text-sm group-hover:text-blue-600"
                />
              </button>
            </div>
          )
          //   const foundData = emojiData?.cardEmojis.find(el => el.code === e)
          //   return foundData !== undefined ? (
          //     <CardEmojiBtn key={i} cardEmoji={foundData} />
          //   ) : (
          //     <CreateCardEmojiBtn key={i} cardId={cardId} emojiCode={e} />
          //   )
        })}
      </Tooltip>
      {/* {pinEmojiData ? (
          <CardEmojiBtn cardEmoji={pinEmojiData} />
        ) : (
          <CreateCardEmojiBtn cardId={cardId} emojiCode="PIN" />
        )} */}
      {/* {emojis.map((e, i) => {
        return (
          <div key={i} className="flex items-center gap-1">
            <button
              className={`btn-reset-style group w-8 h-8 rounded-full
            hover:bg-blue-100
           `}
              onClick={() => {
                // handleLike('UP')
              }}
            >
              <EmojiIcon code={e} upDownClassName="group-hover:text-blue-600" />
            </button>
          </div>
        )
      })} */}
    </div>
  )
}

export default DiscussEmojis
