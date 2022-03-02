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

const CardEmojiBtn = ({
  cardEmoji,
  showCounts,
}: {
  cardEmoji: CardEmojiFragment
  showCounts?: boolean
}): JSX.Element => {
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
      className={`btn-reset-style group p-1 rounded ${
        cardEmoji.code === 'PIN' ? 'hover:bg-red-50' : 'hover:bg-blue-50'
      }`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      <EmojiIcon
        className={'text-gray-500'}
        code={cardEmoji.code}
        liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
        upDownClassName="!text-lg !leading-none group-hover:text-blue-600"
        pinClassName="!text-xl !leading-none group-hover:text-red-600"
      />
      {showCounts && (
        <span
          className={`ml-[2px] text-sm  ${
            myEmojiLikeData?.myCardEmojiLike?.choice === 'UP' ? 'text-blue-600' : 'text-gray-500'
          }`}
        >
          {cardEmoji.count.nUps}
        </span>
      )}
    </button>
  )
}
export default CardEmojiBtn
