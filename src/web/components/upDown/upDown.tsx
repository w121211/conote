import { BulletLike } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  LikeChoice,
  useCreateEmojiMutation,
  useUpsertEmojiLikeMutation,
  MyHashtagLikeQuery,
  MyHashtagLikeQueryVariables,
  MyHashtagLikeDocument,
  useMyHashtagLikeQuery,
  Hashtag,
  EmojiText,
  HashtagLike,
  useMyHashtagLikeLazyQuery,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'

const UpDown = ({
  // choice,

  bulletId,
  children,
  foundEmoji,
  emojiText,
  onEmojiCreated,
  className,
}: {
  // choice: CommentCount | BulletCount
  // commentId?: string
  className?: string
  bulletId?: number
  children?: React.ReactNode
  foundEmoji?: Hashtag
  emojiText?: EmojiText
  onEmojiCreated: (emoji: Hashtag, myEmojiLike: HashtagLike) => void
} & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [myChoice, setMyChoice] = useState<any>()
  const [createEmoji] = useCreateEmojiMutation({
    // variables: { bulletId, emojiText },
    onCompleted(data) {
      const { emoji, like } = data.createEmoji
      onEmojiCreated(emoji, like)
    },
  })

  const [upsertEmojiLike] = useUpsertEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertEmojiLike) {
        cache.writeQuery<MyHashtagLikeQuery, MyHashtagLikeQueryVariables>({
          query: MyHashtagLikeDocument,
          variables: { hashtagId: data.upsertEmojiLike.like.hashtagId.toString() },
          data: { myHashtagLike: data.upsertEmojiLike.like },
        })
      }
    },
  })

  const [queryMyHashtag, { data, loading, error }] = useMyHashtagLikeLazyQuery()
  if (foundEmoji) {
    queryMyHashtag({
      variables: { hashtagId: foundEmoji.id.toString() },
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
        const myLike = data?.myHashtagLike
        if (myLike && myLike.choice === choice) {
          upsertEmojiLike({
            variables: {
              hashtagId: foundEmoji.id.toString(),
              data: { choice: 'NEUTRAL' },
            },
          })
        }
        if (myLike && myLike.choice !== choice) {
          upsertEmojiLike({
            variables: {
              hashtagId: foundEmoji.id.toString(),
              data: { choice },
            },
          })
        }
        if (myLike === null) {
          upsertEmojiLike({
            variables: {
              hashtagId: foundEmoji.id.toString(),
              data: { choice },
            },
          })
        }
        // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
      } else {
        createEmoji({ variables: { bulletId, emojiText } })
      }
    }
  }

  return (
    <div
      className={`${className} ${classes.default} ${data?.myHashtagLike?.choice === 'UP' && classes.clicked}`}
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

export default UpDown
