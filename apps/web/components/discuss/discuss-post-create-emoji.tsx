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
      <button className={`btn-reset-style group p-1 rounded hover:bg-blue-50`} onClick={onClick}>
        <EmojiIcon
          code={emojiCode}
          // liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
          upDownClassName="!text-sm !leading-none group-hover:text-blue-600"
        />
      </button>
    </div>
  )
}

export default CreateDiscussPostEmoji
