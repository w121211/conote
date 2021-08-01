import React from 'react'
import {
  CommentCount,
  useCreateCommentLikeMutation,
  MyCommentLikesDocument,
  MyCommentLikesQuery,
  useMyCommentLikesQuery,
  useUpdateCommentLikeMutation,
  LikeChoice,
} from '../../apollo/query.graphql'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'
import classes from './upDown.module.scss'

const UpDown = ({ choice, commentId }: { choice: CommentCount; commentId: string }) => {
  const { data: myCommentLikeData, loading, error } = useMyCommentLikesQuery()
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

  const myChoice = myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
  const handleLike = (choiceValue: LikeChoice) => {
    if (myChoice && myChoice.choice === choiceValue) {
      updateCommentLike({
        variables: {
          id: myChoice.id,
          data: { choice: 'NEUTRAL' },
        },
      })
    }
    if (myChoice && myChoice.choice !== choiceValue) {
      updateCommentLike({
        variables: {
          id: myChoice.id,
          data: { choice: choiceValue },
        },
      })
    }
    if (!myChoice) {
      createCommentLike({
        variables: {
          commentId,
          data: { choice: choiceValue },
        },
      })
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
