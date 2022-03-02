import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussPostEmojiFragment,
  MyDiscussPostEmojiLikeDocument,
  MyDiscussPostEmojiLikeQuery,
  MyDiscussPostEmojiLikeQueryVariables,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { DiscussPostEmoji } from 'graphql-let/__generated__/__types__'
import EmojiIcon from '../emoji-up-down/emoji-icon'

const UpdateDiscussPostEmoji = ({
  discussPostEmoji,
  type,
}: {
  discussPostEmoji: DiscussPostEmojiFragment
  type: 'panel' | 'normal'
}) => {
  const [upsertEmoji] = useUpsertDiscussPostEmojiLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyDiscussPostEmojiLikeQuery>({
        query: MyDiscussPostEmojiLikeDocument,
      })
      // TODO: 這裡忽略了更新 count
      if (res && data?.upsertDiscussPostEmojiLike) {
        cache.writeQuery<MyDiscussPostEmojiLikeQuery, MyDiscussPostEmojiLikeQueryVariables>({
          query: MyDiscussPostEmojiLikeDocument,
          variables: { discussPostEmojiId: data.upsertDiscussPostEmojiLike.like.id },
          data: { myDiscussPostEmojiLike: data.upsertDiscussPostEmojiLike.like },
        })
      }
    },
  })
  const { data } = useMyDiscussPostEmojiLikeQuery({ variables: { discussPostEmojiId: discussPostEmoji.id } })
  const onClick = () => {
    if (data?.myDiscussPostEmojiLike) {
      upsertEmoji({ variables: { discussPostEmojiId: discussPostEmoji.id, liked: !data.myDiscussPostEmojiLike.liked } })
    }
  }

  if (type === 'panel') {
    return (
      <div className="flex items-center">
        <button className={`btn-reset-style group p-1 rounded hover:bg-blue-50`} onClick={onClick}>
          <EmojiIcon
            code={discussPostEmoji.code}
            liked={data?.myDiscussPostEmojiLike?.liked}
            upDownClassName="!text-sm !leading-none group-hover:text-blue-600"
          />
        </button>
      </div>
    )
  }
  return (
    <button className="btn-reset-style flex items-center p-1 rounded hover:bg-blue-50" onClick={onClick}>
      <EmojiIcon
        upDownClassName="!text-base !leading-none"
        code={discussPostEmoji.code}
        liked={data?.myDiscussPostEmojiLike?.liked}
      />
      <span className={`text-xs ${data?.myDiscussPostEmojiLike?.liked ? 'text-blue-600' : 'text-gray-500'}`}>
        {discussPostEmoji.count.nUps}
      </span>
    </button>
  )
}

export default UpdateDiscussPostEmoji
