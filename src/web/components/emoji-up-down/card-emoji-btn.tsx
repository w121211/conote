import React from 'react'
import { LikeChoice } from 'graphql-let/__generated__/__types__'
import {
  CardEmojiFragment,
  MyCardEmojiLikeDocument,
  MyCardEmojiLikeQuery,
  MyCardEmojiLikeQueryVariables,
  useMyCardEmojiLikeQuery,
  useUpsertCardEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const CardEmojiBtn = ({ cardEmoji }: { cardEmoji: CardEmojiFragment }): JSX.Element => {
  const [upsertEmojiLike] = useUpsertCardEmojiLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyCardEmojiLikeQuery>({
        query: MyCardEmojiLikeDocument,
      })
      // TODO: 這裡忽略了更新 count
      if (res && data?.upsertCardEmojiLike) {
        cache.writeQuery<MyCardEmojiLikeQuery, MyCardEmojiLikeQueryVariables>({
          query: MyCardEmojiLikeDocument,
          variables: { cardEmojiId: data.upsertCardEmojiLike.like.id },
          data: { myCardEmojiLike: data.upsertCardEmojiLike.like },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.upsertEmojiLike)
    },
  })

  const {
    data: myEmojiLikeData,
    loading,
    error,
  } = useMyCardEmojiLikeQuery({
    variables: { cardEmojiId: cardEmoji.id },
  })

  const handleLike = (choice: LikeChoice = 'UP') => {
    const myLike = myEmojiLikeData?.myCardEmojiLike

    if (myLike && myLike.choice === choice) {
      upsertEmojiLike({
        variables: {
          cardEmojiId: cardEmoji.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myLike && myLike.choice !== choice) {
      upsertEmojiLike({
        variables: {
          cardEmojiId: cardEmoji.id,
          data: { choice },
        },
      })
    }
    if (myLike === null) {
      upsertEmojiLike({
        variables: {
          cardEmojiId: cardEmoji.id,
          data: { choice },
        },
      })
    }
    // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
  }
  return (
    <button
      className={`btn-reset-style`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      <EmojiIcon
        code={cardEmoji.code}
        nUps={cardEmoji.count.nUps}
        liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
      />
    </button>
  )
}
export default CardEmojiBtn
