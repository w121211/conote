import React from 'react'
import {
  DiscussPostEmojiFragment,
  useMyDiscussPostEmojiLikeQuery,
  useUpsertDiscussPostEmojiLikeMutation,
} from '../../apollo/query.graphql'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { EmojiBtn } from '../emoji/emoji-btn'

const DiscussPostEmojiUpsertBtn = ({
  discussPostEmoji,
  discussPostId,
  emojiCode,
  type,
}: {
  discussPostEmoji: DiscussPostEmojiFragment | undefined
  discussPostId: string
  emojiCode: EmojiCode
  type: 'panel' | 'normal'
}) => {
  const [createEmoji] = useUpsertDiscussPostEmojiLikeMutation({
    variables: {
      discussPostId: parseInt(discussPostId),
      emojiCode: emojiCode,
      liked: true,
    },
  })

  const [upsertEmoji] = useUpsertDiscussPostEmojiLikeMutation()
  const { data } = useMyDiscussPostEmojiLikeQuery({
    variables: { discussPostEmojiId: discussPostEmoji?.id ?? '' },
  })
  const onClick = () => {
    if (!discussPostEmoji) {
      createEmoji()
    } else {
      if (data?.myDiscussPostEmojiLike) {
        upsertEmoji({
          variables: {
            emojiId: parseInt(discussPostEmoji.id),
            liked: !data.myDiscussPostEmojiLike.liked,
          },
        })
      } else {
        upsertEmoji({
          variables: {
            emojiId: parseInt(discussPostEmoji.id),
            liked: true,
          },
        })
      }
    }
  }
  if (!discussPostEmoji) {
    return <EmojiBtn onClick={onClick} emojiCode={emojiCode} />
  } else {
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
}

export default DiscussPostEmojiUpsertBtn
