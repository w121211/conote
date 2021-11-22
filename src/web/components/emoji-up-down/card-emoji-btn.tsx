import React from 'react'
import {
  CardEmoji,
  // EmojiCode,
  LikeChoice,
  MyCardEmojiLikeDocument,
  MyCardEmojiLikeQuery,
  MyCardEmojiLikeQueryVariables,
  useMyCardEmojiLikeQuery,
  useUpsertCardEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

const CardEmojiBtn = ({ cardEmoji }: { cardEmoji: CardEmoji }): JSX.Element => {
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

  // const handleMyChoice = () => {
  //   if (commentId) {
  //     return myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
  //   }
  //   // if (bulletId) {
  //   //   return myBulletLikeData?.myBulletLikes.find(e => e.bulletId === parseInt(bulletId))
  //   // }
  //   return undefined
  // }
  // useEffect(() => {
  //   const res = handleMyChoice()
  //   setMyChoice(res)
  // }, [myCommentLikeData, myBulletLikeData])

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
      className={`inline mR ${myEmojiLikeData?.myCardEmojiLike?.choice === 'UP' ? classes.clicked : classes.hashtag}`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiTextToIcon emoji={cardEmoji} />

      <span style={{ marginLeft: '3px' }}>{cardEmoji.count.nUps}</span>
    </button>
  )
}
export default CardEmojiBtn
