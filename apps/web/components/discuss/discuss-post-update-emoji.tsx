import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussPostEmojiFragment,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { DiscussPostEmoji } from 'graphql-let/__generated__/__types__'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const UpdateDiscussPostEmojis = ({ discussPostEmoji }: { discussPostEmoji: DiscussPostEmojiFragment }) => {
  const [upsertEmoji] = useUpsertDiscussPostEmojiLikeMutation()
  const { data } = useMyDiscussPostEmojiLikeQuery({ variables: { discussPostEmojiId: discussPostEmoji.id } })
  const onClick = () => {
    if (data?.myDiscussPostEmojiLike) {
      upsertEmoji({ variables: { discussPostEmojiId: discussPostEmoji.id, liked: !data.myDiscussPostEmojiLike.liked } })
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
          code={discussPostEmoji.code}
          liked={data?.myDiscussPostEmojiLike?.liked}
          upDownClassName="!text-sm group-hover:text-blue-600"
        />
      </button>
    </div>
  )
}

export default UpdateDiscussPostEmojis
