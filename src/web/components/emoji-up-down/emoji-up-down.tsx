// import { BulletLike } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  LikeChoice,
  useCreateEmojiMutation,
  useUpsertEmojiLikeMutation,
  MyEmojiLikeQuery,
  MyEmojiLikeQueryVariables,
  MyEmojiLikeDocument,
  useMyEmojiLikeQuery,
  Emoji,
  EmojiText,
  EmojiLike,
  useMyEmojiLikeLazyQuery,
  useEmojisQuery,
  EmojisDocument,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import classes from './emoji-up-down.module.scss'

const EmojiUpDown = ({
  // choice,

  bulletId,
  children,
  foundEmoji,
  emojiText,
  // onEmojiCreated,
  className,
}: {
  // choice: CommentCount | BulletCount
  // commentId?: string
  className?: string
  bulletId?: string
  children?: React.ReactNode
  foundEmoji?: Emoji
  emojiText?: EmojiText
  // onEmojiCreated: (emoji: Emoji, myEmojiLike: EmojiLike) => void
} & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [myChoice, setMyChoice] = useState<any>()
  const [createEmoji] = useCreateEmojiMutation({
    // variables: { bulletId, emojiText },
    onCompleted(data) {
      // const { emoji, like } = data.createEmoji
      // // onEmojiCreated(emoji, like)
    },
    refetchQueries: [{ query: EmojisDocument, variables: { bulletId: bulletId } }],
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
  })

  const [queryMyHashtag, { data, loading, error }] = useMyEmojiLikeLazyQuery()
  if (foundEmoji) {
    queryMyHashtag({
      variables: { emojiId: foundEmoji.id.toString() },
    })
  }
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
    if (bulletId && emojiText) {
      // const findEmoji = emoji?.find(el => el.text === e.emojiText)
      //   console.log(findEmoji?.id)
      if (foundEmoji) {
        const myLike = data?.myEmojiLike
        if (myLike && myLike.choice === choice) {
          upsertEmojiLike({
            variables: {
              emojiId: foundEmoji.id.toString(),
              data: { choice: 'NEUTRAL' },
            },
          })
        }
        if (myLike && myLike.choice !== choice) {
          upsertEmojiLike({
            variables: {
              emojiId: foundEmoji.id.toString(),
              data: { choice },
            },
          })
        }
        if (myLike === null) {
          upsertEmojiLike({
            variables: {
              emojiId: foundEmoji.id.toString(),
              data: { choice },
            },
          })
        }
        // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
      } else {
        createEmoji({ variables: { bulletId, text: emojiText } })
      }
    }
  }

  return (
    <div
      className={`${className} ${classes.default} ${data?.myEmojiLike?.choice === 'UP' && classes.clicked}`}
      onClick={e => {
        e.stopPropagation()
        handleLike()
      }}
      // style={{ width: '100%' }}
    >
      {/* <span className={classes.upDownWrapper}> */}
      {children}
      {/* <span
          className={`${classes.arrowUpIcon} ${myChoice && myChoice.choice === 'UP' && classes.liked}`}
          onClick={() => {
            handleLike('UP')
          }}
        >
          <ArrowUpIcon />
          {choice.nUps}
        </span>
        <span
          className={`${classes.arrowDownIcon} ${myChoice && myChoice.choice === 'DOWN' && classes.liked}`}
          onClick={() => {
            handleLike('DOWN')
          }}
        >
          <ArrowUpIcon />
          {choice.nDowns}
        </span> */}
      {/* </span> */}
    </div>
  )
}

export default EmojiUpDown
