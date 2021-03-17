// import dayjs from 'dayjs'
// import localizedFormat from 'dayjs/plugin/localizedFormat'
// import React, { useState } from 'react'
// import { RouteComponentProps, navigate, Link, WindowLocation } from '@reach/router'
// import { InvariantError } from 'ts-invariant'
// import { useQuery, useMutation } from '@apollo/client'
// import { Alert, AutoComplete, Form, Input, Button, Layout, Row, Col, Card, Typography, Radio, Popover, Space } from 'antd'
// import { FormInstance } from 'antd/lib/form'
// import { MinusCircleOutlined, PlusOutlined, SwapLeftOutlined } from '@ant-design/icons'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// import { Pane } from '../layout'
// import { SymbolAutoComplete } from '../symbolHint'

// dayjs.extend(localizedFormat)

// const layout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 4 },
//   },
//   wrapperCol: {
//     xs: { span: 24 },
//     sm: { span: 20 },
//   },
// }

// const layoutWithoutLabel = {
//   wrapperCol: {
//     xs: { span: 24, offset: 0 },
//     sm: { span: 20, offset: 4 },
//   },
// }

// // const PLACEHOLDER = {
// //   cat: QT.PollCat.FIXED,
// //   title: "這是一個預測",
// //   text: "這是一個預測這是一個預測這是一個預測這是一個預測這是一個預測這是一個預測這是一個預測這是一個預測這是一個預測",
// //   symbols: ["#poll"],
// //   choices: ["AAA", "BBB", "CCC"],
// //   nDays: 7,
// // }

// interface PollFormProps {
//   // form?: FormInstance
// }

// // export const PollForm: React.FC<PollFormProps> = () => {
// //   const [form] = Form.useForm()
// //   // const [cat, setCat] = useState<QT.PostCat>(form.getFieldValue("cat") || QT.PollCat.FIXED)
// //   const [createPoll] = useMutation<QT.createPoll, QT.createPollVariables>(
// //     queries.BLOCK,
// //     //   queries.CREATE_POLL, {
// //     //   update(cache, { data }) {
// //     //     // console.log(typeof data?.createPost.poll?.start)
// //     //     // console.log(data?.createPost)
// //     //     try {
// //     //       const res = cache.readQuery<QT.latestPolls>({ query: queries.LATEST_POLLS })
// //     //       if (data?.createPoll && res?.latestPolls) {
// //     //         cache.writeQuery<QT.latestPolls>({
// //     //           query: queries.LATEST_POLLS,
// //     //           data: {
// //     //             latestPolls: res.latestPolls.concat([data.createPoll]),
// //     //           },
// //     //         })
// //     //       }
// //     //     } catch (e) {
// //     //       if (e instanceof InvariantError) { }
// //     //       else { console.error(e) }
// //     //     }

// //     //     navigate("/")
// //     //   },
// //     // }
// //   )

// //   // const isSpin = parent !== undefined && !isReply

// //   // if (isReply && parent) {
// //   //   placeholdersByCat[QT.PostCat.REPLY].title = `Reply: ${parent.title}`
// //   // }

// //   function onFinish(values: any) {
// //     console.log('submit', values)

// //     createPoll({
// //       variables: {
// //         data: {
// //           cat: values.cat,
// //           symbolIds: values.symbols,
// //           title: values.title,
// //           text: values.text,
// //           nDays: values.nDays,
// //           choices: values.choices,
// //         }
// //       }
// //     })
// //   }
// //   function onFinishFailed(errorInfo: any) {
// //     console.log('Failed:', errorInfo);
// //   }


// //   return (
// //     <Form
// //       form={form}
// //       name="basic"
// //       size="small"
// //       initialValues={PLACEHOLDER}
// //       onFinish={onFinish}
// //       onFinishFailed={onFinishFailed}
// //     >
// //       <Form.Item
// //         {...layout}
// //         label="類別"
// //         name="cat"
// //         rules={[{ required: true, message: '請選擇類別' }]}
// //       >
// //         <Radio.Group onChange={(e) => {
// //           // setCat(e.target.value)
// //           // form.setFieldsValue(placeholdersByCat[e.target.value as QT.PostCat])
// //         }}>
// //           {/* <Radio value={QT.PollCat.ADD}>開放式（無需回文）</Radio> */}
// //           <Radio value={QT.PollCat.ADD_BY_POST}>開放式（允許社群增加選項）</Radio>
// //           <Radio value={QT.PollCat.FIXED}>封閉式</Radio>
// //         </Radio.Group>
// //       </Form.Item>

// //       <Form.Item
// //         {...layout}
// //         label="標題"
// //         name="title"
// //         rules={[{ required: true, message: '請輸入標題' }]}
// //       >
// //         <Input />
// //       </Form.Item>

// //       <Form.Item
// //         {...layout}
// //         label="預測期間"
// //         name="nDays"
// //         rules={[{ required: true, message: '請選擇預測期間' }]}
// //       >
// //         <Radio.Group>
// //           <Radio value={7}>7日</Radio>
// //           <Radio value={14}>14日</Radio>
// //           <Radio value={30}>30日</Radio>
// //           <Radio value={90}>90日</Radio>
// //         </Radio.Group>
// //       </Form.Item>

// //       <Form.List name="choices">
// //         {(fields, { add, remove }) => {
// //           return (
// //             <div>
// //               {fields.map((field, index) => (
// //                 <Form.Item
// //                   {...(index === 0 ? layout : layoutWithoutLabel)}
// //                   label={index === 0 ? '選項' : ''}
// //                   required={true}
// //                   key={field.key}
// //                 >
// //                   <Form.Item
// //                     {...field}
// //                     validateTrigger={['onChange', 'onBlur']}
// //                     rules={[
// //                       {
// //                         required: true,
// //                         whitespace: true,
// //                         message: "請輸入選項",
// //                       },
// //                     ]}
// //                     noStyle
// //                   >
// //                     <Input placeholder={`選項${index + 1}`} style={{ width: '60%' }} />
// //                   </Form.Item>

// //                   {fields.length > 2 ? (
// //                     <MinusCircleOutlined
// //                       style={{ margin: '0 8px' }}
// //                       onClick={() => { remove(field.name) }}
// //                     />
// //                   ) : null}
// //                 </Form.Item>
// //               ))}

// //               <Form.Item  {...layoutWithoutLabel}>
// //                 <Button
// //                   type="dashed"
// //                   onClick={() => { add() }}
// //                 // style={{ width: '60%' }}
// //                 >
// //                   <PlusOutlined /> 增加選項
// //                     </Button>
// //               </Form.Item>

// //             </div>
// //           )
// //         }}
// //       </Form.List>

// //       <Form.Item
// //         {...layout}
// //         label="內文"
// //         name="text"
// //         rules={[{ required: false, message: '請輸入內文' }]}
// //       >
// //         <Input.TextArea rows={3} autoSize={{ minRows: 5 }} />
// //       </Form.Item>

// //       <Form.Item name="symbols" label="標籤" {...layout}>
// //         <SymbolAutoComplete form={form} />
// //       </Form.Item>

// //       <Form.Item {...layoutWithoutLabel}>
// //         <Button type="primary" htmlType="submit">送出</Button>
// //       </Form.Item>

// //     </Form >
// //   )
// // }

// // interface PreviewProps {
// //   values: any
// // }

// // const Preview: React.FC<PreviewProps> = ({ values }) => {
// //   const [showDetail, setShowDetail] = useState(true)

// //   const start = dayjs().startOf('d')

// //   return (
// //     <>
// //       <Typography.Paragraph>
// //         <Typography.Text strong>
// //           <span onClick={() => { setShowDetail(!showDetail) }}>{values.title}</span>&nbsp;
// //           </Typography.Text>

// //         {
// //           (values.symbols as string[]).length > 0 &&
// //           <Space>
// //             {(values.symbols as string[]).map((x, i) => (
// //               <a key={i} href={`/symbol/${encodeURIComponent(x)}`} target="_blank" rel="noopener noreferrer">
// //                 <i>
// //                   <Typography.Text type="secondary">{x}</Typography.Text>
// //                 </i>
// //               </a>
// //             ))}
// //           </Space>
// //         }


// //         <br />
// //         <Radio.Group onChange={() => { setShowDetail(true) }}>
// //           {
// //             (values.choices as string[]).map(
// //               (item, i) => <Radio key={i} value={item}>{item}</Radio>
// //             )
// //           }
// //         </Radio.Group>
// //         <Button type="link" onClick={() => { setShowDetail(!showDetail) }}>{values.nDays}日期預測</Button>
// //         <Button shape="round">投票</Button>

// //         {
// //           showDetail && (
// //             <>
// //               <Typography.Text type="secondary">
// //                 <br />預測日：{start.add(values.nDays || 0, 'd').format('l')} ({values.nDays}日後)
// //                       <br />投票期間：{start.format('l')} - {start.add(values.nDays - 1 || 0, 'd').format('l')}
// //                 <br />判定方式：投票人評審小組
// //                   </Typography.Text>
// //               <br />
// //             </>
// //           )
// //         }

// //       </Typography.Paragraph>

// //       {
// //         showDetail &&
// //         <Typography.Paragraph>{values.text}</Typography.Paragraph>
// //       }

// //     </>
// //   )
// // }

// // export function PollFormWithPreview() {
// //   const [form] = Form.useForm()
// //   const [showForm, setShowForm] = useState<boolean>(true)

// //   return (
// //     <>
// //       <Typography.Title level={4}>
// //         <i>Create Poll</i>
// //       </Typography.Title>

// //       {
// //         showForm ?
// //           <div>
// //             <Button type="link"><Typography.Text strong>編輯</Typography.Text></Button>
// //             <Button type="link" onClick={() => { setShowForm(false) }}>預覽</Button>
// //           </div>
// //           :
// //           <div>
// //             <Button type="link" onClick={() => { setShowForm(true) }}>編輯</Button>
// //             <Button type="link"><Typography.Text strong>預覽</Typography.Text></Button>
// //           </div>
// //       }

// //       <Card style={{ width: "100%" }}>
// //         {
// //           showForm ?
// //             // <PollForm form={form} />
// //             <PollForm />
// //             :
// //             <Preview values={form.getFieldsValue()} />
// //         }
// //       </Card>
// //     </>
// //   )
// // }
