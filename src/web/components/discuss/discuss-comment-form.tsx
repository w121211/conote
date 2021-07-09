import { useState, forwardRef, useEffect } from 'react'
import {
  useCreateReplyMutation,
  useCommentQuery,
  RepliesQuery,
  RepliesQueryVariables,
  RepliesDocument,
  useRepliesQuery,
  useCreateVoteMutation,
  CommentQuery,
  CommentQueryVariables,
  CommentDocument,
  MyVotesDocument,
  MyVotesQuery,
  useMyVotesQuery,
  MyVotesQueryResult,
  Vote,
} from '../../apollo/query.graphql'
import { Form, Button, Radio } from 'antd'
import Radios from '../radios/radios'
import MyTextArea from '../myTextArea/myTextArea'
import BarChart from '../bar/bar'
import classes from './discuss-page.module.scss'
// import { setUncaughtExceptionCaptureCallback } from 'node:process'
// import { useSubscription } from '@apollo/client'

export const CommentForm = forwardRef(
  (
    {
      boardId,

      pollId,
    }: { boardId: string; pollId?: string },
    ref,
  ) => {
    const [buttonDisable, setButtonState] = useState(true)
    const [commentValue, setValue] = useState('')
    const [voteValue, setVoteValue] = useState<number>()
    const [voteCount, setVoteCount] = useState<number[]>([])
    // const [votedIdx, setVotedIdx] = useState<number>()
    const [total, setTotal] = useState(0)
    // const [commentId, setcommentId] = useState<string>(commentId)
    const [rerender, setRerender] = useState(false)

    const [form] = Form.useForm()
    const onSubmit = () => {
      form.submit()
    }
    // useEffect(() => {
    //   if (switchTab) {
    //     setcommentId(commentId)
    //   } else {
    //     setcommentId(pollCommentId)
    //   }
    // }, [switchTab])

    // const {
    //   data: commentsData,
    //   loading: commentsLoading,
    //   error: commentsError,
    //   refetch: refetchComment,
    // } = useCommentQuery({
    //   variables: { id: boardId },
    //   fetchPolicy: 'cache-first',
    // })

    const {
      data: myVotesData,
      loading: myVotesLoading,
      error: myVotesError,
    } = useMyVotesQuery({
      fetchPolicy: 'cache-first',
    })
    // if(commentsData&&!commentsLoading&&!myVotesLoading&&!commentsError&&!myVotesError){
    // useEffect(() => {
    //   if (!commentsLoading && commentsData?.comment?.poll) {
    //     setTotal(commentsData.comment?.poll?.count.nVotes.reduce((a, b) => a + b))
    //     setVoteCount(commentsData.comment.poll.count.nVotes)
    //   }
    // }, [commentsData, commentsLoading])
    // const pollId = commentsData?.comment?.poll?.id
    // const meVote = pollId && myVotesData?.myVotes.find((e, i) => e.pollId === parseInt(pollId))

    const [createReply] = useCreateReplyMutation({
      update(cache, { data }) {
        const res = cache.readQuery<RepliesQuery, RepliesQueryVariables>({
          query: RepliesDocument,
          variables: { commentId: boardId },
        })
        if (data?.createReply && res?.replies) {
          cache.writeQuery({
            query: RepliesDocument,
            variables: { commentId: boardId },
            data: { replies: [data?.createReply].concat(res.replies) },
          })
          // addReplyCountByOne()

          form.resetFields()
        }
      },
    })

    // const [createVote] = useCreateVoteMutation({
    //   update(cache, { data }) {
    //     const res = cache.readQuery<MyVotesQuery>({
    //       query: MyVotesDocument,
    //     })
    //     if (data?.createVote && res?.myVotes) {
    //       cache.writeQuery({
    //         query: MyVotesDocument,
    //         data: { myVotes: res.myVotes.concat([data.createVote]) },
    //       })
    //       refetchComment()
    //     }
    //   },
    // })

    const onTextChange = ({ text, votes }: { text: string; votes: number }) => {
      if (text) {
        setButtonState(false)
        setValue(text)
      }
      if (votes !== undefined) {
        setButtonState(false)
        setVoteValue(votes)
      }
    }
    //   const radioChangeHandler = (e: any) => {
    //     setOption(e.target.value)
    //   }

    const onFinish = (values: any) => {
      // if (values.votes !== undefined) {
      //   createVote({
      //     variables: {
      //       pollId: `${commentsData?.comment?.poll?.id}`,
      //       choiceIdx: values.votes,
      //     },
      //   })

      //   // setVotedIdx(values.votes)
      // }
      if (values.text) {
        createReply({
          variables: {
            commentId: boardId,
            data: {
              text: `${values.text}`,
            },
          },
        })
      }

      // if (values.text && !switchTab) {
      //   createReply({
      //     variables: {
      //       commentId: boardId,
      //       data: {
      //         text: `${commentsData?.comment?.poll?.choices[values.votes] ?? ''} ${values.text}`,
      //       },
      //     },
      //   })
      // }
      // console.log(total)

      form.resetFields()
      setButtonState(true)

      console.log(boardId)
      // console.log(
      //   `finish commentId:${boardId} pollId:${commentsData?.comment?.poll?.id} anchorId:${anchorId} ${values.text} ${values.votes}`,
      // )
    }
    // const total = commentsData?.comment?.poll?.count.nVotes.reduce((a, b) => a + b)
    return (
      <Form form={form} onFinish={onFinish} onValuesChange={onTextChange}>
        <MyTextArea ref={ref} />

        {
          // !switchTab && voteCount && (
          //   <>
          //     <div>共{total}人參與投票</div>
          //     {meVote ? (
          //       <div className={classes.radioGroup}>
          //         {voteCount.map((e, i) => (
          //           <div key={i}>
          //             {meVote.choiceIdx === i ? (
          //               <b>{commentsData?.comment?.poll?.choices[i].replace(/^<(.+)>$/g, '$1')}</b>
          //             ) : (
          //               <span>{commentsData?.comment?.poll?.choices[i].replace(/^<(.+)>$/g, '$1')}</span>
          //             )}
          //             <BarChart count={e} total={total ?? 0} />
          //           </div>
          //         ))}
          //       </div>
          //     ) :
          // <Form.Item name="votes">
          //   {/* {commentsData.comment.poll.choices.map((e, i) => (
          //   ))} */}
          //   <Radio.Group value={voteValue} className={classes.radioGroup}>
          //     {voteCount &&
          //       voteCount.map((e, i) => (
          //         <div key={i}>
          //           <Radio value={i}>{commentsData?.comment?.poll?.choices[i].replace(/^<(.+)>$/g, '$1')}</Radio>
          //           {/* <div key={i}> */}
          //           {/* <Radios data={commentsData.comment?.poll?.choices} countsHandler={countsHandler} /> */}
          //           {/* <label>
          //       <input type="radio" value={i} onChange={radioChangeHandler} checked={option === `${i}`} />
          //       {commentsData.comment?.poll?.choices[i]}
          //     </label>
          //    </div> */}
          //           {/* {console.log(e)} */}
          //           <BarChart count={e} total={total ?? 0} />
          //         </div>
          //       ))}
          //   </Radio.Group>
          //   {/* <button type="submit">送出</button> */}
          // </Form.Item>
        }
        {/* </> */}
        {/* )} */}

        <Button id="submitButton" type="text" disabled={buttonDisable} onClick={() => onSubmit()}>
          送出
        </Button>
      </Form>
    )
  },
)
