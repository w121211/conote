import React from 'react'
import {
  DiscussEmojiFragment,
  useMyDiscussEmojiLikeQuery,
  useUpsertDiscussEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from '../emoji/emoji-btn'

const DiscussEmojiUpdateBtn = ({
  discussEmoji,
  type,
}: {
  discussEmoji: DiscussEmojiFragment
  type: 'panel' | 'normal'
}) => {
  const { data } = useMyDiscussEmojiLikeQuery({
    variables: { discussEmojiId: discussEmoji.id },
  })
  const [upsertEmoji] = useUpsertDiscussEmojiLikeMutation()

  const onClick = () => {
    if (data?.myDiscussEmojiLike) {
      upsertEmoji({
        variables: {
          emojiId: parseInt(discussEmoji.id),
          liked: !data.myDiscussEmojiLike.liked,
        },
      })
    }
  }

  if (type === 'panel') {
    return (
      <EmojiBtn
        onClick={onClick}
        emojiCode={discussEmoji.code}
        liked={data?.myDiscussEmojiLike?.liked}
      />
    )
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

export default DiscussEmojiUpdateBtn
