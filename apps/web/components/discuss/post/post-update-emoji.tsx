import { EmojiCode, LikeChoice } from '@prisma/client'
import React from 'react'
import {
  DiscussPostEmojiFragment,
  MyDiscussPostEmojiLikeDocument,
  MyDiscussPostEmojiLikeQuery,
  MyDiscussPostEmojiLikeQueryVariables,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../../apollo/query.graphql'
import { EmojiIcon } from '../../emoji-up-down/emoji-icon'
import { EmojiBtn } from '../layout-components/emoji-btn'

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
    return <EmojiBtn onClick={onClick} emojiCode={discussPostEmoji.code} liked={data?.myDiscussPostEmojiLike?.liked} />
  }
  return (
    <EmojiBtn
      onClick={onClick}
      emojiCode={discussPostEmoji.code}
      counts={discussPostEmoji.count.nUps}
      liked={data?.myDiscussPostEmojiLike?.liked}
    />
  )
}

export default UpdateDiscussPostEmoji
