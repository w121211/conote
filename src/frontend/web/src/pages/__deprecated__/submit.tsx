import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import React, { useState } from 'react'
import { RouteComponentProps, navigate, Link, WindowLocation } from '@reach/router'
import { InvariantError } from 'ts-invariant'
import { useQuery, useMutation } from '@apollo/client'
import { Alert, AutoComplete, Form, Input, Button, Layout, Row, Col, Card, Typography, Radio, Popover, Space } from 'antd'
import { FormInstance } from 'antd/lib/form'
import { MinusCircleOutlined, PlusOutlined, SwapLeftOutlined } from '@ant-design/icons'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
import { Pane } from '../../components/layout'
import { SymbolAutoComplete } from '../../components/symbolHint'

dayjs.extend(localizedFormat)

const layout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
}

const layoutWithoutLabel = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 20, offset: 4 },
  },
}

// let placeholdersByCat = {
//   [QT.PostCat.REPLY]: {
//     cat: QT.PostCat.REPLY,
//     title: "Reply: 〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開",
//     text: "主文從第這裏開始...Reply: 〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開Reply: 〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開Reply: 〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開Reply: 〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開",
//     symbols: ["#reply"],
//   },
// }

interface PostFormProps {
  form: FormInstance
  // parent?: QT.post_post
  pollId?: String
}

// const PostForm: React.FC<PostFormProps> = ({ form, pollId }) => {
//   const [createPost] = useMutation<QT.createPost, QT.createPostVariables>(
//     queries.BLOCK,
//     //   queries.CREATE_POST, {
//     //   update(cache, { data }) {
//     //     // console.log(typeof data?.createPost.poll?.start)
//     //     // console.log(data?.createPost)
//     //     try {
//     //       const res = cache.readQuery<QT.latestPosts>({ query: queries.LATEST_POSTS })
//     //       if (data?.createPost && res?.latestPosts) {
//     //         cache.writeQuery<QT.latestPosts>({
//     //           query: queries.LATEST_POSTS,
//     //           data: {
//     //             latestPosts: res.latestPosts.concat([data.createPost]),
//     //           },
//     //         })
//     //       }
//     //     } catch (e) {
//     //       if (e instanceof InvariantError) { }
//     //       else { console.error(e) }
//     //     }

//     //     navigate("/")
//     //   },
//     // }
//   )
//   const [cat, setCat] = useState<QT.PostCat>(form.getFieldValue("cat") || QT.PostCat.REPLY)

//   // const isReply = parent !== undefined && QT.PostCat.REPLY === cat
//   // const isSpin = parent !== undefined && !isReply

//   // if (isReply && parent) {
//   //   placeholdersByCat[QT.PostCat.REPLY].title = `Reply: ${parent.title}`
//   // }

//   function onFinish(values: any) {
//     console.log('submit', values)

//     createPost({
//       variables: {
//         data: {
//           cat: values.cat,
//           symbolIds: values.symbols,
//           text: values.text,
//         },
//         // pollId: pollId,
//       }
//     })
//   }
//   function onFinishFailed(errorInfo: any) {
//     console.log('Failed:', errorInfo);
//   }


//   return (
//     <Form
//       form={form}
//       name="basic"
//       size="small"
//       // initialValues={placeholdersByCat[cat]}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//     >
//       <Form.Item
//         {...layout}
//         label="類別"
//         name="cat"
//         rules={[{ required: true, message: '請選擇類別' }]}
//       >
//         <Radio.Group onChange={(e) => {
//           setCat(e.target.value)
//           // form.setFieldsValue(placeholdersByCat[e.target.value as QT.PostCat])
//         }}>

//         </Radio.Group>
//       </Form.Item>

//       <Form.Item
//         {...layout}
//         label="標題"
//         name="title"
//         rules={[{ required: true, message: '請輸入標題' }]}
//       >
//         <Input />
//       </Form.Item>

//       <Form.Item
//         {...layout}
//         label="內文"
//         name="text"
//       >
//         <Input.TextArea rows={3} autoSize={{ minRows: 8 }} />
//       </Form.Item>

//       <Form.Item name="symbols" label="標籤" {...layout}>
//         <SymbolAutoComplete form={form} cat={cat} />
//       </Form.Item>

//       <Form.Item {...layoutWithoutLabel}>
//         <Button type="primary" htmlType="submit">送出</Button>
//       </Form.Item>

//     </Form >
//   )
// }

interface PreviewProps {
  values: any
  // parent?: QT.post_post
}

// const Preview: React.FC<PreviewProps> = ({ values, parent }) => {
//   const [showDetail, setShowDetail] = useState(true)

//   const start = dayjs().startOf('d')

//   return (
//     <>
//       <Typography.Paragraph>
//         <Typography.Text strong>
//           <span onClick={() => { setShowDetail(!showDetail) }}>{values.title}</span>&nbsp;
//           </Typography.Text>

//         {
//           (values.symbols as string[]).length > 0 &&
//           <Space>
//             {(values.symbols as string[]).map((x, i) => (
//               <a key={i} href={`/symbol/${encodeURIComponent(x)}`} target="_blank" rel="noopener noreferrer">
//                 <i>
//                   <Typography.Text type="secondary">{x}</Typography.Text>
//                 </i>
//               </a>
//             ))}
//           </Space>
//         }

//       </Typography.Paragraph>

//       {
//         showDetail &&
//         <Typography.Paragraph>{values.text}</Typography.Paragraph>
//       }

//     </>
//   )
// }

// interface PostCreateProps {
//   parent?: QT.post_post
//   isReply?: boolean
// }

// const PostCreate: React.FC<PostCreateProps> = ({ parent, isReply = false }) => {
//   const [form] = Form.useForm()
//   const [showForm, setShowForm] = useState<boolean>(true)

//   if (parent && isReply) form.setFields([{ name: "cat", value: QT.PostCat.REPLY }])

//   return (
//     <>
//       {
//         showForm ?
//           <div>
//             <Button type="link"><Typography.Text strong>編輯</Typography.Text></Button>
//             <Button type="link" onClick={() => { setShowForm(false) }}>預覽</Button>
//           </div>
//           :
//           <div>
//             <Button type="link" onClick={() => { setShowForm(true) }}>編輯</Button>
//             <Button type="link"><Typography.Text strong>預覽</Typography.Text></Button>
//           </div>
//       }

//       <Card style={{ width: "100%" }}>
//         {
//           showForm ?
//             <PostForm form={form} />
//             :
//             <Preview values={form.getFieldsValue()} parent={parent} />
//         }
//       </Card>
//     </>
//   )
// }

// interface SubmitPageProps extends RouteComponentProps {
//   location?: WindowLocation<{ parent: QT.post_post }>
//   isLoggedIn?: boolean
// }

// export const SubmitPage: React.FC<SubmitPageProps> = ({ location, isLoggedIn = false }) => {
//   const params = new URLSearchParams(window.location.search)
//   const reply = params.get("reply")
//   const spin = params.get("spin")

//   const { data, loading, error } = useQuery<QT.post, QT.postVariables>(
//     queries.BLOCK,
//     //   queries.POST, {
//     //   variables: { id: reply || spin || "" }
//     // }
//   )

//   if (reply) {
//     if (loading) return null
//     if (error) return <p>something goes wrong</p>
//     if (!data) return <p>something goes wrong</p>
//   } else if (spin) {
//     if (loading) return null
//     if (error) return <p>something goes wrong</p>
//     if (!data) return <p>something goes wrong</p>
//   }

//   return (
//     <Layout>
//       <Layout.Content>
//         <Pane left={<PostCreate parent={data?.post} isReply={Boolean(reply)} />} />
//       </Layout.Content>
//       <Layout.Footer />
//     </Layout>
//   )
// }
