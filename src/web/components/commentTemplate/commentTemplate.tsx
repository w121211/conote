import React, { useState } from 'react'
import { Comment } from 'antd'
import { DislikeOutlined, LikeOutlined, DislikeFilled, LikeFilled } from '@ant-design/icons'
import moment from 'moment'
import { MyTooltip } from '../my-tooltip/my-tooltip'
import MyTextArea from '../myTextArea/myTextArea'
import classes from './commentTemplate.module.scss'

interface commentTemplate {
  id?: string
  content?: string
  //   action: ReactElement[]
  floor?: string
  className?: string
  clicked?: boolean
  updatedAt: any
  // type?: string | undefined
}

const CommenTemplate = ({ id, content, floor, className, clicked, updatedAt }: commentTemplate) => {
  const [likes, setLikes] = useState(0)
  const [dislikes, setDislikes] = useState(0)
  const [action, setAction] = useState('')

  const like = () => {
    setLikes(1)
    setDislikes(0)
    setAction('liked')
  }

  const dislike = () => {
    setLikes(0)
    setDislikes(1)
    setAction('disliked')
  }

  const [textArea, setTextArea] = useState(false)

  const toggleTextAreaHandler = (e: any) => {
    e.stopPropagation()
    setTextArea(!textArea)
  }

  const onFocusHandler = (e: any) => {
    e.stopPropagation()
  }

  // const actions = [
  //   <Tooltip key="comment-basic-like" title="Like">
  //     <span onClick={like}>
  //       {React.createElement(action === 'liked' ? LikeFilled : LikeOutlined)}
  //       <span className="comment-action">{likes}</span>
  //     </span>
  //   </Tooltip>,
  //   <Tooltip key="comment-basic-dislike" title="Dislike">
  //     <span onClick={dislike}>
  //       {React.createElement(action === 'disliked' ? DislikeFilled : DislikeOutlined)}
  //       <span className="comment-action">{dislikes}</span>
  //     </span>
  //   </Tooltip>,
  //   // parent ? (
  //   //   <span id={`1`} key="comment-basic-reply-to" onClick={toggleTextAreaHandler}>
  //   //     回覆
  //   //   </span>
  //   // ) : null,
  // ]

  return (
    <MyTooltip title="點擊回覆">
      <Comment
        className={classes.comment}
        author={floor}
        // actions={actions}
        content={content}
        datetime={moment(updatedAt).format('YYYY-MM-DD')}
      />
    </MyTooltip>
  )
}
export default CommenTemplate
