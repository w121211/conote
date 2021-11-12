import React from 'react'
import {
  Emoji,
  EmojisDocument,
  EmojiText,
  LikeChoice,
  MyEmojiLikeDocument,
  MyEmojiLikeQuery,
  MyEmojiLikeQueryVariables,
  useCreateEmojiMutation,
  useMyEmojiLikeLazyQuery,
  useMyEmojiLikeQuery,
  useUpsertEmojiLikeMutation,
} from '../../apollo/query.graphql'
import EmojiTextToIcon from './emoji-text-to-icon'
import classes from './emoji-up-down.module.scss'

const EmojiHeaderBtn = ({
  bulletId,
  emoji,
  emojiText,
}: {
  bulletId: string
  emoji: Emoji
  emojiText?: EmojiText
}): JSX.Element => {
  const [createEmoji] = useCreateEmojiMutation({
    // variables: { bulletId, emojiText },
    onCompleted(data) {
      // const { emoji, like } = data.createEmoji
      // // onEmojiCreated(emoji, like)
    },
    refetchQueries: [{ query: EmojisDocument, variables: { bulletId } }],
  })

  const [upsertEmojiLike] = useUpsertEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertEmojiLike) {
        cache.writeQuery<MyEmojiLikeQuery, MyEmojiLikeQueryVariables>({
          query: MyEmojiLikeDocument,
          variables: { emojiId: data.upsertEmojiLike.like.emojiId.toString() },
          data: { myEmojiLike: data.upsertEmojiLike.like },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.upsertEmojiLike)
    },
  })

  const { data, loading, error } = useMyEmojiLikeQuery({
    variables: { emojiId: emoji.id },
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
    if (bulletId) {
      // const findEmoji = emoji?.find(el => el.text === e.emojiText)
      //   console.log(findEmoji?.id)
      if (emoji) {
        const myLike = data?.myEmojiLike
        console.log(myLike)
        if (myLike && myLike.choice === choice) {
          upsertEmojiLike({
            variables: {
              emojiId: emoji.id,
              data: { choice: 'NEUTRAL' },
            },
          })
        }
        if (myLike && myLike.choice !== choice) {
          upsertEmojiLike({
            variables: {
              emojiId: emoji.id,
              data: { choice },
            },
          })
        }
        if (myLike === null) {
          upsertEmojiLike({
            variables: {
              emojiId: emoji.id,
              data: { choice },
            },
          })
        }
        // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
      } else {
        // createEmoji({ variables: { bulletId, text: emojiText } })
      }
    }
  }
  return (
    <button
      className={`inline mR ${data?.myEmojiLike?.choice === 'UP' ? classes.clicked : classes.hashtag}`}
      onClick={() => {
        handleLike('UP')
      }}
    >
      {/* {data.myHashtagLike?.choice && hashtag.text} */}
      {/* {hashtag.text} */}
      <EmojiTextToIcon emoji={emoji} />

      <span style={{ marginLeft: '3px' }}>{emoji.count.nUps}</span>
    </button>
  )
}
export default EmojiHeaderBtn
