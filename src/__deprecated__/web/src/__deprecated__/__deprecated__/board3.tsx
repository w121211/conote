// import React, { useState } from 'react';
// import { RouteComponentProps } from '@reach/router';
// import { useQuery, useMutation } from '@apollo/client';
// import { Badge, Button, Card, Divider, Layout, Row, Col, Space, List, Typography, Radio } from 'antd'
// import { CoffeeOutlined, VerticalAlignTopOutlined } from '@ant-design/icons'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// // import { PostTile } from '../components/postTile'

// // function Login({ me }: { me: QueryResult<QT.me> }) {
// export function Login() {
//   // console.log(typeof refetch)
//   const me = useQuery<QT.me>(queries.ME)
//   const [login, { data, loading }] = useMutation<QT.login, QT.loginVariables>(
//     queries.LOGIN,
//     {
//       onCompleted() {
//         me.refetch()
//       }
//     }
//   )
//   if (loading) return null
//   if (!data) {
//     login({
//       variables: {
//         email: "ccc@ccc.com",
//         password: "ccc"
//       }
//     })
//     console.log('logging')
//     // me.refetch()
//   } else {
//     console.log(data)
//     // me.refetch()
//   }

//   if (me.data) {
//     console.log(me.data)
//   } else {
//     console.log('no me data')
//   }

//   return <></>
// }

// function TrendingList() {
//   const [showList, setShowList] = useState<boolean>(false)
//   if (!showList) return <Button
//     type={'primary'}
//     onClick={() => { setShowList(true) }}
//   >trending</Button>

//   return (
//     <Card>
//       <h3>trending</h3>
//       <List
//         size="small"
//         bordered
//         dataSource={[
//           "#1. data",
//           "#2. data",
//           "#3. data"
//         ]}
//         renderItem={item => (
//           <List.Item>
//             {item}
//           </List.Item>
//         )}
//       />
//     </Card>
//   )
// }

// interface Props extends RouteComponentProps { }

// // export const Feed: React.FC<Props> = () => {
// //   // useQuery<QT.myPostLikes>(queries.MY_POST_LIKES)
// //   useQuery<QT.myCommentLikes>(queries.MY_COMMENT_LIKES)
// //   const me = useQuery<QT.me>(queries.ME)
// //   const { data, loading, error, fetchMore } = useQuery<QT.latestPosts, QT.latestPostsVariables>(
// //     queries.BLOCK,
// //     //   queries.LATEST_POSTS, {
// //     //   fetchPolicy: "cache-and-network",
// //     //   onCompleted() {
// //     //     console.log('latestPosts completed')
// //     //   }
// //     // }
// //   )
// //   const [showLogin, setShowLogin] = useState<boolean>(false)

// //   if (loading) return <p>Loading...</p>
// //   if (error) return <p>ERROR: {error.message}</p>
// //   if (!data) return <p>No feeds</p>

// //   // const login = me.data ? null : <Login />
// //   // console.log(typeof me.refetch)

// //   const afterId = '1234'
// //   const more = null
// //     ? <button onClick={() => fetchMore({
// //       variables: { afterId },
// //       updateQuery: (prev, { fetchMoreResult }) => {
// //         if (!fetchMoreResult) return prev
// //         return {
// //           ...prev,
// //           latestPosts: [...prev.latestPosts, ...fetchMoreResult.latestPosts]
// //         }
// //       }
// //     })}>Load more</button>
// //     : <button onClick={() => setShowLogin(true)}>Load more</button>

// //   return (
// //     <Layout>
// //       <Login />
// //       <Layout.Content>
// //         <Row>
// //           <Col span={23} offset={1}>
// //             {showLogin ? <button>Login</button> : null}
// //             <br />
// //             <Space direction="vertical">
// //               <Space direction="horizontal" size="large">
// //                 <span><Badge color="blue" dot>#IPO</Badge></span>
// //                 <span><Badge color="blue" dot>#熱門</Badge></span>
// //                 <span>#預測</span>
// //                 <span>#問題</span>
// //                 <span>@roboCNBC</span>
// //                 <a>...more</a>
// //               </Space>

// //               {/* <div style={{ textAlign: "center" }}>
// //                 <TrendingList />
// //               </div> */}
// //               <Divider>2010-5-1</Divider>

// //             </Space>
// //           </Col>
// //         </Row>
// //       </Layout.Content>
// //     </Layout>
// //   )

// //   return (
// //     <Layout>
// //       <Login />
// //       <Layout.Content className="site-layout" style={{ maxWidth: 800 }}>
// //         <Row>
// //           <Col span={17} offset={1}>
// //             {showLogin ? <button>Login</button> : null}
// //             <Space direction="vertical">
// //               <p>
// //                 <h1><i>*COVID-19</i></h1>
// //                 [熱度chart]
// //                 [關聯ticker、tag]
// //                 <br />
// //               </p>
// //               <Button>最新</Button>


// //               <Card>
// //                 <b>此事件的受益族群 #機會 #做多</b>
// //                 <br />
// //                 <small>#投票</small>
// //               </Card>
// //               <Card>
// //                 <b>預期此事件將持續多久？ #投票</b>
// //                 <br />
// //                 <small>#推薦</small>
// //               </Card>
// //               <Card>
// //                 <b>若2次爆發時，該如何善用此機會賺錢？</b>
// //                 <br />
// //                 <small>#提問 12個討論</small>
// //                 <Card bordered={false}>
// //                   <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
// //                     <Typography.Text type="secondary">@anonymous, 5-15</Typography.Text>
// //                     <br />
// //                     Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
// //                     Design, a design language for background applications, is refined by Ant UED Team. Ant Design,
// //                     a design language for background applications, is refined by Ant UED Team. Ant Design, a
// //                     design language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team.
// //                     </Typography.Paragraph>
// //                   <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
// //                     <Typography.Text type="secondary">@anonymous May-15</Typography.Text>
// //                     <br />
// //                     Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
// //                     Design, a design language for background applications, is refined by Ant UED Team. Ant Design,
// //                     a design language for background applications, is refined by Ant UED Team. Ant Design, a
// //                     design language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team.
// //                     </Typography.Paragraph>
// //                   <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
// //                     <Typography.Text type="secondary">@anonymous May-15</Typography.Text>
// //                     <br />
// //                     Ant Design, a design language for background applications, is refined by Ant UED Team. Ant
// //                     Design, a design language for background applications, is refined by Ant UED Team. Ant Design,
// //                     a design language for background applications, is refined by Ant UED Team. Ant Design, a
// //                     design language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team. Ant Design, a design
// //                     language for background applications, is refined by Ant UED Team.
// //                     <br />
// //                     <Typography.Text type="secondary">like unlike</Typography.Text>
// //                   </Typography.Paragraph>
// //                   <p>
// //                     這是第一個回應
// //                     <br />
// //                     <Typography.Text type="secondary">
// //                       <small>like unlike @anonymous</small>
// //                     </Typography.Text>
// //                   </p>
// //                   <p>
// //                     這是第一個回應
// //                     <br />
// //                     <Typography.Text type="secondary">
// //                       <small>like unlike @anonymous</small>
// //                     </Typography.Text>
// //                   </p>
// //                 </Card>

// //               </Card>

// //               <p>
// //                 <h1><i>#原油</i></h1>
// //               </p>
// //               <Card>
// //                 <b>推薦幾間好的原油概念股</b>
// //                 <br />
// //                 <small>#分析 #概念股</small>
// //               </Card>
// //               <Card>
// //                 <b>油價大跌，有哪些股票可以趁機買入？</b>
// //                 <br />
// //                 <small>#推薦</small>
// //               </Card>
// //               <Card>
// //                 <b>如何投資原油？</b>
// //                 <br />
// //                 <small>#問題</small>
// //               </Card>

// //               <p>
// //                 <h1><i>#咖啡</i></h1>
// //                 咖啡相關、咖啡類股、咖啡產業
// //                 {/* #咖啡概念股 */}
// //                 {/* <i>$^LIBOR.US $SBUX $LK</i> <a>more...</a> */}
// //               </p>
// //               <Card>
// //                 <b>全球咖啡豆第一季銷量因疫情關係驟降13%</b>
// //               </Card>
// //               <Card>
// //                 <b>星巴克預定4月12日公布第一季財報</b>
// //               </Card>
// //               <Card>
// //                 <b>瑞幸已下跌30%</b>
// //                 <br /><small>$LK CNBC</small>
// //               </Card>

// //               <p>
// //                 <h1><i>$LUKY</i></h1>
// //                 Lucking Coffee ($LUKY), Nasdaq
// //               </p>
// //               {/* <small>#中概股 #咖啡 #零售服務</small> */}
// //               <Card>
// //                 [Price Chart]
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <b>預測Luckin Coffee($LK))的未來走勢</b>
// //                   </Badge>
// //                   <br />
// //                   <small>#預測</small>
// //                 </p>
// //                 <p>
// //                   <Radio.Group>
// //                     <Radio value={1}>會</Radio>
// //                     <Radio value={2}>不會</Radio>
// //                   </Radio.Group>
// //                   <Button type="primary">submit</Button>
// //                 </p>
// //                 <p>
// //                   <Radio.Group>
// //                     <Radio value={1}>會 [15%]</Radio>
// //                     <Radio value={2} checked><b>不會 [85%]</b></Radio>
// //                   </Radio.Group>
// //                 </p>
// //                 <p>
// //                   <ul>
// //                     <li>半年期預測</li>
// //                     <li>投票期間：2020/1/1 - 2020/2/1（1個月）</li>
// //                     <li>結果判定：2020/8/1</li>
// //                     <li>判定方式：隨選一組投票人決定</li>
// //                     <li>當前預測價值：1392p</li>
// //                   </ul>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>Luckin Coffee會下市嗎？[投票已結束]</b>
// //                   <br />
// //                   <small>#預測 #投票</small>
// //                 </p>
// //                 <p>
// //                   <Button type="link">觀看結果 (需10 karma)</Button>
// //                   [投票變化Chart]
// //                 </p>
// //                 <p>
// //                   <ul>
// //                     <li>半年期預測</li>
// //                     <li>投票期間：2020/1/1 - 2020/2/1（1個月）</li>
// //                     <li>結果判定：2020/8/1</li>
// //                     <li>判定方式：隨選一組投票人決定</li>
// //                     <li>當前預測價值：1392p</li>
// //                   </ul>
// //                 </p>
// //                 <VerticalAlignTopOutlined />
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>Luckin Coffee遭司法調查</b>
// //                 </p>
// //               </Card>

// //               <p>
// //                 <h1><i>$DOW</i></h1>
// //                 <br />DowJones
// //                 <br />預測
// //               </p>

// //               <Space direction="horizontal" size="large">
// //                 <span><Badge color="blue" dot>#IPO</Badge></span>
// //                 <span><Badge color="blue" dot>#熱門</Badge></span>
// //                 <span>#預測</span>
// //                 <span>#問題</span>
// //                 <span>#autofeed-CNBC</span>
// //                 <a>...more</a>
// //               </Space>

// //               <Card>
// //                 <p>
// //                   <a><b>3月21日是這次股市崩盤的最低點了嗎？[結果公布]</b></a>
// //                   <br />
// //                   <small>#預測</small>
// //                 </p>
// //                 <p>
// //                   本投票已結束，經過社群評審的判定結果是：
// //                   <ul>
// //                     <li>已經是最低點 (V)</li>
// //                     <li>還會有更低點</li>
// //                   </ul>
// //                   您獲得_______信用值
// //                   <br />
// //                   [投票-時間變動chart]
// //                 </p>
// //                 <p>[text body]</p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <a><b>3月21日是這次股市崩盤的最低點了嗎？[邀請判定結果]</b></a>
// //                   <br />
// //                   <small>#預測</small>
// //                 </p>
// //                 <p>
// //                   [Poll Chart]
// //                   <br />
// //                   本投票已結束，您被邀請參與判定結果，您認為結果是：
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>已經是最低點</Radio>
// //                     <Radio value={2}>還會有更低點</Radio>
// //                     <Radio value={3}>無法判定</Radio>
// //                   </Radio.Group>
// //                   <Button>送出</Button>
// //                   <br />
// //                 </p>
// //                 <p>
// //                   感謝您的協助，目前的判定情形：
// //                   <ul>
// //                     <li>已經是最低點：7票(81%)</li>
// //                     <li>還會有更低點：1票(19%)</li>
// //                     <li>無法判定：0票(0%)</li>
// //                   </ul>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <a><b>你熟悉哪些領域？</b></a>
// //                   </Badge>
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>生技</Radio>
// //                     <Radio value={2}>資訊</Radio>
// //                     <Radio value={3}>傳產</Radio>
// //                     <Radio value={4}>物流</Radio>
// //                   </Radio.Group>
// //                   <Button>submit</Button>
// //                   <br />
// //                   <small>#專家 #robo</small>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <a><b>3月21日是這次股市崩盤的最低點了嗎？[開放再次投票]</b></a>
// //                   <br />
// //                   <small>#預測</small>
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>已經是最低點</Radio>
// //                     <Radio value={2}>還會有更低點</Radio>
// //                   </Radio.Group>
// //                   <Button>送出</Button>
// //                   <br />
// //                   [Poll Chart]
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <a><b>5秒鐘測驗（點開後馬上開始）</b></a>
// //                   </Badge>
// //                   <br />
// //                   <small>#美股</small>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <b>瑞興咖啡遭美國司法部門調查</b>
// //                   <br />
// //                   ..............................
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Typography.Text type="secondary">
// //                     $2504還會漲嗎？
// //                     <br />
// //                     <small>#問題 $2504+4.3%</small>
// //                   </Typography.Text>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>狂印錢的未來</b>
// //                   <br />
// //                   <small>#分析 #看法 *QE-2020 *COVID-19</small>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <b>還有3小時21分鐘美股開盤，預測今天的大盤</b>
// //                   </Badge>
// //                   <br />
// //                 </p>
// //                 <small>#預測 ^DJI+0.23% ^SNP+0.23%</small>
// //               </Card>
// //               <div style={{ textAlign: "center" }}>
// //                 <TrendingList />
// //               </div>

// //               <Divider>2010-5-1</Divider>
// //             </Space>

// //             <br />{more}
// //           </Col>
// //         </Row>

// //       </Layout.Content>
// //     </Layout >
// //   )
// // }