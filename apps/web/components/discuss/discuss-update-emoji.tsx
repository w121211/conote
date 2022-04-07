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
import { EmojiIcon } from '../emoji-up-down/emoji-icon'
import { EmojiBtn } from './layout-components/emoji-btn'

const UpdateDiscussEmoji = ({
  discussEmoji,
  type,
}: {
  discussEmoji: DiscussEmojiFragment
  type: 'panel' | 'normal'
}) => {
  const { data } = useMyDiscussEmojiLikeQuery({ variables: { discussEmojiId: discussEmoji.id } })
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

  const onClick = () => {
    if (data?.myDiscussEmojiLike) {
      upsertEmoji({
        variables: {
          discussEmojiId: discussEmoji.id,
          liked: !data.myDiscussEmojiLike.liked,
        },
      })
    }
  }

  if (type === 'panel') {
    return <EmojiBtn onClick={onClick} emojiCode={discussEmoji.code} liked={data?.myDiscussEmojiLike?.liked} />
  }
  return (
    <EmojiBtn
      onClick={onClick}
      emojiCode={discussEmoji.code}
      liked={data?.myDiscussEmojiLike?.liked}
      counts={discussEmoji.count.nUps}
    />
  )
}

export default UpdateDiscussEmoji
