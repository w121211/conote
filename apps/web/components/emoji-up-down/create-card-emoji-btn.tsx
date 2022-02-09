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
    <div className="flex items-center gap-1">
      <button
        className={`btn-reset-style group w-8 h-8 rounded-full ${
          emojiCode === 'PIN' ? 'hover:bg-red-100' : 'hover:bg-blue-100'
        }`}
        onClick={() => {
          handleLike()
        }}
      >
        <EmojiIcon
          className={emojiCode === 'PIN' ? 'text-red-400' : 'text-gray-400'}
          code={emojiCode}
          upDownClassName="group-hover:text-blue-600"
        />
      </button>
      {/* <span
        className={`min-w-[10px] text-gray-500 text-sm font-['Red Hat Mono'] ${emojiCode === 'PIN' ? 'hidden' : ''}`}
      >
        {0}
      </span> */}
    </div>
  )
}
export default CreateCardEmojiBtn
