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
// //                 <span><Badge color="blue" dot>#??????</Badge></span>
// //                 <span>#??????</span>
// //                 <span>#??????</span>
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
// //                 [??????chart]
// //                 [??????ticker???tag]
// //                 <br />
// //               </p>
// //               <Button>??????</Button>


// //               <Card>
// //                 <b>???????????????????????? #?????? #??????</b>
// //                 <br />
// //                 <small>#??????</small>
// //               </Card>
// //               <Card>
// //                 <b>????????????????????????????????? #??????</b>
// //                 <br />
// //                 <small>#??????</small>
// //               </Card>
// //               <Card>
// //                 <b>???2????????????????????????????????????????????????</b>
// //                 <br />
// //                 <small>#?????? 12?????????</small>
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
// //                     ?????????????????????
// //                     <br />
// //                     <Typography.Text type="secondary">
// //                       <small>like unlike @anonymous</small>
// //                     </Typography.Text>
// //                   </p>
// //                   <p>
// //                     ?????????????????????
// //                     <br />
// //                     <Typography.Text type="secondary">
// //                       <small>like unlike @anonymous</small>
// //                     </Typography.Text>
// //                   </p>
// //                 </Card>

// //               </Card>

// //               <p>
// //                 <h1><i>#??????</i></h1>
// //               </p>
// //               <Card>
// //                 <b>?????????????????????????????????</b>
// //                 <br />
// //                 <small>#?????? #?????????</small>
// //               </Card>
// //               <Card>
// //                 <b>???????????????????????????????????????????????????</b>
// //                 <br />
// //                 <small>#??????</small>
// //               </Card>
// //               <Card>
// //                 <b>?????????????????????</b>
// //                 <br />
// //                 <small>#??????</small>
// //               </Card>

// //               <p>
// //                 <h1><i>#??????</i></h1>
// //                 ??????????????????????????????????????????
// //                 {/* #??????????????? */}
// //                 {/* <i>$^LIBOR.US $SBUX $LK</i> <a>more...</a> */}
// //               </p>
// //               <Card>
// //                 <b>???????????????????????????????????????????????????13%</b>
// //               </Card>
// //               <Card>
// //                 <b>???????????????4???12????????????????????????</b>
// //               </Card>
// //               <Card>
// //                 <b>???????????????30%</b>
// //                 <br /><small>$LK CNBC</small>
// //               </Card>

// //               <p>
// //                 <h1><i>$LUKY</i></h1>
// //                 Lucking Coffee ($LUKY), Nasdaq
// //               </p>
// //               {/* <small>#????????? #?????? #????????????</small> */}
// //               <Card>
// //                 [Price Chart]
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <b>??????Luckin Coffee($LK))???????????????</b>
// //                   </Badge>
// //                   <br />
// //                   <small>#??????</small>
// //                 </p>
// //                 <p>
// //                   <Radio.Group>
// //                     <Radio value={1}>???</Radio>
// //                     <Radio value={2}>??????</Radio>
// //                   </Radio.Group>
// //                   <Button type="primary">submit</Button>
// //                 </p>
// //                 <p>
// //                   <Radio.Group>
// //                     <Radio value={1}>??? [15%]</Radio>
// //                     <Radio value={2} checked><b>?????? [85%]</b></Radio>
// //                   </Radio.Group>
// //                 </p>
// //                 <p>
// //                   <ul>
// //                     <li>???????????????</li>
// //                     <li>???????????????2020/1/1 - 2020/2/1???1?????????</li>
// //                     <li>???????????????2020/8/1</li>
// //                     <li>??????????????????????????????????????????</li>
// //                     <li>?????????????????????1392p</li>
// //                   </ul>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>Luckin Coffee???????????????[???????????????]</b>
// //                   <br />
// //                   <small>#?????? #??????</small>
// //                 </p>
// //                 <p>
// //                   <Button type="link">???????????? (???10 karma)</Button>
// //                   [????????????Chart]
// //                 </p>
// //                 <p>
// //                   <ul>
// //                     <li>???????????????</li>
// //                     <li>???????????????2020/1/1 - 2020/2/1???1?????????</li>
// //                     <li>???????????????2020/8/1</li>
// //                     <li>??????????????????????????????????????????</li>
// //                     <li>?????????????????????1392p</li>
// //                   </ul>
// //                 </p>
// //                 <VerticalAlignTopOutlined />
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>Luckin Coffee???????????????</b>
// //                 </p>
// //               </Card>

// //               <p>
// //                 <h1><i>$DOW</i></h1>
// //                 <br />DowJones
// //                 <br />??????
// //               </p>

// //               <Space direction="horizontal" size="large">
// //                 <span><Badge color="blue" dot>#IPO</Badge></span>
// //                 <span><Badge color="blue" dot>#??????</Badge></span>
// //                 <span>#??????</span>
// //                 <span>#??????</span>
// //                 <span>#autofeed-CNBC</span>
// //                 <a>...more</a>
// //               </Space>

// //               <Card>
// //                 <p>
// //                   <a><b>3???21?????????????????????????????????????????????[????????????]</b></a>
// //                   <br />
// //                   <small>#??????</small>
// //                 </p>
// //                 <p>
// //                   ????????????????????????????????????????????????????????????
// //                   <ul>
// //                     <li>?????????????????? (V)</li>
// //                     <li>??????????????????</li>
// //                   </ul>
// //                   ?????????_______?????????
// //                   <br />
// //                   [??????-????????????chart]
// //                 </p>
// //                 <p>[text body]</p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <a><b>3???21?????????????????????????????????????????????[??????????????????]</b></a>
// //                   <br />
// //                   <small>#??????</small>
// //                 </p>
// //                 <p>
// //                   [Poll Chart]
// //                   <br />
// //                   ???????????????????????????????????????????????????????????????????????????
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>??????????????????</Radio>
// //                     <Radio value={2}>??????????????????</Radio>
// //                     <Radio value={3}>????????????</Radio>
// //                   </Radio.Group>
// //                   <Button>??????</Button>
// //                   <br />
// //                 </p>
// //                 <p>
// //                   ?????????????????????????????????????????????
// //                   <ul>
// //                     <li>?????????????????????7???(81%)</li>
// //                     <li>?????????????????????1???(19%)</li>
// //                     <li>???????????????0???(0%)</li>
// //                   </ul>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <a><b>????????????????????????</b></a>
// //                   </Badge>
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>??????</Radio>
// //                     <Radio value={2}>??????</Radio>
// //                     <Radio value={3}>??????</Radio>
// //                     <Radio value={4}>??????</Radio>
// //                   </Radio.Group>
// //                   <Button>submit</Button>
// //                   <br />
// //                   <small>#?????? #robo</small>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <a><b>3???21?????????????????????????????????????????????[??????????????????]</b></a>
// //                   <br />
// //                   <small>#??????</small>
// //                   <br />
// //                   <Radio.Group >
// //                     <Radio value={1}>??????????????????</Radio>
// //                     <Radio value={2}>??????????????????</Radio>
// //                   </Radio.Group>
// //                   <Button>??????</Button>
// //                   <br />
// //                   [Poll Chart]
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <a><b>5???????????????????????????????????????</b></a>
// //                   </Badge>
// //                   <br />
// //                   <small>#??????</small>
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <b>???????????????????????????????????????</b>
// //                   <br />
// //                   ..............................
// //                 </p>
// //               </Card>

// //               <Card>
// //                 <p>
// //                   <Typography.Text type="secondary">
// //                     $2504???????????????
// //                     <br />
// //                     <small>#?????? $2504+4.3%</small>
// //                   </Typography.Text>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <b>??????????????????</b>
// //                   <br />
// //                   <small>#?????? #?????? *QE-2020 *COVID-19</small>
// //                 </p>
// //               </Card>
// //               <Card>
// //                 <p>
// //                   <Badge dot>
// //                     <b>??????3??????21??????????????????????????????????????????</b>
// //                   </Badge>
// //                   <br />
// //                 </p>
// //                 <small>#?????? ^DJI+0.23% ^SNP+0.23%</small>
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