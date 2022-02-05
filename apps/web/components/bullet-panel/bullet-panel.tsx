import React, { useRef } from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { BulletEmojiFragment } from '../../apollo/query.graphql'
import BulletEmojiCreateButton from '../emoji-up-down/bullet-emoji-create-button'
import MyTooltip from '../tooltip/tooltip'

const BULLET_PANEL_EMOJIS: EmojiCode[] = ['PIN', 'UP', 'DOWN']

const BulletPanel = ({
  authorName,
  bulletId,
  className,
  sourceUrl,
  visible,
  onClose,
}: {
  authorName?: string
  bulletId?: string
  className?: string
  sourceUrl?: string
  emoji?: BulletEmojiFragment[]
  visible: boolean
  onClose: () => void
  // onEmojiCreated: (emoji: BulletEmojiFragment, myEmojiLike: BulletEmojiLikeFragment) => void
}): JSX.Element => {
  // const [showPanel, setShowPanel] = useState<boolean>(false)

  return (
    // <div className={`absolute h-full -left-full ${className ? className : ''}`} >
    <MyTooltip
      className={`py-2 px-0`}
      visible={visible}
      onClose={onClose}
      // handleVisibleState={handleShowPanel}
    >
      <div className="flex flex-col items-start">
        {bulletId &&
          BULLET_PANEL_EMOJIS.map((e, i) => (
            <BulletEmojiCreateButton
              bulletId={bulletId}
              className="w-full px-4 hover:bg-gray-100"
              emojiCode={e}
              key={i}
            />
          ))}
      </div>
    </MyTooltip>
    // </div>
  )
}
export default BulletPanel
