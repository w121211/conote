import React from 'react'
import {
  DiscussEmojiFragment,
  useMyDiscussEmojiLikeQuery,
  useUpsertDiscussEmojiLikeMutation,
} from '../../../apollo/query.graphql'
import { EmojiCode } from 'graphql-let/__generated__/__types__'
import { EmojiBtn } from '../emoji/emoji-btn'

const DiscussEmojiUpsertBtn = ({
  discussId,
  discussEmoji,
  emojiCode,
  type,
}: {
  discussEmoji: DiscussEmojiFragment | undefined
  discussId: string
  emojiCode: EmojiCode
  type: 'panel' | 'normal'
}) => {
  const { data } = useMyDiscussEmojiLikeQuery({
    variables: { discussEmojiId: discussEmoji?.id ?? '' },
  })
  const [createEmoji, { error }] = useUpsertDiscussEmojiLikeMutation({
    variables: { discussId, emojiCode: emojiCode, liked: true },
  })

  const [upsertEmoji] = useUpsertDiscussEmojiLikeMutation()

  const onClick = () => {
    if (!discussEmoji) {
      createEmoji()
    } else {
      if (data?.myDiscussEmojiLike) {
        upsertEmoji({
          variables: {
            emojiId: parseInt(discussEmoji.id),
            liked: !data.myDiscussEmojiLike.liked,
          },
        })
      } else {
        upsertEmoji({
          variables: {
            emojiId: parseInt(discussEmoji.id),
            liked: true,
          },
        })
      }
    }
  }
  if (!discussEmoji) {
    return <EmojiBtn onClick={onClick} emojiCode={emojiCode} />
  } else {
    /* ---upadate emoji--- */

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
}

export default DiscussEmojiUpsertBtn
