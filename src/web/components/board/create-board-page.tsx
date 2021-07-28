import React, { forwardRef, useEffect, useRef, useState } from 'react'
import {
  useCreateCommentMutation,
  CommentsDocument,
  CommentsQuery,
  useBoardQuery,
  Board,
  useCommentsQuery,
  Comment,
  CreateHashtagMutation,
} from '../../apollo/query.graphql'

import useMeasure from 'react-use-measure'
import // useCreateReplyMutation,
// useCommentQuery,
// useRepliesQuery,
// RepliesQueryVariables,
// RepliesDocument,
'../../apollo/query.graphql'
import CommentList from '../commentList/commentList'
import CreateBoardFrom, { BoardFormInputs } from '../board-form/create-board-form'
import LineChart from '../bar/lineChart'
import classes from './board-page.module.scss'
import Popover from '../popover/popover'
import BoardPage from './board-page'

const CreateBoardPage = ({
  cardId,
  bulletId,
  visible,
  hideBoard,
  subTitle,
}: {
  cardId: string
  bulletId: number
  visible: boolean
  hideBoard: () => void
  subTitle: JSX.Element
}): JSX.Element => {
  const [measureRef, bounds] = useMeasure()
  const [boardId, setBoardId] = useState<string | undefined>()
  const [title, setTitle] = useState('')
  const [boardValue, setBoardValue] = useState<Board>()
  const [pollValue, setPollValue] = useState([''])
  const [commentsList, setCommentsList] = useState<Comment[]>()
  const [filterCommentsList, setFilterCommentsList] = useState<number[]>()

  const handleBoardId = (d: CreateHashtagMutation) => {
    // setTitle(d.createHashtag.hashtag)
    // setBoardId(d.createHashtag.id)
  }
  console.log(boardId)

  return (
    <Popover visible={visible} hideBoard={hideBoard} subTitle={subTitle}>
      <div className={classes.containerinner}>
        {/* {pollId && <LineChart />} */}
        {boardId ? (
          <>
            <BoardPage boardId={boardId} title={title} />
            {console.log(boardId)}
          </>
        ) : (
          <CreateBoardFrom bulletId={bulletId} cardId={cardId} handleboardId={handleBoardId} />
        )}
      </div>
    </Popover>
  )
}

// Discuss.displayName = 'Discuss'
export default CreateBoardPage
