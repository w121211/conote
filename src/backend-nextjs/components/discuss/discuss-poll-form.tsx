import { useState, forwardRef } from 'react'
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
} from '../../apollo/query.graphql'
import { Form, Button, Radio } from 'antd'
import Radios from '../radios/radios'
import MyTextArea from '../myTextArea/myTextArea'
import BarChart from '../bar/bar'

export const PollForm = forwardRef(({ commentId }: { commentId: string }, ref) => {
  const [buttonDisable, setButtonState] = useState(true)
  const [commentValue, setValue] = useState('')
  const [radioValue, setRadioValue] = useState<number>()
  const [form] = Form.useForm()
  const onSubmit = () => {
    form.submit()
  }
  const { data: commentsData, loading: commentsLoading, error: commentsError } = useCommentQuery({
    variables: { id: commentId },
  })
  const { data: myVotesData, loading, error } = useMyVotesQuery({ fetchPolicy: 'cache-only' })
  const meVote = myVotesData?.myVotes.find(e => e.pollId === Number(commentsData?.comment?.poll?.id))
  //   const { data: repliesData, loading: repliesLoading, error: repliesError } = useRepliesQuery({
  //     // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
  //     variables: { commentId },
  //   })

  //   const { data, loading, error } = useCommentQuery({
  //     variables: { id: commentId },
  //   })
  const [createReply] = useCreateReplyMutation({
    update(cache, { data }) {
      const res = cache.readQuery<RepliesQuery, RepliesQueryVariables>({
        query: RepliesDocument,
        variables: { commentId },
      })
      if (data?.createReply && res?.replies) {
        cache.writeQuery({
          query: RepliesDocument,
          variables: { commentId },
          data: { replies: [data?.createReply].concat(res.replies) },
        })
        // addReplyCountByOne()
        form.resetFields()
      }
    },
  })

  const [createVote] = useCreateVoteMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyVotesQuery>({
        query: MyVotesDocument,
      })
      if (data?.createVote && res?.myVotes) {
        cache.writeQuery({
          query: MyVotesDocument,
          data: { myVotes: res.myVotes.concat([data.createVote]) },
        })
      }
    },
  })

  //   const radioChangeHandler = (e: any) => {
  //     setOption(e.target.value)
  //   }

  const onFinish = (values: any) => {
    if (values.votes) {
      createVote({
        variables: {
          pollId: `${commentsData?.comment?.poll?.id}`,
          choiceIdx: values.votes,
        },
      })
    }
    if (values.text) {
      createReply({
        variables: {
          commentId: commentId,
          data: {
            text: `${
              commentsData?.comment?.poll?.choices[values.votes]
                ? commentsData?.comment?.poll?.choices[values.votes]
                : ''
            }${values.text}`,
          },
        },
      })
    }

    form.resetFields()
    console.log(
      `finish commentId:${commentId} pollId:${commentsData?.comment?.poll?.id} ${
        commentsData?.comment?.poll?.choices[values.votes]
      } ${values.text} ${values.votes} meVote.pollId:${meVote?.pollId}`,
    )
  }

  const onRadioChange = ({ votes }: { votes: number }) => {
    if (votes !== undefined) {
      setButtonState(false)
    }
    setRadioValue(votes)
  }

  const total =
    commentsData?.comment?.poll?.count.nVotes.length === 0
      ? 0
      : commentsData?.comment?.poll?.count.nVotes.reduce((a, b) => a + b)
  const count =
    commentsData?.comment?.poll?.count.nVotes.length === 0
      ? Array(commentsData.comment.poll.choices.length).fill(0)
      : commentsData?.comment?.poll?.count.nVotes

  return (
    <Form form={form} onFinish={onFinish} onValuesChange={onRadioChange}>
      <MyTextArea />
      {/* </Form.Item> */}

      <Form.Item name="votes">
        {/* {commentsData.comment.poll.choices.map((e, i) => (
            ))} */}
        <Radio.Group value={radioValue}>
          {count?.map((e, i) => (
            <div key={i}>
              <Radio value={i}>{commentsData?.comment?.poll?.choices[i]}</Radio>
              {/* <div key={i}> */}
              {/* <Radios data={commentsData.comment?.poll?.choices} countsHandler={countsHandler} /> */}
              {/* <label>
                <input type="radio" value={i} onChange={radioChangeHandler} checked={option === `${i}`} />
                {commentsData.comment?.poll?.choices[i]}
              </label>
             </div> */}
              <BarChart count={e} total={total && total} />
            </div>
          ))}
        </Radio.Group>
        {/* <button type="submit">送出</button> */}
      </Form.Item>

      <Button type="text" disabled={buttonDisable} onClick={onSubmit}>
        送出
      </Button>
    </Form>
  )
})
