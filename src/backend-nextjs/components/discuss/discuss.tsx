import React, { forwardRef, useRef, useState } from 'react'
import { Form } from 'antd'
import useMeasure from 'react-use-measure'
import {
  useCreateReplyMutation,
  useCommentQuery,
  RepliesQuery,
  RepliesQueryVariables,
  RepliesDocument,
} from '../../apollo/query.graphql'
import CommentList from '../commentList/commentList'
import { CommentForm } from './discuss-comment-form'
import classes from './discuss-page.module.scss'

const Discuss = ({
  switchTab,
  commentId,
  anchorId,
  discussClickLHandler,
  discussClickRHandler,
}: {
  switchTab: boolean
  commentId: string
  anchorId: string
  discussClickLHandler: () => void
  discussClickRHandler: () => void
}) => {
  const [ref, bounds] = useMeasure()
  const [form] = Form.useForm()

  const { data, loading, error } = useCommentQuery({
    variables: { id: commentId },
  })

  if (loading) {
    return <p>loading...</p>
  }
  if (error) {
    console.error(error)
    return <p>API error</p>
  }
  if (!data || !data.comment) {
    return <p>Comment not found</p>
  }

  const classLister = (...classArr: string[]) => {
    const arr: string[] = []
    classArr.forEach(className => {
      arr.push(classes[className])
    })
    return arr.join(' ')
  }

  return (
    <div className={classes.container}>
      <div ref={ref}>
        <div className={classes.tabs}>
          <span onClick={discussClickLHandler}>討論</span>
          <span onClick={discussClickRHandler}>Q&A</span>
        </div>

        {/* tabs底線 */}
        <div className={classes.underLine}>
          <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div>
        </div>
        <CommentForm commentId={commentId} />
      </div>

      {/* content */}
      <div className={classes.outer} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
        <div className={classes.inner}>
          <div className={classes.element} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
            {switchTab && <CommentList commentId={commentId} />}
            {switchTab || <CommentList type="vote" commentId={commentId} />}
          </div>
        </div>
      </div>
    </div>
  )
}
Discuss.displayName = 'Discuss'
export default Discuss
