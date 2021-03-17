// import React, { useState } from 'react'
// import { Link } from '@reach/router'
// import { useQuery, useMutation, } from '@apollo/client'
// import { Card, Typography, Form, Button, Input, Space, List } from 'antd'

// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// // import { CommentLike, CommentDislike } from './likes'

// const N_COMMENTS_TAKEN = 20

// // function CommentForm({ postId, toAddCommentCountByOne }: { postId: string, toAddCommentCountByOne: () => void }) {
// //   const [form] = Form.useForm()
// //   const [createComment] = useMutation<QT.createComment, QT.createCommentVariables>(
// //     queries.CREATE_COMMENT, {
// //     update(cache, { data }) {
// //       const res = cache.readQuery<QT.comments, QT.commentsVariables>({
// //         query: queries.COMMENTS,
// //         variables: { postId },
// //       })
// //       if (data?.createComment && res?.comments) {
// //         cache.writeQuery<QT.comments, QT.commentsVariables>({
// //           query: queries.COMMENTS,
// //           variables: { postId },
// //           data: { comments: res?.comments.concat([data?.createComment]) },
// //         })
// //         toAddCommentCountByOne()
// //         form.resetFields()
// //       }
// //     }
// //   })

// //   const onFinish = (values: any) => {
// //     createComment({ variables: { postId, data: values } })
// //   }
// //   const onFinishFailed = (errorInfo: any) => {
// //     console.log('Failed:', errorInfo);
// //   }
// //   return (
// //     <Form
// //       form={form}
// //       name="comment-form"
// //       onFinish={onFinish}
// //       onFinishFailed={onFinishFailed}
// //       size="small"
// //     // layout="inline"
// //     // style={{ marginRight: 20 }}
// //     >
// //       <Form.Item
// //         name="content"
// //         rules={[{
// //           required: true,
// //           message: 'comment cannot be empty'
// //         }]}
// //       >
// //         <Input placeholder="你的意見..." />
// //       </Form.Item>

// //       <Form.Item style={{ textAlign: "right" }}>
// //         <Button type="primary" htmlType="submit">送出</Button>
// //       </Form.Item>

// //     </Form>
// //   )
// // }

// // interface CommentFooterProps {
// //   comment: QT.comment
// //   meComment: boolean
// // }





// // function Body({ pattern, setPattern }: { pattern: null | string, setPattern: (a: string | null) => void }) {
// //   function setter(s: string) {
// //     if (pattern !== null) {
// //       setPattern(null)
// //     }
// //     else {
// //       setPattern(s)
// //     }
// //   }
// //   return (
// //     <p>
// //       <a onClick={e => { setter("a") }}>a</a>
// //       <a onClick={e => { setter("b") }}>b</a>
// //       <a onClick={e => { setter("c") }}>c</a>
// //     </p>
// //   )
// // }

// // function FilteredList({ comments, pattern }: { comments: string[], pattern: string | null }) {
// //   const list = comments.map(e => {
// //     if (pattern === null)
// //       return <span>{e}, </span>
// //     else if (e.indexOf(pattern) >= 0)
// //       return <span>{e}</span>
// //     return null
// //   })
// //   return <p>{list}</p>
// // }


// // export const TestCommentList: React.FC = () => {
// //   // const { data, loading, error, refetch } = useQuery<QT.comments, QT.commentsVariables>(
// //   //   queries.COMMENTS, { variables: { postId: "12345" } }
// //   // )

// //   // if (loading) return null
// //   // // if (error) return <p>ERROR: {error.message}</p>
// //   // if (!data) return null
// //   // function toAddCommentCountByOne() { }

// //   const comments = ["aaa", "bbb", "ccc"]
// //   const [pattern, setPattern] = useState<string | null>(null)

// //   return (
// //     <>
// //       <Body pattern={pattern} setPattern={setPattern} />
// //       <FilteredList comments={comments} pattern={pattern} />
// //     </>
// //   )
// // }

//   // return (
//   //   <Card type="inner">
//   //     {/* <a onClick={(e) => {}}>AAA</a>
//   //     <a>BBB</a> */}
//   //     <List
//   //       size="small"
//   //       dataSource={data.comments}
//   //       renderItem={e => (
//   //         <List.Item>
//   //           <span>{e.content}</span>
//   //           {/* <span>{e}</span> */}
//   //           {/* <CommentFooter comment={e} meComment={me?.id === e.userId} /> */}
//   //         </List.Item>
//   //       )}
//   //     />
//   //     <CommentForm postId={"12345"} toAddCommentCountByOne={toAddCommentCountByOne} />
//   //   </Card>
//   // )