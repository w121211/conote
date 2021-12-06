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
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

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
    <button
      className={`noStyle ${myEmojiLikeData?.myCardEmojiLike?.choice === 'UP' ? classes.clicked : classes.hashtag}`}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiTextToIcon emoji={cardEmoji} customClass={classes.cardDisplayIcon} />
    </button>
  )
}

const CardEmojis = ({ cardId }: { cardId: string }): JSX.Element | null => {
  const { data: cardEmojisData } = useCardEmojisQuery({ fetchPolicy: 'cache-first', variables: { cardId } })
  if (!cardEmojisData || cardEmojisData?.cardEmojis.length <= 0) return null
  return (
    <div className={classes.cardEmojisContainer}>
      {cardEmojisData.cardEmojis.map((e, i) => {
        return <CardEmojiDisplay key={i} cardEmoji={e} />
      })}
    </div>
  )
}
export default CardEmojis
