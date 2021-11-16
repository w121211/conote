// import { BulletLike } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  BulletEmoji,
  BulletEmojisDocument,
  EmojiCode,
  LikeChoice,
  MyBulletEmojiLikeDocument,
  MyBulletEmojiLikeQuery,
  MyBulletEmojiLikeQueryVariables,
  useCreateBulletEmojiMutation,
  useMyBulletEmojiLikeLazyQuery,
  useUpsertBulletEmojiLikeMutation,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import classes from './emoji-up-down.module.scss'

const EmojiUpDown = ({
  // choice,
  bulletId,
  children,
  foundEmoji,
  emojiCode,
  // onEmojiCreated,
  className,
}: {
  // choice: CommentCount | BulletCount
  // commentId?: string
  className?: string
  bulletId?: string
  children?: React.ReactNode
  foundEmoji?: BulletEmoji
  emojiCode?: EmojiCode
  // onEmojiCreated: (emoji: Emoji, myEmojiLike: EmojiLike) => void
} & React.HTMLAttributes<HTMLElement>): JSX.Element => {
  const [myChoice, setMyChoice] = useState<any>()
  const [createBulletEmoji] = useCreateBulletEmojiMutation({
    // variables: { bulletId, emojiText },
    onCompleted(data) {
      // const { emoji, like } = data.createEmoji
      // // onEmojiCreated(emoji, like)
    },
    // TODO: 避免使用 @see https://www.apollographql.com/blog/apollo-client/caching/when-to-use-refetch-queries/
    refetchQueries: [{ query: BulletEmojisDocument, variables: { bulletId: bulletId } }],
  })
  const [upsertBulletEmojiLike] = useUpsertBulletEmojiLikeMutation({
    update(cache, { data }) {
      // TODO: 這裡忽略了更新 count
      if (data?.upsertBulletEmojiLike) {
        cache.writeQuery<MyBulletEmojiLikeQuery, MyBulletEmojiLikeQueryVariables>({
          query: MyBulletEmojiLikeDocument,
          variables: { bulletEmojiId: data.upsertBulletEmojiLike.like.bulletEmojiId },
          data: { myBulletEmojiLike: data.upsertBulletEmojiLike.like },
        })
      }
    },
  })
  const [queryMyBulletEmoji, { data, loading, error }] = useMyBulletEmojiLikeLazyQuery()

  if (foundEmoji) {
    queryMyBulletEmoji({
      variables: { bulletEmojiId: foundEmoji.id },
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
    if (bulletId && emojiCode) {
      // const findEmoji = emoji?.find(el => el.text === e.emojiText)
      //   console.log(findEmoji?.id)
      if (foundEmoji) {
        const myLike = data?.myBulletEmojiLike
        if (myLike && myLike.choice === choice) {
          upsertBulletEmojiLike({
            variables: {
              bulletEmojiId: foundEmoji.id,
              data: { choice: 'NEUTRAL' },
            },
          })
        }
        if (myLike && myLike.choice !== choice) {
          upsertBulletEmojiLike({
            variables: {
              bulletEmojiId: foundEmoji.id,
              data: { choice },
            },
          })
        }
        if (myLike === null) {
          upsertBulletEmojiLike({
            variables: {
              bulletEmojiId: foundEmoji.id,
              data: { choice },
            },
          })
        }
        // upsertEmojiLike({variables:{hashtagId:foundEmoji.id,data:{choice:}}})
      } else {
        createBulletEmoji({ variables: { bulletId, code: emojiCode } })
      }
    }
  }

  return (
    <div
      className={`${className} ${classes.default} ${data?.myBulletEmojiLike?.choice === 'UP' && classes.clicked}`}
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
