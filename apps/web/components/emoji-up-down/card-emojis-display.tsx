import React from 'react'
import {
  CardEmojiFragment,
  MyCardEmojiLikeDocument,
  MyCardEmojiLikeQuery,
  MyCardEmojiLikeQueryVariables,
  useCardEmojisQuery,
  useMyCardEmojiLikeQuery,
  useUpsertCardEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiIcon from './emoji-icon'

const CardEmojiDisplay = ({ cardEmoji }: { cardEmoji: CardEmojiFragment }): JSX.Element | null => {
  const {
    data: myEmojiLikeData,
    loading,
    error,
  } = useMyCardEmojiLikeQuery({
    variables: { cardEmojiId: cardEmoji.id },
  })

  if (cardEmoji.count.nUps === 0) return null
  return (
    <button className={`btn-reset-style`}>
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiIcon
        className="hover:text-gray-500"
        code={cardEmoji.code}
        nUps={cardEmoji.count.nUps}
        liked={myEmojiLikeData?.myCardEmojiLike?.choice === 'UP'}
      />
    </button>
  )
}

const CardEmojis = ({ cardId }: { cardId: string }): JSX.Element | null => {
  const { data, error, loading } = useCardEmojisQuery({ fetchPolicy: 'cache-first', variables: { cardId } })
  if (!data || error || loading || data?.cardEmojis.length === 0 || data.cardEmojis.every(e => e.count.nUps === 0)) {
    return null
  }
  return (
    <div className="inline-flex">
      {data.cardEmojis.map((e, i) => {
        return <CardEmojiDisplay key={i} cardEmoji={e} />
      })}
    </div>
  )
}
export default CardEmojis
