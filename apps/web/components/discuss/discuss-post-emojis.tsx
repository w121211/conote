import { EmojiCode, LikeChoice } from '@prisma/client'
import React, { useState } from 'react'
import { useDiscussPostEmojisQuery } from '../../apollo/query.graphql'
import EmojiIcon from '../emoji-up-down/emoji-icon'
import Tooltip from '../tooltip/tooltip'
import CreateDiscussPostEmojis from './discuss-post-create-emoji'
import UpdateDiscussPostEmojis from './discuss-post-update-emoji'

const DiscussPostEmojis = ({ discussPostId }: { discussPostId: string }): JSX.Element | null => {
  const [showTooltip, setShowTooltip] = useState(false)
  const { data: emojisData } = useDiscussPostEmojisQuery({ variables: { discussPostId } })
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
          const emojiData = emojisData?.discussPostEmojis.find(el => el.code === e)
          if (emojiData) {
            return <UpdateDiscussPostEmojis discussPostEmoji={emojiData} />
          }
          return <CreateDiscussPostEmojis key={i} discussPostId={discussPostId} emojiCode={e} />
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

export default DiscussPostEmojis
