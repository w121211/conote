// import React, { useState, useEffect } from 'react'
// import { RouteComponentProps } from '@reach/router'
// import { useQuery } from '@apollo/client'
// import { Badge, Button, Card, Descriptions, Radio, Space, List, Form, Input, Typography } from 'antd'
// import { FormInstance } from 'antd/lib/form'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// import { Pane } from '../../components/layout'
// import { SymbolAutoComplete } from '../../components/symbolHint'


// function PollForm() {

// }

// function QueryByTitleForm() { }

// // function QueryByTagForm({ form }: { form: FormInstance }) {
// function QueryBySymbolForm() {
//   // const { data, loading, error } = useQuery<QT.post, QT.postVariables>(
//   //   queries.POST, {
//   // })

//   const [form] = Form.useForm()

//   function onFinish(values: any) {
//     console.log('submit', values)
//   }

//   function onFinishFailed(errorInfo: any) {
//     console.log('Failed:', errorInfo);
//   }

//   return (
//     <Form
//       form={form}
//       name="basic"
//       size="small"
//       initialValues={{ symbols: [] }}
//       onFinish={onFinish}
//       onFinishFailed={onFinishFailed}
//     >
//       <Form.Item name="symbols" label="標籤">
//         <SymbolAutoComplete form={form} />
//       </Form.Item>

//       <Form.Item>
//         <Button type="primary" htmlType="submit">送出</Button>
//       </Form.Item>

//     </Form >
//   )
// }

// function CreatePoll() {
//   const [step, setStep] = useState<number>(0)
//   const steps = [
//     {
//       title: "第一步:輸入與問題相關的tag、ticker，搜尋是否已有類似的問題",
//     },
//     {},
//     {},
//   ]

//   return (
//     <>
//       <Space direction="vertical" style={{ width: "100%" }}>
//         <Typography>
//           <Typography.Title level={2}>
//             <Space size="large">
//               <i>Create Table</i>
//               {/* <i>{getSymbol.data.symbol.name}</i> */}
//             </Space>
//           </Typography.Title>
//         </Typography>

//         <Typography.Title level={4}>
//           第一步:輸入與問題相關的tag、ticker，搜尋是否已有類似的問題
//         </Typography.Title>

//         <Card>
//           <QueryBySymbolForm />
//         </Card>

//         <Card>
//           <Typography.Paragraph>
//             $AAA, #美股
//           <Input />
//           類似的問題：<br />
//           1. 預測$AAA的價格 [自動生成]<br />
//           2. [某個已經創建的問題] <br />
//           3. [某個已經創建的問題] <br />
//           </Typography.Paragraph>
//         </Card>

//         <Card>
//           <Typography.Paragraph>
//             第二步：輸入問題名稱<br />
//           tag：$AAA, #美股
//           <Input />
//           類似的問題：<br />
//           1. 預測$AAA的價格 [自動生成]<br />
//           2. [某個已經創建的問題] <br />
//           3. [某個已經創建的問題] <br />
//           </Typography.Paragraph>
//         </Card>

//         <Card>
//           <Typography.Paragraph>
//             第三步：輸入選項、內文及預測內容<br />
//             [預覽]<br />

//             <Form>
//               <Form.Item label="問題">
//                 <Input />ＯＯＯＯＯＯＯＯＯＯＯＯＯＯＯ
//               </Form.Item>

//               <Form.Item label="tags">
//                 <Input />$AAA, #美股
//               </Form.Item>

//               <Form.Item label="選項">
//                 [checkbox]此問題為開放式回答（限制）<br />
//                 <Input />
//                 * 選項1 [移除]<br />
//                 * 選項2 [移除]<br />
//               </Form.Item>

//               <Form.Item label="預測期間">
//                 <Input />
//                 預測日：2030-2-1<br />
//                 開放預測期間：今日至2030-1-1<br />
//                 審查期間：今日至2020-10-1，需滿足100人以上投票、未有單一選項投票數超過9成、up數大於down數等條件<br />
//                 判定期間：2030-2-1 - 2030-2-2<br />
//                 結果：今日至2030-1-1<br />
//               </Form.Item>

//               <Form.Item label="判定方式">
//                 小組判定<br />
//               </Form.Item>

//               <Form.Item label="內文">
//                 <Input />
//               </Form.Item>

//               <Form.Item>
//                 <Button type="primary">建立（一旦送出即無法修改，請仔細確認）</Button>
//               </Form.Item>

//             </Form>
//           </Typography.Paragraph>
//         </Card>

//       </Space>
//     </>
//   )
// }


// interface Props extends RouteComponentProps { }

// export const CreatePollPage: React.FC<Props> = () => {
//   return <Pane left={<CreatePoll />} />
// }