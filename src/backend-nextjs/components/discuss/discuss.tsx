import React, { forwardRef, useRef, useState } from 'react'
import { Form } from 'antd'
import useMeasure from 'react-use-measure'
import {
  useCreateReplyMutation,
  useCommentQuery,
  useRepliesQuery,
  RepliesQueryVariables,
  RepliesDocument,
} from '../../apollo/query.graphql'
import CommentList from '../commentList/commentList'
import { CommentForm } from './discuss-comment-form'
import { PollForm } from './discuss-poll-form'
import classes from './discuss-page.module.scss'

const Discuss = forwardRef(
  (
    {
      switchTab,
      commentId,
      cardCommentId,
      anchorId,
      pollCommentId,
      pollClick,
      discussClickLHandler,
      discussClickRHandler,
    }: {
      switchTab: boolean
      commentId: string
      cardCommentId: string
      anchorId: string
      pollCommentId: string[]
      pollClick: string
      discussClickLHandler: () => void
      discussClickRHandler: () => void
    },
    ref,
  ) => {
    const [measureRef, bounds] = useMeasure()
    // const [form] = Form.useForm()

    // const { data, loading, error } = useCommentQuery({
    //   variables: { id: commentId },
    // })

    // if (loading) {
    //   return <p>loading...</p>
    // }
    // if (error) {
    //   console.error(error)
    //   return <p>API error</p>
    // }
    // if (!data || !data.comment) {
    //   return <p>Comment not found</p>
    // }

    const classLister = (...classArr: string[]) => {
      const arr: string[] = []
      classArr.forEach(className => {
        arr.push(classes[className])
      })
      return arr.join(' ')
    }

    return (
      <div className={classes.container}>
        <div ref={measureRef}>
          <div className={classes.tabs}>
            <span onClick={discussClickLHandler}>討論</span>
            <span onClick={discussClickRHandler}>Q&A</span>
          </div>

          {/* tabs底線 */}
          <div className={classes.underLine}>
            <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div>
          </div>
          <CommentForm
            commentId={cardCommentId}
            pollCommentId={pollClick}
            anchorId={anchorId}
            ref={ref}
            switchTab={switchTab}
          />
          {/* {switchTab || <PollForm commentId={pollClick} />} */}
        </div>

        {/* content */}
        <div className={classes.outer} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
          <div className={classes.inner}>
            <div className={classes.element} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
              {switchTab && <CommentList commentId={cardCommentId} />}
              {switchTab || <CommentList commentId={pollClick} />}
            </div>
          </div>
        </div>
      </div>
    )
  },
)
// Discuss.displayName = 'Discuss'
export default Discuss
