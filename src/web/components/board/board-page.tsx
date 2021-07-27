import React, { forwardRef, useEffect, useRef, useState } from 'react'
import {
  useCreateCommentMutation,
  CommentsDocument,
  CommentsQuery,
  useBoardQuery,
  Board,
  useCommentsQuery,
  Comment,
} from '../../apollo/query.graphql'

import useMeasure from 'react-use-measure'
import // useCreateReplyMutation,
// useCommentQuery,
// useRepliesQuery,
// RepliesQueryVariables,
// RepliesDocument,
'../../apollo/query.graphql'
import CommentList from '../commentList/commentList'
import BoardFrom, { FormInputs } from '../board-form/board-form'
// import LineChart from '../../__deprecated__/lineChart'
import BarChart from '../bar/bar'
import classes from './board-page.module.scss'

const BoardPage = ({
  boardId,
  pollId,
  // description,

  title,
}: {
  boardId: string
  pollId?: string
  //  description?:string

  title?: string
}) => {
  const [measureRef, bounds] = useMeasure()
  const [boardValue, setBoardValue] = useState<Board>()
  const [pollValue, setPollValue] = useState([''])
  const [commentsList, setCommentsList] = useState<Comment[]>()
  const [filterCommentsList, setFilterCommentsList] = useState<number[]>()
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
  // console.log(boardId)
  const { data: boardData, loading, error } = useBoardQuery({ variables: { id: boardId } })
  // console.log(boardData?.board?.bulletId)
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: commentsRetch,
  } = useCommentsQuery({
    // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
    variables: { boardId: boardId },
    fetchPolicy: 'cache-first',
  })

  useEffect(() => {
    if (boardData?.board) {
      setBoardValue(boardData.board)
    }
    if (boardData?.board?.poll) {
      setPollValue(boardData.board.poll.choices)
    }
  }, [boardData])

  useEffect(() => {
    if (commentsData?.comments) {
      setCommentsList(commentsData.comments)
    }
  }, [commentsData])

  const filterComments = (i: number) => {
    // const newCommentList=
    // const regex = new RegExp(`^<${pollValue[i]}> .+`, 'gm')

    i !== -1
      ? setCommentsList(
          commentsData?.comments &&
            commentsData.comments.filter((e, ind) => e.content.startsWith(`<${pollValue[i]}> `)),
        )
      : setCommentsList(commentsData?.comments)

    // console.log(commentsList && commentsList[i] && commentsList[i].content)
    // setFilterCommentsList(newCommentList)
    // console.log(commentsList, newCommentList)
  }

  return (
    <>
      <div className={classes.containerinner}>
        {/* <div ref={measureRef}> */}
        {/* <div className={classes.tabs}> */}
        {/* <span onClick={discussClickLHandler}>討論</span>
            <span onClick={discussClickRHandler}>Q&A</span> */}
        {/* </div> */}
        <div className={classes.title}>{title}</div>
        {boardData?.board?.content && <div>{boardData.board.content}</div>}
        {/* tabs底線 */}
        {/* <div className={classes.underLine}> */}
        {/* <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div> */}
        {/* </div> */}
        {pollId && boardValue?.poll && <BarChart pollData={boardValue.poll} />}
        <BoardFrom
          boardId={boardId}
          pollId={pollId}
          initialValue={{ title: '', choice: undefined, lines: '' }}
          pollChoices={pollValue}
          refetch={() => {
            commentsRetch()
          }}
          filterComments={filterComments}
        />
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
          commentsList={commentsList}
          // filterCommentsList={filterCommentsList}
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
    </>
  )
}

// Discuss.displayName = 'Discuss'
export default BoardPage
