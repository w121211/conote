// import React from 'react'
// import { RouteComponentProps } from '@reach/router'
// import { useQuery } from '@apollo/client'
// import { Badge, Button, Card, Descriptions, Radio, Space, List, Form, Input, Typography } from 'antd'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// import { Pane } from '../../components/layout'
// import { LineChart } from '../../components/charts'

// interface EventProps {
//   name: string
// }

// const _eventContent = {
//   status: "ALIVE",  // ALIVE, END
//   cat: "", // NEWS, COMPANY, SIGNAL
//   start: Date.now(),
//   end: null,
//   // title: "Some event name?",
//   tags: ["#tag1", "tag2"],
//   events: ["a-event", "b-event"],
//   shotedAt: Date.now(),
// }

// const Event: React.FC<EventProps> = ({ name }) => {
//   // const header = <h1>{getSymbol.data?.symbol.name}</h1>
//   // const status = <p>{getSymbol.data?.symbol.status}</p>
//   // const chart = null

//   const morePosts = null
//   const commits = null
//   const createCommit = null
//   const parentEvent = null
//   const tickers = ["$$風電"]
//   const tags = []
//   const synonyms = []  // resolve


//   const demo = (
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

//         <Card>
//           <Typography.Paragraph>
//             第一步：輸入與問題相關的tag、ticker，搜尋是否已有類似的問題<br />
//           $AAA, #美股
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

//   const demoRight =
//     <Space direction="vertical" style={{ width: "100%" }}>
//       <div />
//       <Card>
//         <List
//           size="small"
//           // header={<b>關聯</b>}
//           dataSource={["#COVID-19#", "#聯準會", "#歐洲央行", "#日本央行", "#外匯", "$^USD", "$^GOLD"]}
//           renderItem={e => <List.Item>{e}</List.Item>}
//         />
//       </Card>
//       {/* <Card>
//         <List
//           size="small"
//           // header={<b>關聯</b>}
//           dataSource={["預測$XXXX未來走勢", "$XXXX還會持續上漲？", "該買哪個好？$XXXX, $XXXY, $XXXXZ?"]}
//           renderItem={e => <List.Item>{e}</List.Item>}
//         />
//       </Card> */}
//     </Space>

//   return (
//     <Pane left={demo} />
//   )
// }


// interface Props extends RouteComponentProps {
//   name?: string
// }

// export const CreatePollPage: React.FC<Props> = ({ name = "#event#" }) => {
//   // if (name === undefined) return <Event name="404" />
//   return <Event name={name} />
// }