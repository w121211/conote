import React from 'react'
import { CardEmojisDocument, EmojiCode, LikeChoice, useCreateCardEmojiMutation } from '../../apollo/query.graphql'
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

const CreateCardEmojiBtn = ({ cardId, emojiCode }: { cardId: string; emojiCode: EmojiCode }) => {
  const [createCardEmoji] = useCreateCardEmojiMutation({
    refetchQueries: [{ query: CardEmojisDocument, variables: { cardId } }],
  })

  const handleLike = () => {
    createCardEmoji({ variables: { cardId, code: emojiCode } })
  }
  return (
    <button
      className={`inline ${classes.hashtag}`}
      onClick={() => {
        handleLike()
      }}
    >
      <EmojiTextToIcon emojiCode={emojiCode} />

      <span style={{ marginLeft: '3px' }}>0</span>
    </button>
  )
}
export default CreateCardEmojiBtn
