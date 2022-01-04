import React, { useEffect, useState } from 'react'
// import { CommentCount } from '../../apollo/query.graphql'
import UpDown from '../emoji-up-down/emoji-up-down'
import classes from './commentTemplate.module.scss'

interface commentTemplate {
  id?: string
  content?: string
  //   action: ReactElement[]
  floor?: string
  className?: string
  clicked?: boolean
  updatedAt?: any
  choice: CommentCount
  commentId: string
  // type?: string | undefined
}

const CommenTemplate = ({ id, content, floor, className, clicked, updatedAt, choice, commentId }: commentTemplate) => {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [action, setAction] = useState('')
  const [textArea, setTextArea] = useState(false)

  // const { data: myCommentLikeData, loading, error } = useMyCommentLikesQuery()
  // const [createCommentLike] = useCreateCommentLikeMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<MyCommentLikesQuery>({ query: MyCommentLikesDocument })
  //     if (res?.myCommentLikes && data?.createCommentLike) {
  //       cache.writeQuery<MyCommentLikesQuery>({
  //         query: MyCommentLikesDocument,
  //         data: { myCommentLikes: res.myCommentLikes.concat([data.createCommentLike.like]) },
  //       })
  //     }
  //   },
  // })

  // const [updateCommentLike] = useUpdateCommentLikeMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<MyCommentLikesQuery>({
  //       query: MyCommentLikesDocument,
  //     })
  //     if (res?.myCommentLikes && data?.updateCommentLike) {
  //       cache.writeQuery<MyCommentLikesQuery>({
  //         query: MyCommentLikesDocument,
  //         data: { myCommentLikes: res.myCommentLikes.concat([data.updateCommentLike.like]) },
  //       })
  //     }
  //   },
  // })

  // const myChoice = myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
  // // useEffect(()=>{
  // //   if(myChoice){
  // //     set
  // //   }
  // // })

  const toggleTextAreaHandler = (e: any) => {
    e.stopPropagation()
    setTextArea(!textArea)
  }

  const like = () => {
    setLikes(1)
    setDislikes(0)
    // setAction('liked')
  }

  const dislike = () => {
    setLikes(0)
    setDislikes(1)
    // setAction('disliked')
  }

  const onFocusHandler = (e: any) => {
    e.stopPropagation()
  }

  // const handleLike = (choiceValue: LikeChoice) => {

  //   if (myChoice && myChoice.choice === choiceValue) {
  //     updateCommentLike({
  //       variables: {
  //         id: myChoice.id,
  //         data: { choice: 'NEUTRAL' },
  //       },
  //     })
  //   }
  //   if (myChoice && myChoice.choice !== choiceValue) {
  //     updateCommentLike({
  //       variables: {
  //         id: myChoice.id,
  //         data: { choice: choiceValue },
  //       },
  //     })
  //   }
  //   if (!myChoice) {
  //     createCommentLike({
  //       variables: {
  //         commentId,
  //         data: { choice: choiceValue },
  //       },
  //     })
  //   }
  // }

  return (
    // <MyTooltip title="點擊回覆">
    //   <Comment
    //     className={classes.comment}
    //     author={floor}
    //     actions={actions}
    //     content={content}
    //     // datetime={moment(updatedAt).format('YYYY-MM-DD')}
    //   />
    // </MyTooltip>
    <li className={classes.comment}>
      <span className={classes.floor}>{floor}</span>
      {/* <UpDown commentId={commentId} choice={choice} /> */}
      <span>{content}</span>
    </li>
  )
}
export default CommenTemplate
