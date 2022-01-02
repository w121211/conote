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
    <div className="flex flex-col items-center">
      <button
        className={`btn-reset-style`}
        onClick={() => {
          handleLike()
        }}
      >
        <EmojiIcon code={emojiCode} />
      </button>
      <span className="text-gray-500">{0}</span>
    </div>
  )
}
export default CreateCardEmojiBtn
