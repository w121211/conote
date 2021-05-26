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

export const CommentForm = forwardRef(
  (
    {
      commentId,
      anchorId,
      switchTab,
      pollCommentId,
    }: { commentId: string; anchorId: string; switchTab: boolean; pollCommentId: string },
    ref,
  ) => {
    const [buttonDisable, setButtonState] = useState(true)
    const [commentValue, setValue] = useState('')
    const [voteValue, setVoteValue] = useState<number>()

    const [form] = Form.useForm()
    const onSubmit = () => {
      form.submit()
    }

    const meCommentId = switchTab ? commentId : pollCommentId
    const { data: commentsData, loading: commentsLoading, error: commentsError } = useCommentQuery({
      variables: { id: meCommentId },
      fetchPolicy: 'cache-first',
    })
    //   const { data: myVotesData, loading, error } = useMyVotesQuery({ fetchPolicy: 'cache-only' })
    //   const meVote = myVotesData?.myVotes.find(e => e.pollId === Number(commentsData?.comment?.poll?.id))
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
          variables: { commentId: meCommentId },
        })
        if (data?.createReply && res?.replies) {
          cache.writeQuery({
            query: RepliesDocument,
            variables: { commentId: meCommentId },
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
      if (values.votes) {
        createVote({
          variables: {
            pollId: `${commentsData?.comment?.poll?.id}`,
            choiceIdx: values.votes,
          },
        })
      }
      if (values.text && switchTab) {
        createReply({
          variables: {
            commentId: meCommentId,
            data: {
              text: `${anchorId}${values.text}`,
            },
          },
        })
      }

      if (values.text && !switchTab) {
        createReply({
          variables: {
            commentId: meCommentId,
            data: {
              text: `${commentsData?.comment?.poll?.choices[values.votes]}${values.text}`,
            },
          },
        })
      }

      form.resetFields()
      console.log(`finish ${meCommentId} ${anchorId} ${values.text}`)
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
      <Form form={form} onFinish={onFinish} onValuesChange={onTextChange}>
        <MyTextArea ref={ref} />
        {switchTab || (
          <Form.Item name="votes">
            {/* {commentsData.comment.poll.choices.map((e, i) => (
            ))} */}
            <Radio.Group value={voteValue}>
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
        )}
        <Button type="text" disabled={buttonDisable} onClick={onSubmit}>
          送出
        </Button>
      </Form>
    )
  },
)
