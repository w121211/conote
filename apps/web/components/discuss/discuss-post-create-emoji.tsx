import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import { DiscussPostEmojisDocument, useCreateDiscussPostEmojiMutation } from '../../apollo/query.graphql'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const CreateDiscussPostEmoji = ({ discussPostId, emojiCode }: { discussPostId: string; emojiCode: EmojiCode }) => {
  const [createEmoji, { error }] = useCreateDiscussPostEmojiMutation({
    variables: { discussPostId, code: emojiCode },
    refetchQueries: [{ query: DiscussPostEmojisDocument, variables: { discussPostId } }],
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

export default CreateDiscussPostEmoji