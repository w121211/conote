import { BulletLike } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import {
  CommentCount,
  useCreateCommentLikeMutation,
  MyCommentLikesDocument,
  MyCommentLikesQuery,
  useMyCommentLikesQuery,
  useUpdateCommentLikeMutation,
  LikeChoice,
  BulletCount,
  // useMyBulletLikesQuery,
  // MyBulletLikesQuery,
  // MyBulletLikesDocument,
  // useCreateBulletLikeMutation,
  // useUpdateBulletLikeMutation,
  CommentLike,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'

const UpDown = ({
  choice,
  commentId,
  bulletId,
}: {
  choice: CommentCount | BulletCount
  commentId?: string
  bulletId?: string
}) => {
  const [myChoice, setMyChoice] = useState<any>()
  const { data: myCommentLikeData, loading, error } = useMyCommentLikesQuery()
  // const {
  //   data: myBulletLikeData,
  //   loading: myBulletLikeLoading,
  //   error: myBulletLikeLoadingError,
  // } = useMyBulletLikesQuery()
  // const [createBulletLike] = useCreateBulletLikeMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<MyBulletLikesQuery>({ query: MyCommentLikesDocument })
  //     if (res?.myBulletLikes && data?.createBulletLike) {
  //       cache.writeQuery<MyBulletLikesQuery>({
  //         query: MyBulletLikesDocument,
  //         data: { myBulletLikes: res.myBulletLikes.concat([data.createBulletLike.like]) },
  //       })
  //     }
  //   },
  // })
  const [createCommentLike] = useCreateCommentLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyCommentLikesQuery>({ query: MyCommentLikesDocument })
      if (res?.myCommentLikes && data?.createCommentLike) {
        cache.writeQuery<MyCommentLikesQuery>({
          query: MyCommentLikesDocument,
          data: { myCommentLikes: res.myCommentLikes.concat([data.createCommentLike.like]) },
        })
      }
    },
  })

  const [updateCommentLike] = useUpdateCommentLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyCommentLikesQuery>({
        query: MyCommentLikesDocument,
      })
      if (res?.myCommentLikes && data?.updateCommentLike) {
        cache.writeQuery<MyCommentLikesQuery>({
          query: MyCommentLikesDocument,
          data: { myCommentLikes: res.myCommentLikes.concat([data.updateCommentLike.like]) },
        })
      }
    },
  })
  // const [updateBulletLike] = useUpdateBulletLikeMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<MyBulletLikesQuery>({
  //       query: MyBulletLikesDocument,
  //     })
  //     if (res?.myBulletLikes && data?.updateBulletLike) {
  //       cache.writeQuery<MyBulletLikesQuery>({
  //         query: MyBulletLikesDocument,
  //         data: { myBulletLikes: res.myBulletLikes.concat([data.updateBulletLike.like]) },
  //       })
  //     }
  //   },
  // })

  const handleMyChoice = () => {
    if (commentId) {
      return myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
    }
    // if (bulletId) {
    //   return myBulletLikeData?.myBulletLikes.find(e => e.bulletId === parseInt(bulletId))
    // }
    return undefined
  }
  // useEffect(() => {
  //   const res = handleMyChoice()
  //   setMyChoice(res)
  // }, [myCommentLikeData, myBulletLikeData])

  const handleLike = (choiceValue: LikeChoice) => {
    if (myChoice && myChoice.choice === choiceValue) {
      if (commentId) {
        updateCommentLike({
          variables: {
            id: myChoice.id,
            data: { choice: 'NEUTRAL' },
          },
        })
      }
      // if (bulletId) {
      //   updateBulletLike({
      //     variables: {
      //       id: myChoice.id,
      //       data: { choice: 'NEUTRAL' },
      //     },
      //   })
      // }
    }
    if (myChoice && myChoice.choice !== choiceValue) {
      if (commentId) {
        updateCommentLike({
          variables: {
            id: myChoice.id,
            data: { choice: choiceValue },
          },
        })
      }
      // if (bulletId) {
      //   updateBulletLike({
      //     variables: {
      //       id: myChoice.id,
      //       data: { choice: choiceValue },
      //     },
      //   })
      // }
    }
    if (!myChoice) {
      if (commentId) {
        createCommentLike({
          variables: {
            commentId,
            data: { choice: choiceValue },
          },
        })
      }
      // if (bulletId) {
      //   createBulletLike({
      //     variables: {
      //       bulletId,
      //       data: { choice: choiceValue },
      //     },
      //   })
      // }
    }
  }
  return (
    <>
      <span className={classes.upDownWrapper}>
        <span
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
        </span>
      </span>
    </>
  )
}

export default UpDown
