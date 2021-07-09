import React, { forwardRef, useEffect, useRef, useState } from 'react'
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
import BoardFrom from '../board-form/board-form'
import LineChart from '../bar/lineChart'
import classes from './discuss-page.module.scss'

const Discuss = ({
  boardId,
  pollId,
  visible,
  hideBoard,
}: {
  boardId: string
  pollId?: string
  visible: boolean
  hideBoard: () => void
}) => {
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
  // const [hideBoard, setHideBoard] = useState(false)
  // useEffect(()=>{
  //   return ()=>{if(!hideBoard)}
  // })

  return (
    <div className={classes.containerouter} style={visible ? { visibility: 'visible' } : { visibility: 'hidden' }}>
      <span
        onClick={() => {
          hideBoard()
        }}
      >
        back
      </span>
      <div className={classes.containerinner}>
        {/* <div ref={measureRef}> */}
        {/* <div className={classes.tabs}> */}
        {/* <span onClick={discussClickLHandler}>討論</span>
            <span onClick={discussClickRHandler}>Q&A</span> */}
        {/* </div> */}
        <div className={classes.title}>@title</div>
        {/* tabs底線 */}
        {/* <div className={classes.underLine}> */}
        {/* <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div> */}
        {/* </div> */}
        <LineChart />
        <BoardFrom initialValue={{ title: '', choice: '', lines: '' }} />
        {/* <CommentForm
        boardId={boardId}
        pollId={pollId}
        // anchorId={anchorId}
        // ref={ref}
        // switchTab={switchTab}
      /> */}
        {/* {switchTab || <PollForm commentId={pollClick} />} */}
        {/* </div> */}
        {/* content */}
        {/* <div className={classes.outer} style={{ height: `calc(100vh - ${bounds.height}px)` }}> */}
        {/* <div className={classes.inner}> */}
        {/* <div className={classes.element} style={{ height: `calc(100vh - ${bounds.height}px)` }}> */}
        <CommentList
          boardId={boardId}
          // pollId={pollId}
          // switchTab={switchTab}
          // anchorHLHandler={anchorHLHandler}
          // myScrollIntoView={myScrollIntoView}
          // resetHighLight={resetHighLight}
        />
        {/* </div>
          </div>
        </div> */}
      </div>
    </div>
  )
}

// Discuss.displayName = 'Discuss'
export default Discuss
