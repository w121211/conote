import React from 'react'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { CardEmojisDocument, useCreateCardEmojiMutation } from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const CreateCardEmojiBtn = ({ cardId, emojiCode }: { cardId: string; emojiCode: EmojiCode }): JSX.Element => {
  const [createCardEmoji] = useCreateCardEmojiMutation({
    refetchQueries: [{ query: CardEmojisDocument, variables: { cardId } }],
  })

  const handleLike = () => {
    createCardEmoji({ variables: { cardId, code: emojiCode } })
  }
  return (
    <button
      className={`btn-reset-style`}
      onClick={() => {
        handleLike()
      }}
    >
      <EmojiIcon code={emojiCode} nUps={0} />
    </button>
  )
}
export default CreateCardEmojiBtn