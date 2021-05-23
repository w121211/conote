// import React from 'react'
// import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
// import { useQuery } from '@apollo/client'
// import { Badge, Button, Card, Radio, Space, List, Typography, Result, Divider } from 'antd'
// import { LinkOutlined, ExportOutlined, SwapLeftOutlined, QuestionCircleOutlined, InfoCircleOutlined, SwapRightOutlined } from '@ant-design/icons'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// import { Pane } from '../../components/layout'
// // import { PostList } from '../components/postList'
// import { Chart, Chart2 } from '../../components/__deprecated/_lightweightChart'

// // %24AADR

// interface SymbolProps {
//   name: string
// }

// // // const Symbol: React.FC<SymbolProps> = ({ name }) => {
// // //   console.log(name)
// // //   // useQuery<QT.myPostLikes>(queries.MY_POST_LIKES)
// // //   useQuery<QT.myCommentLikes>(queries.MY_COMMENT_LIKES)
// // //   useQuery<QT.myVotes>(queries.MY_VOTES)
// // //   const getMe = useQuery<QT.me>(queries.ME)
// // //   const getPosts = useQuery<QT.latestPosts, QT.latestPostsVariables>(
// // //     queries.BLOCK,
// // //     // queries.LATEST_POSTS,
// // //     // { fetchPolicy: "cache-and-network", }
// // //   )
// // //   // const [showLogin, setShowLogin] = useState<boolean>(false)
// // //   const getSymbol = useQuery<QT.getSymbol, QT.getSymbolVariables>(
// // //     queries.BLOCK,
// // //   //   queries.GET_SYMBOL, {
// // //   //   variables: { name },
// // //   //   // fetchPolicy: "cache-and-network"
// // //   // }
// // //   )

// // //   if (getSymbol.loading) return null
// // //   // if (getSymbol.error) return <p>ERROR: {getSymbol.error.message}</p>
// // //   if (getSymbol.error) return <Result
// // //     title="Oops..."
// // //     subTitle={<><i>{name}</i> is not existed</>}
// // //   />
// // //   if (getSymbol.data) console.log(getSymbol.data)
// // //   if (!getSymbol.data) return <p>No data...</p>

// // //   // const after = '1234'
// // //   // const more = null
// // //   //   ? <button onClick={() => fetchMore({
// // //   //     variables: { after },
// // //   //     updateQuery: (prev, { fetchMoreResult }) => {
// // //   //       if (!fetchMoreResult) return prev
// // //   //       return {
// // //   //         ...prev,
// // //   //         latestPosts: [...prev.latestPosts, ...fetchMoreResult.latestPosts]
// // //   //       }
// // //   //     }
// // //   //   })}>Load more</button>
// // //   //   : <button onClick={() => setShowLogin(true)}>Load more</button>

// // //   const status = <p>{getSymbol.data?.symbol.status}</p>
// // //   const chart = null
// // //   const commits = null
// // //   const createCommit = null
// // //   const parentEvent = null
// // //   const tickers = ["$$風電"]
// // //   const tags = []
// // //   const synonyms = []  // resolve
// // //   // const redirect = ""
// // //   // const follow = <button onClick={}></button>

// // //   const footer = (
// // //     <div style={{ textAlign: "right" }}>
// // //       <small>
// // //         <Space>
// // //           <span>16:32</span>
// // //           <span>@robo</span>
// // //           <span>like</span>
// // //           <span>dislike</span>
// // //           <span>comment</span>
// // //         </Space>
// // //       </small>
// // //     </div>
// // //   )

// //   const spin = (
// //     <Typography.Paragraph>
// //       <SwapRightOutlined /> 經營權之爭將怎麼影響友訊？<br />
// //       <SwapRightOutlined /> 經營權之爭將怎麼影響友訊？<br />
// //       <a>...更多</a> 或 建立一個<a>Spin</a>
// //     </Typography.Paragraph>
// //   )

// //   return (
// //     <Space direction="vertical" style={{ width: "100%" }}>
// //       {/* {showLogin ? <button>Login</button> : null} */}
// //       <Typography>
// //         <Typography.Title level={2}>
// //           <Space size="large">
// //             <i>{getSymbol.data.symbol.name}</i>
// //             <Button type="primary">追蹤</Button>
// //           </Space>
// //         </Typography.Title>
// //         <Typography.Paragraph>
// //           咖啡相關、咖啡類股、咖啡產業
// //         </Typography.Paragraph>
// //       </Typography>

// //       {/* <Chart /> */}

// //       <Divider>Pins</Divider>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Space>
// //             <Typography.Text strong>$AADR-30日走勢預測</Typography.Text>
// //             <i><Typography.Text type="secondary">$AADR</Typography.Text></i>
// //             <i><Typography.Text type="secondary">預測</Typography.Text></i>
// //           </Space>
// //           {footer}
// //           {/* <Radio.Group>
// //             <Radio value={1}>大跌（-10%以上）</Radio>
// //             <Radio value={1}>小跌（-10% ~ -3%）</Radio>
// //             <Radio value={1}>平盤（-3% ~ 3%）</Radio>
// //             <Radio value={1}>小漲（+3 ~ +10%)</Radio>
// //             <Radio value={1}>大漲（+10%以上）</Radio>
// //           </Radio.Group>
// //           <Button type="link">7日期預測</Button>
// //           <Button shape="round">投票</Button> */}

// //           {/* <br />
// //           <br />
// //           <Chart /> */}
// //           {/* 這裡需要寫點東西嗎？ */}
// //           {/* <br />
// //           <br />
// //           - 過去1週變動(+3.5%)
// //           <br />
// //           - 過去10週平均變動(+2.4%, ) */}
// //         </Typography.Paragraph>
// //       </Card>


// //       <Divider>Latest</Divider>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Typography.Text strong>
// //             <Link to="/post/123">〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開</Link>
// //           </Typography.Text>
// //           <Space>
// //             <i><Typography.Text type="secondary">#友訊經營權之爭#</Typography.Text></i>
// //             <i><Typography.Text type="secondary">$2332-TW</Typography.Text></i>
// //             <i><Typography.Text type="secondary">#情報</Typography.Text></i>
// //           </Space>
// //         </Typography.Paragraph>
// //         {footer}

// //         <Card type="inner" bordered={false}>
// //           <List
// //             bordered
// //             size="small"
// //             dataSource={[
// //               "this is some comment",
// //               "this is some comment2",
// //               "this is some comment3 this is some comment3 this is some comment3",
// //             ]}
// //             renderItem={item => (
// //               <List.Item>
// //                 <span>{item}</span>
// //                 <Space style={{ textAlign: "right" }}>
// //                   <small>@anonymous</small>
// //                   <small>like</small>
// //                   <small>dislike</small>
// //                 </Space>
// //               </List.Item>
// //             )}
// //           />
// //           <a>...more</a>
// //         </Card>

// //         <Typography.Paragraph>
// //           <SwapRightOutlined /> 經營權之爭將怎麼影響友訊？<br />
// //           <SwapRightOutlined /> 經營權之爭將怎麼影響友訊？<br />
// //           <a>...更多</a> 或 建立一個<a>Spin</a>
// //         </Typography.Paragraph>
// //       </Card>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Typography.Text strong><QuestionCircleOutlined /> 經營權之爭將怎麼影響友訊？ </Typography.Text>
// //           <Space>
// //             <i><Typography.Text type="secondary">#友訊經營權之爭#</Typography.Text></i>
// //             <i><Typography.Text type="secondary">$2332-TW</Typography.Text></i>
// //           </Space>
// //           <br />
// //           <Typography.Text type="secondary">
// //             <SwapLeftOutlined />〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開
// //           </Typography.Text>

// //           <small></small>
// //         </Typography.Paragraph>
// //         {footer}
// //       </Card>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Typography.Text strong>經營權之爭將怎麼影響友訊？ </Typography.Text><br />
// //           <Typography.Text type="secondary"><SwapLeftOutlined />〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開</Typography.Text>
// //           <small></small>
// //         </Typography.Paragraph>
// //         {footer}
// //       </Card>


// //       <Card>
// //         <Typography.Paragraph>

// //           <Typography.Text strong>經營權之爭將怎麼影響友訊？ </Typography.Text><br />
// //           <Typography.Text type="secondary"><SwapLeftOutlined />〈友訊經營權之爭〉股東常會確定不延期 公司派決議維持6/15召開</Typography.Text>
// //           <small></small>

// //           <br />
// //         Reply:
// //         Reply:
// //         Reply:
// //         </Typography.Paragraph>
// //       </Card>


// //       <Card>
// //         <Typography.Paragraph>
// //           <Space>
// //             <i><Typography.Text type="secondary">#情報</Typography.Text></i>
// //             <i><Typography.Text type="secondary">#美公司債</Typography.Text></i>
// //             <i><Typography.Text type="secondary">#QE-2020#</Typography.Text></i>
// //             <i><Typography.Text type="secondary">$2332-TW</Typography.Text></i>
// //           </Space>
// //           <br />
// //           <a href="some/where">
// //             <Typography.Text strong>
// //               〈分析〉美公司債規模攀至1兆美元 降評潮卻正在路上 <LinkOutlined />
// //             </Typography.Text>
// //           </a>




// //         </Typography.Paragraph>
// //         {footer}
// //         {/* <Divider />
// //         <Typography.Paragraph>
// //           <Typography.Title level={4}><i>#美公司債</i></Typography.Title>
// //           <ul>
// //             <li>經營權之爭將怎麼影響友訊？</li>
// //             <li>$2332-TW(友訊)的股價預測</li>
// //             <li><a>查看更多...</a></li>
// //           </ul>
// //         </Typography.Paragraph> */}

// //         <br />
// //         <List
// //           bordered
// //           size="small"
// //           dataSource={[
// //             "this is some comment",
// //             "this is some comment2 - @anonymous",
// //             "this is some comment3 this is some comment3 this is some comment3 - @anonymous",

// //           ]}
// //           renderItem={item => (
// //             <List.Item>
// //               <span>{item}</span>
// //               <span style={{ textAlign: "center" }}>
// //                 <small>@anonymous like dislike</small>
// //               </span>

// //             </List.Item>
// //           )}
// //         />
// //       </Card>


// //       <Card>
// //         <Typography.Paragraph>
// //           <Typography.Text strong>距離美市開盤還有：1小時18分OO秒，預測本日的S&amp;P走勢</Typography.Text>
// //           <Typography.Text type="secondary"> 你已經連續預測21日</Typography.Text>
// //           <br />
// //           <Space>
// //             <i><Typography.Text type="secondary">$SNP</Typography.Text></i>
// //             <i><Typography.Text type="secondary">預測</Typography.Text></i>
// //           </Space>
// //         </Typography.Paragraph>
// //         {footer}
// //       </Card>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Badge dot color="blue">
// //             <Typography.Text strong>美市還有1小時18分鐘開盤，預測本日的S&amp;P走勢</Typography.Text>
// //           </Badge>
// //           <Space>
// //             <span>&nbsp;</span>
// //             <i><Typography.Text type="secondary">$SNP</Typography.Text></i>
// //             <i><Typography.Text type="secondary">預測</Typography.Text></i>
// //           </Space>
// //           {/* <Typography.Text type="secondary"> 你已經連續預測21日</Typography.Text> */}
// //           <Radio.Group>
// //             <Radio value={1}>大跌（-10%以上）</Radio>
// //             <Radio value={1}>小跌（-10% ~ -3%）</Radio>
// //             <Radio value={1}>平盤（-3% ~ 3%）</Radio>
// //             <Radio value={1}>小漲（+3 ~ +10%)</Radio>
// //             <Radio value={1}>大漲（+10%以上）</Radio>
// //           </Radio.Group>
// //           <br />
// //         </Typography.Paragraph>
// //         {footer}
// //       </Card>

// //       <Card>
// //         <Typography.Paragraph>
// //           <Typography.Text strong>美市還有1小時18分鐘開盤，預測本日的S&amp;P走勢 </Typography.Text>
// //           <Space>
// //             <i><Typography.Text type="secondary">$SNP</Typography.Text></i>
// //             <i><Typography.Text type="secondary">預測</Typography.Text></i>
// //           </Space>
// //         </Typography.Paragraph>

// //         <Card bordered={false}>

// //           <Chart />
// //           - 過去1週平均每日變動：+3.5% <br />
// //           - 過去10週平均變動(+2.4%, )<br />
// //           <br />

// //           <Radio.Group>
// //             <Radio value={1}>大跌（-10%以上）</Radio>
// //             <Radio value={1}>小跌（-10% ~ -3%）</Radio>
// //             <Radio value={1}>平盤（-3% ~ 3%）</Radio>
// //             <Radio value={1}>小漲（+3 ~ +10%)</Radio>
// //             <Radio value={1}>大漲（+10%以上）</Radio>
// //             <Button type="link">1日期預測</Button>
// //           </Radio.Group>

// //           {/* <Radio.Group>
// //             <Radio style={{ display: "block" }} value={1}>大跌（-10%以上）</Radio>
// //             <Radio style={{ display: "block" }} value={1}>小跌（-10% ~ -3%）</Radio>
// //             <Radio style={{ display: "block" }} value={1}>平盤（-3% ~ 3%）</Radio>
// //             <Radio style={{ display: "block" }} value={1}>小漲（+3 ~ +10%)</Radio>
// //             <Radio style={{ display: "block" }} value={1}>大漲（+10%以上）</Radio>
// //           </Radio.Group> */}
// //           <br />
// //           <br />
// //           <Button shape="round">投票</Button>
// //           <Button type="link">群眾預測</Button>
// //           <Button type="link">機器預測</Button>
// //         </Card>

// //         {footer}
// //       </Card>


// //       <Card>
// //         <Typography.Paragraph>
// //           <b>預測$AADR一週後走勢</b>
// //           <br />
// //           <Space>
// //             <i><Typography.Text type="secondary">$AADR</Typography.Text></i>
// //             <i><Typography.Text type="secondary">預測</Typography.Text></i>
// //           </Space>

// //           <br />
// //           <Radio.Group>
// //             <Radio value={1}>大跌（-10%以上）</Radio>
// //             <Radio value={1}>小跌（-10% ~ -3%）</Radio>
// //             <Radio value={1}>平盤（-3% ~ 3%）</Radio>
// //             <Radio value={1}>小漲（+3 ~ +10%)</Radio>
// //             <Radio value={1}>大漲（+10%以上）</Radio>
// //           </Radio.Group>
// //           <Button type="link">7日期預測</Button>
// //           <Button shape="round">投票</Button>

// //           <Chart2 />

// //           {/* <br />
// //           <br />
// //           <Chart /> */}
// //           {/* 這裡需要寫點東西嗎？ */}
// //           過去1週變動(+3.5%)
// //           過去10週平均變動(+2.4%, )
// //         </Typography.Paragraph>
// //       </Card>

// //       {/* {
// //         getPosts.data?.latestPosts.map(
// //           x => <PostList
// //             key={x.id}
// //             post={x}
// //             me={getMe.data?.me}
// //             // toLogin={() => setShowLogin(true)}
// //             toLogin={() => { }}
// //           />)
// //       } */}

// //       <Button>讀取更多</Button>

// //     </Space >
// //   )
// // }

// // interface SymbolPageProps extends RouteComponentProps<{ name: string }> { }

// // export const SymbolPage: React.FC<SymbolPageProps> = ({ name }) => {
// //   if (!name)
// //     return <Redirect to="/" />

// //   // return <Symbol name={decodeURIComponent(name)} />
// //   const right = (
// //     <Space direction="vertical" style={{ width: "100%", marginTop: 30 }}>
// //       <Card size="small">
// //         <Typography.Text strong>相關的tags</Typography.Text>
// //         <Typography.Paragraph>
// //           <a>#AAA AAA </a><br />
// //           <a>#AAA</a><br />
// //           <a>#AAA</a><br />
// //         </Typography.Paragraph>
// //       </Card>
// //       <Card size="small">
// //         <Typography.Paragraph>
// //           關聯tags<br />
// //           <a>#AAA AAA </a><br />
// //           <a>#AAA</a><br />
// //           <a>#AAA</a><br />
// //         </Typography.Paragraph>
// //       </Card>
// //     </Space>
// //   )
// //   return <Pane left={<Symbol name={decodeURIComponent(name)} />} right={right} />
// // }