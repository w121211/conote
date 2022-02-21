import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussEmojisDocument,
  MyDiscussEmojiLikeDocument,
  useCreateDiscussEmojiMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const CreateDiscussEmoji = ({ discussId, emojiCode }: { discussId: string; emojiCode: EmojiCode }) => {
  const [createEmoji, { error }] = useCreateDiscussEmojiMutation({
    variables: { discussId, code: emojiCode },
    refetchQueries: [{ query: DiscussEmojisDocument, variables: { discussId } }],
  })
  const onClick = () => {
    createEmoji()
  }
  if (error) {
    console.log(error.message)
  }

  return (
    <div className="flex items-center">
      <button
        className={`btn-reset-style group w-6 h-6 rounded-full
                         hover:bg-blue-100
                        `}
        onClick={onClick}
      >
        <EmojiIcon
          code={emojiCode}
          // liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
          upDownClassName="!text-sm group-hover:text-blue-600"
        />
      </button>
    </div>
  )
}

export default CreateDiscussEmoji
