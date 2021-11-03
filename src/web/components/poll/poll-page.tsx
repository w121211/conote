import React, { forwardRef, useEffect, useRef, useState } from 'react'
import { Poll, usePollQuery } from '../../apollo/query.graphql'

import useMeasure from 'react-use-measure'
// import { Hashtag, HashtagGroup } from '../../lib/hashtag/types'
import // useCreateReplyMutation,
// useCommentQuery,
// useRepliesQuery,
// RepliesQueryVariables,
// RepliesDocument,
'../../apollo/query.graphql'
import CommentList from '../commentList/commentList'
import PollForm, { FormInputs } from '../poll-form/poll-form'
// import LineChart from '../../__deprecated__/lineChart'
import BarChart from '../bar/bar'
import classes from './board-page.module.scss'
import AuthorPollForm from '../poll-form/author-poll-form'

const PollPage = ({
  pollId,
  // description,
  clickedChoiceIdx,

  title,
  author,
}: {
  // boardId: string
  pollId: string
  clickedChoiceIdx?: number
  author?: string
  //  description?:string

  title?: string
}): JSX.Element => {
  // const [measureRef, bounds] = useMeasure()
  // const [boardValue, setBoardValue] = useState<Board>()
  // const [pollValue, setPollValue] = useState([''])
  // const [commentsList, setCommentsList] = useState<Comment[]>()
  // const [filterCommentsList, setFilterCommentsList] = useState<number[]>()
  // const [form] = Form.useForm()

  const { data, loading, error } = usePollQuery({
    variables: { id: pollId },
  })

  if (loading) {
    return <p>loading...</p>
  }
  if (error) {
    console.error(error)
    return <p>API error</p>
  }
  // if (!data || !data.comment) {
  //   return <p>Comment not found</p>
  // }
  // const [hideBoard, setHideBoard] = useState(false)
  // useEffect(()=>{
  //   return ()=>{if(!hideBoard)}
  // })
  // console.log(boardId)
  // const { data: boardData, loading, error } = useBoardQuery({ variables: { id: boardId } })
  // console.log(boardData?.board?.bulletId)
  // const {
  //   data: commentsData,
  //   loading: commentsLoading,
  //   error: commentsError,
  //   refetch: commentsRetch,
  // } = useCommentsQuery({
  //   // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
  //   variables: { boardId: boardId },
  //   fetchPolicy: 'cache-first',
  // })

  // useEffect(() => {
  //   if (boardData?.board) {
  //     setBoardValue(boardData.board)
  //   }
  //   if (boardData?.board?.poll) {
  //     setPollValue(boardData.board.poll.choices)
  //   }
  // }, [boardData])

  // useEffect(() => {
  //   if (commentsData?.comments) {
  //     setCommentsList(commentsData.comments)
  //   }
  // }, [commentsData])

  // const filterComments = (i: number) => {
  //   // const newCommentList=
  //   // const regex = new RegExp(`^<${pollValue[i]}> .+`, 'gm')

  //   i !== -1
  //     ? setCommentsList(
  //         commentsData?.comments &&
  //           commentsData.comments.filter((e, ind) => e.content.startsWith(`<${pollValue[i]}> `)),
  //       )
  //     : setCommentsList(commentsData?.comments)

  //   // console.log(commentsList && commentsList[i] && commentsList[i].content)
  //   // setFilterCommentsList(newCommentList)
  //   // console.log(commentsList, newCommentList)
  // }
  if (data && data.poll) {
    return (
      <>
        <div className={classes.containerinner}>
          {/* <div ref={measureRef}> */}
          {/* <div className={classes.tabs}> */}
          {/* <span onClick={discussClickLHandler}>討論</span>
            <span onClick={discussClickRHandler}>Q&A</span> */}
          {/* </div> */}
          <div className={classes.title}>{data.poll.choices}</div>

          {/* tabs底線 */}
          <div className={classes.underLine} />
          <h5>投票身份</h5>
          <span>{author ? author : '我'}</span>
          {/* <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div> */}
          {/* </div> */}
          {/* {pollId && boardValue?.poll && <BarChart pollData={boardValue.poll} />} */}
          {author ? (
            <AuthorPollForm
              pollId={pollId}
              author={author}
              clickedChoiceIdx={clickedChoiceIdx}
              initialValue={{ title: '', choice: undefined, lines: '' }}
            />
          ) : (
            <PollForm
              // boardId={boardId}
              pollId={pollId}
              initialValue={{ title: '', choice: undefined, lines: '' }}
              // filterComments={filterComments}
              clickedChoiceIdx={clickedChoiceIdx}
            />
          )}
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
          {/* <CommentList
          commentsList={commentsList}
          // filterCommentsList={filterCommentsList}
          // pollId={pollId}
          // switchTab={switchTab}
          // anchorHLHandler={anchorHLHandler}
          // myScrollIntoView={myScrollIntoView}
          // resetHighLight={resetHighLight}
        /> */}
          {/* </div>
          </div>
        </div> */}
        </div>
      </>
    )
  }
  return <h4>好像出錯了...</h4>
}

// Discuss.displayName = 'Discuss'
export default PollPage
