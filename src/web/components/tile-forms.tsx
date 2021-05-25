import { Form, Button, Input } from 'antd'
import { RepliesDocument, RepliesQuery, RepliesQueryVariables, useCreateReplyMutation } from '../apollo/query.graphql'

export function ReplyForm({
  commentId,
  addReplyCountByOne,
  suggestText,
  onFinish,
  onFinishFailed,
}: {
  commentId: string
  addReplyCountByOne(): void
  suggestText?: string
  onFinish?(): void
  onFinishFailed?(): void
}): JSX.Element {
  const [form] = Form.useForm()

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
        addReplyCountByOne()
        form.resetFields()
      }
    },
  })
  // const [createReply] = useMutation<QT.createReply, QT.createReplyVariables>(queries.CREATE_REPLY, {
  //   update(cache, { data }) {
  //     const res = cache.readQuery<QT.replies, QT.repliesVariables>({
  //       query: queries.REPLIES,
  //       variables: { commentId },
  //     })
  //     if (data?.createReply && res?.replies) {
  //       cache.writeQuery<QT.replies, QT.repliesVariables>({
  //         query: queries.REPLIES,
  //         variables: { commentId },
  //         data: { replies: res?.replies.concat([data?.createReply]) },
  //       })
  //       addReplyCountByOne()
  //       form.resetFields()
  //     }
  //   },
  // })
  function _onFinish(values: any) {
    createReply({ variables: { commentId, data: values } })
    if (onFinish) onFinish()
  }
  function _onFinishFailed(errorInfo: any) {
    console.log('Failed:', errorInfo)
    if (onFinishFailed) onFinishFailed()
  }
  return (
    <Form form={form} name="reply-form" onFinish={_onFinish} onFinishFailed={_onFinishFailed}>
      <Form.Item
        name="text"
        initialValue={suggestText}
        rules={[
          {
            required: true,
            message: 'comment cannot be empty',
          },
        ]}
      >
        <Input placeholder="Your reply..." />
      </Form.Item>
      <Form.Item>Suggestions: [a], [b], [c]</Form.Item>
      <Form.Item style={{ textAlign: 'right' }}>
        <Button type="primary" htmlType="submit">
          送出
        </Button>
      </Form.Item>
    </Form>
  )
}

// export function CommentForm({
//   cardId,
//   toAddCommentCountByOne,
// }: {
//   cardId: string
//   toAddCommentCountByOne: () => void
// }) {
//   const [form] = Form.useForm()
//   // const [createComment] = useMutation<QT.createComment, QT.createCommentVariables>(
//   //   queries.CREATE_COMMENT, {
//   //   update(cache, { data }) {
//   // cache.modify({
//   //   fields: {
//   //     todos(existingTodos = []) {
//   //       const newTodoRef = cache.writeFragment({
//   //         data: addTodo,
//   //         fragment: gql`
//   //           fragment NewTodo on Todo {
//   //             id
//   //             type
//   //           }
//   //         `
//   //       });
//   //       return [...existingTodos, newTodoRef];
//   //     }
//   //   }
//   // });
//   //     const res = cache.readQuery<QT.comments, QT.commentsVariables>({
//   //       query: queries.COMMENTS,
//   //       variables: { cardId },
//   //     })
//   //     if (data?.createComment && res?.comments) {
//   //       cache.writeQuery<QT.comments, QT.commentsVariables>({
//   //         query: queries.COMMENTS,
//   //         variables: { cardId },
//   //         data: { comments: res?.comments.concat([data?.createComment]) },
//   //       })
//   //       toAddCommentCountByOne()
//   //       form.resetFields()
//   //     }
//   //   }
//   // })
//   const onFinish = (values: any) => {
//     // createComment({
//     //   variables: {
//     //     cardId,
//     //     cardType: 'Cocard',
//     //     data: {
//     //       mark: "fake",
//     //       text: values.text,
//     //       // symbols: [],
//     //     }
//     //   }
//     // })
//   }
//   const onFinishFailed = (errorInfo: any) => {
//     console.log('Failed:', errorInfo)
//   }
//   return (
//     <Form form={form} name="comment-form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
//       <Form.Item
//         name="text"
//         rules={[
//           {
//             required: true,
//             message: 'comment cannot be empty',
//           },
//         ]}
//       >
//         <Input placeholder="Your comment..." />
//       </Form.Item>
//       <Form.Item>
//         <Button type="primary" htmlType="submit">
//           送出
//         </Button>
//       </Form.Item>
//     </Form>
//   )
// }
