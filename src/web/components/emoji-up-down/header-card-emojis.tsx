import React from 'react'
import { useCardEmojisQuery } from '../../apollo/query.graphql'
import CreateCardEmojiBtn from './create-card-emoji-btn'
import CardEmojiBtn from './card-emoji-btn'

const HeaderCardEmojis = ({ cardId }: { cardId: string }): JSX.Element | null => {
  const { data: emojiData } = useCardEmojisQuery({ variables: { cardId } })

  const pinEmoji = emojiData?.cardEmojis.find(e => e.code === 'PIN')
  const upEmoji = emojiData?.cardEmojis.find(e => e.code === 'UP')
  const downEmoji = emojiData?.cardEmojis.find(e => e.code === 'DOWN')

  // if (emojiData === null || !emojiData?.cardEmojis) return null
  return (
    <div className="flex items-center w-full mt-3 gap-3">
      {pinEmoji ? <CardEmojiBtn cardEmoji={pinEmoji} /> : <CreateCardEmojiBtn cardId={cardId} emojiCode="PIN" />}
      {upEmoji ? <CardEmojiBtn cardEmoji={upEmoji} /> : <CreateCardEmojiBtn cardId={cardId} emojiCode="UP" />}
      {downEmoji ? <CardEmojiBtn cardEmoji={downEmoji} /> : <CreateCardEmojiBtn cardId={cardId} emojiCode="DOWN" />}
      {/* {console.log(emojiData.cardEmojis)} */}
    </div>
  )
}
export default HeaderCardEmojis
