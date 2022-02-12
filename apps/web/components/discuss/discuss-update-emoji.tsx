import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussEmojiFragment,
  useMyDiscussEmojiLikeQuery,
  useUpsertDiscussEmojiLikeMutation,
} from '../../apollo/query.graphql'
// import { DiscussEmoji } from 'graphql-let/__generated__/__types__'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const UpdateDiscussEmojis = ({ discussEmoji }: { discussEmoji: DiscussEmojiFragment }) => {
  const [upsertEmoji] = useUpsertDiscussEmojiLikeMutation()
  const { data } = useMyDiscussEmojiLikeQuery({ variables: { discussEmojiId: discussEmoji.id } })
  const onClick = () => {
    if (data?.myDiscussEmojiLike) {
      upsertEmoji({ variables: { discussEmojiId: discussEmoji.id, liked: !data.myDiscussEmojiLike.liked } })
    }
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
          code={discussEmoji.code}
          liked={data?.myDiscussEmojiLike?.liked}
          upDownClassName="!text-sm group-hover:text-blue-600"
        />
      </button>
    </div>
  )
}

export default UpdateDiscussEmojis
