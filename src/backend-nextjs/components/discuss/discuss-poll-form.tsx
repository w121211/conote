import {
  useCreateReplyMutation,
  useCommentQuery,
  RepliesQuery,
  RepliesQueryVariables,
  RepliesDocument,
} from '../../apollo/query.graphql'
import { Form } from 'antd'
// import MyTextArea from '../myTextArea/myTextArea'

export const CommentForm = ({ commentId }: { commentId: string }) => {
  const [form] = Form.useForm()
  const onSubmit = () => {
    form.submit()
  }

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
          data: { replies: res.replies.concat([data?.createReply]) },
        })
        // addReplyCountByOne()
        form.resetFields()
      }
    },
  })

  const onFinish = (values: any) => {
    if (values.text) {
      createReply({
        variables: {
          commentId: commentId,
          data: { text: values.text },
        },
      })
    }
    console.log(`finish ${commentId}${values.text}`)
  }
  return (
    <Form form={form} onFinish={onFinish}>
      {/* <MyTextArea clickHandler={onSubmit} /> */}
      {/* </Form.Item> */}
    </Form>
  )
}
