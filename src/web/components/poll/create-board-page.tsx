import React, { forwardRef, useEffect, useRef, useState } from 'react'

import useMeasure from 'react-use-measure'
import // useCreateReplyMutation,
// useCommentQuery,
// useRepliesQuery,
// RepliesQueryVariables,
// RepliesDocument,
'../../apollo/query.graphql'
import CreateBoardFrom, { BoardFormInputs } from '../poll-form/_create-board-form'
// import LineChart from '../../__deprecated__/lineChart'
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
  subTitle: string
}): JSX.Element => {
  const [measureRef, bounds] = useMeasure()
  const [boardId, setBoardId] = useState<string | undefined>()
  const [title, setTitle] = useState('')
  // const [boardValue, setBoardValue] = useState<Board>()
  const [pollValue, setPollValue] = useState([''])
  const [commentsList, setCommentsList] = useState<Comment[]>()
  const [filterCommentsList, setFilterCommentsList] = useState<number[]>()

  // const handleBoardId = (d: CreateHashtagMutation) => {
  //   setTitle(d.createHashtag.board.hashtag)
  //   setBoardId(d.createHashtag.board.id)
  // }
  // console.log(boardId)

  return (
    <Popover visible={visible} hideBoard={hideBoard} subTitle={subTitle}>
      <div className={classes.containerinner}>
        {/* {pollId && <LineChart />} */}
        {/* {boardId ? (
          <>
            <BoardPage boardId={boardId} title={title} />
          </>
        ) : (
          <CreateBoardFrom bulletId={bulletId} cardId={cardId} handleboardId={handleBoardId} />
        )} */}
      </div>
    </Popover>
  )
}

// Discuss.displayName = 'Discuss'
export default CreateBoardPage
