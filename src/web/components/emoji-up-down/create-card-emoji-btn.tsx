import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { CardEmojisDocument, useCreateCardEmojiMutation } from '../../apollo/query.graphql'
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

const CreateCardEmojiBtn = ({ cardId, emojiCode }: { cardId: string; emojiCode: EmojiCode }): JSX.Element => {
  const [createCardEmoji] = useCreateCardEmojiMutation({
    refetchQueries: [{ query: CardEmojisDocument, variables: { cardId } }],
  })

  const handleLike = () => {
    createCardEmoji({ variables: { cardId, code: emojiCode } })
  }
  return (
    <button
      className={`noStyle ${classes.hashtag}`}
      onClick={() => {
        handleLike()
      }}
    >
      <EmojiTextToIcon emojiCode={emojiCode} count={0} />
    </button>
  )
}
export default CreateCardEmojiBtn
