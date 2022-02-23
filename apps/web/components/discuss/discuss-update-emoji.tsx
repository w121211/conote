import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussEmojiFragment,
  MyDiscussEmojiLikeDocument,
  MyDiscussEmojiLikeQuery,
  MyDiscussEmojiLikeQueryVariables,
  useMyDiscussEmojiLikeQuery,
  useUpsertDiscussEmojiLikeMutation,
} from '../../apollo/query.graphql'
// import { DiscussEmoji } from 'graphql-let/__generated__/__types__'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const UpdateDiscussEmoji = ({
  discussEmoji,
  type,
}: {
  discussEmoji: DiscussEmojiFragment
  type: 'panel' | 'normal'
}) => {
  const [upsertEmoji] = useUpsertDiscussEmojiLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyDiscussEmojiLikeQuery>({
        query: MyDiscussEmojiLikeDocument,
      })
      // TODO: 這裡忽略了更新 count
      if (res && data?.upsertDiscussEmojiLike) {
        cache.writeQuery<MyDiscussEmojiLikeQuery, MyDiscussEmojiLikeQueryVariables>({
          query: MyDiscussEmojiLikeDocument,
          variables: { discussEmojiId: data.upsertDiscussEmojiLike.like.id },
          data: { myDiscussEmojiLike: data.upsertDiscussEmojiLike.like },
        })
      }
    },
  })
  const { data } = useMyDiscussEmojiLikeQuery({ variables: { discussEmojiId: discussEmoji.id } })
  const onClick = () => {
    if (data?.myDiscussEmojiLike) {
      upsertEmoji({ variables: { discussEmojiId: discussEmoji.id, liked: !data.myDiscussEmojiLike.liked } })
    }
  }

  if (type === 'panel') {
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
  return (
    <button className="btn-reset-style flex items-center mr-2 gap-1" onClick={onClick}>
      <EmojiIcon
        upDownClassName="!text-base !leading-none"
        code={discussEmoji.code}
        liked={data?.myDiscussEmojiLike?.liked}
      />
      <span className="text-xs text-gray-500">{discussEmoji.count.nUps}</span>
    </button>
  )
}

export default UpdateDiscussEmoji
