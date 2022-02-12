import { EmojiCode, LikeChoice } from '@prisma/client'
import React, { useState } from 'react'
import { useDiscussEmojisQuery } from '../../apollo/query.graphql'
import EmojiIcon from '../emoji-up-down/emoji-icon'
import Tooltip from '../tooltip/tooltip'
import CreateDiscussEmojis from './discuss-create-emoji'

import UpdateDiscussEmojis from './discuss-update-emoji'

const DiscussEmojis = ({ discussId }: { discussId: string }): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { data: emojisData } = useDiscussEmojisQuery({ variables: { discussId } })
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
          const emojiData = emojisData?.discussEmojis.find(el => el.code === e)
          if (emojiData) {
            return <UpdateDiscussEmojis discussEmoji={emojiData} />
          }
          return <CreateDiscussEmojis key={i} discussId={discussId} emojiCode={e} />
        })}
      </Tooltip>

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
