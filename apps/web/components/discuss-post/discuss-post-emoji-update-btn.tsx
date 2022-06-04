import React from 'react'
import {
  DiscussPostEmojiFragment,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiBtn } from '../emoji/emoji-btn'

const DiscussPostEmojiUpdateBtn = ({
  discussPostEmoji,
  type,
}: {
  discussPostEmoji: DiscussPostEmojiFragment
  type: 'panel' | 'normal'
}) => {
  const [upsertEmoji] = useUpsertDiscussPostEmojiLikeMutation()
  const { data } = useMyDiscussPostEmojiLikeQuery({
    variables: { discussPostEmojiId: discussPostEmoji.id },
  })
  const onClick = () => {
    if (data?.myDiscussPostEmojiLike) {
      upsertEmoji({
        variables: {
          emojiId: parseInt(discussPostEmoji.id),
          liked: !data.myDiscussPostEmojiLike.liked,
        },
      })
    }
  }

  if (type === 'panel') {
    return (
      <EmojiBtn
        onClick={onClick}
        emojiCode={discussPostEmoji.code}
        liked={data?.myDiscussPostEmojiLike?.liked}
      />
    )
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

export default DiscussPostEmojiUpdateBtn
