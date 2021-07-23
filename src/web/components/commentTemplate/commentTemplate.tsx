import React, { useEffect, useState } from 'react'
import {
  CommentCount,
  useCreateCommentLikeMutation,
  MyCommentLikesDocument,
  MyCommentLikesQuery,
  useMyCommentLikesQuery,
} from '../../apollo/query.graphql'
// import { Comment } from 'antd'
// import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons'
import moment from 'moment'
import { MyTooltip } from '../my-tooltip/my-tooltip'
import MyTextArea from '../myTextArea/myTextArea'
import classes from './commentTemplate.module.scss'
import ArrowUpIcon from '../../assets/svg/arrow-up.svg'

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

  const myChoice = myCommentLikeData?.myCommentLikes.find(e => e.commentId === parseInt(commentId))
  // useEffect(()=>{
  //   if(myChoice){
  //     set
  //   }
  // })

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

  const handleLike = (choiceValue: string) => {
    if (choiceValue === 'up') {
      createCommentLike({
        variables: {
          commentId,
          data: { choice: 'UP' },
        },
      })
    }
    if (choiceValue === 'down') {
      createCommentLike({
        variables: {
          commentId,
          data: { choice: 'DOWN' },
        },
      })
    }
  }

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
      <span className={classes.upDownWrapper}>
        <span
          className={`${classes.arrowUpIcon} ${myChoice && myChoice.choice === 'UP' && classes.liked}`}
          onClick={() => {
            handleLike('up')
          }}
        >
          <ArrowUpIcon />
          {choice.nUps}
        </span>
        <span
          className={`${classes.arrowDownIcon} ${myChoice && myChoice.choice === 'DOWN' && classes.liked}`}
          onClick={() => {
            handleLike('down')
          }}
        >
          <ArrowUpIcon />
          {choice.nDowns}
        </span>
      </span>
      <span>{content}</span>
    </li>
  )
}
export default CommenTemplate
