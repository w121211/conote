import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { Link } from '@reach/router'
import { Button, Card, Divider, Typography, Space, Form, Input, List, Comment as AntdComment, Tag } from 'antd'
import { CoffeeOutlined, SwapLeftOutlined, SwapRightOutlined } from '@ant-design/icons'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
// import { CommentList } from './commentList'
// import { PollChoiceRadioGroup } from './pollChoice'
// import { PollFooter, PostFooter } from './tileFooter'
// import { VotePostForm, NewChoicePostForm } from './postForm'
import { Reply, TileOptions, defaultTileOptions } from './tile'
import commentListSmallCss from './commentListSmall/commentListSmall.module.scss'

export function ReplyList({
  replies,
  pattern = null,
  options = defaultTileOptions,
}: {
  replies: QT.replies_replies[]
  pattern?: string | null
  options?: TileOptions
}) {
  /**
   * args:
   * - pattern（還沒實裝）: 依照reply的vote（會嵌進text）做filter，`pattern=null`的情況，就是一個普通的reply list
   * */
  // const filtered = replies.map((e, i) => {
  //   if (pattern === null)
  //     return <Reply key={i} reply={e} />
  //   // TODO: 非常naive的pattern search
  //   else if (e.text.indexOf(pattern) >= 0)
  //     return <Reply key={i} reply={e} />
  //   return null
  // })
  const filteredReplies = replies
    .filter(e => pattern === null || e.text.indexOf(pattern) >= 0)
    .map((e, i) => <Reply key={i} reply={e} options={options} />)
  // return (
  //   <List className={commentListSmallCss.List} size="large"
  //     // pagination={{
  //     //   onChange: (page) => {
  //     //     console.log(page)
  //     //   },
  //     //   pageSize: 5,
  //     // }}
  //     dataSource={filteredReplies}
  //     renderItem={(e) => (
  //       // <Reply reply={e} options={options} />
  //       <li
  //         className={commentListSmallCss.commentRoot}
  //       // onClick={() => parentCommentClickHandler(item.id)}
  //       >
  //         <AntdComment content={"test"} />
  //       </li>
  //     )}
  //   />
  // )
  if (options.dispReplyAs === 'tile') return <Space>{filteredReplies}</Space>
  if (options.dispReplyAs === 'line') return <ul className={commentListSmallCss.List}>{filteredReplies}</ul>
  // return <ul>{filteredReplies}</ul>
  return <>{filteredReplies} </>
}

export function QueryReplyList({ commentId }: { commentId: string }): JSX.Element {
  const { data, loading, error, refetch } = useQuery<QT.replies, QT.repliesVariables>(queries.REPLIES, {
    variables: { commentId },
  })

  if (loading) return <span>loading...</span>
  if (error || !data) return <p>ERROR: {error?.message}</p>

  return <ReplyList replies={data.replies} />
}

// export function CommentList({ comments }: { comments: QT.commentFragment[] }) {
//   const spotComments = comments.filter(e => e.isTop)
//   const otherComments = comments.filter(e => !e.isTop)
//   return (
//     <>
//       <h3>Spot Comments</h3>
//       {spotComments.map(function (e, i) {
//         return <Comment comment={e} key={i} />
//       })}
//       <h3>Other Comments</h3>
//       {otherComments.map(function (e, i) {
//         return <Comment comment={e} key={i} />
//       })}
//     </>
//   )
// }

export function QueryCommentList({ me, cardId }: { me?: QT.me_me; cardId: string }) {
  // const { data, loading, error, refetch } = useQuery<QT.comments, QT.commentsVariables>(
  //   queries.COMMENTS, { variables: { cardId } }
  // )
  // if (loading) return null
  // if (error) return <p>ERROR: {error.message}</p>
  // if (!data) return null
  // return <CommentList comments={data.comments} />
  return null
}

// interface CommentListProps extends QT.commentsVariables {
//   me?: QT.me_me
//   blockId: string
//   toAddCommentCountByOne: () => void
// }

// const LoadMoreCommentList: React.FC<CommentListProps> = ({ me, cardId, toAddCommentCountByOne }) => {
//   const { data, loading, error, refetch } = useQuery<QT.comments, QT.commentsVariables>(
//     queries.COMMENTS, { variables: { cardId } }
//   )
//   const [hasMore, setHasMore] = useState<boolean>(false)
//   if (loading) return null
//   // if (error) return <p>ERROR: {error.message}</p>
//   if (!data) return null
//   // if (data.comments.length === N_COMMENTS_TAKEN) setHasMore(true)
//   return (
//     <Card type="inner" bordered={false}>
//       <List
//         // bordered
//         size="small"
//         // split={false}
//         dataSource={data.comments}
//         // loadMore={hasMore ? <Button type="link">more</Button> : null}
//         renderItem={e => (
//           <List.Item>
//             {/* <span>{e.content}</span> */}
//             {/* <CommentFooter comment={e} meComment={me?.id === e.userId} /> */}
//           </List.Item>
//         )}
//       />
//       {/* <CommentForm postId={postId} toAddCommentCountByOne={toAddCommentCountByOne} /> */}
//     </Card>
//   )
// }

// export function WebpageList({ webpages }: { webpages: QT.latestPages_latestPages[] }) {
//   return (
//     <>
//       {webpages.map(e => <WebpageTile page={e} />)}
//     </>
//   )
// }

// export function QueryLatestWebpageList() {
//   const [isLoadingMore, setIsLoadingMore] = useState(false)
//   const { data, loading, error, fetchMore } = useQuery<QT.latestPages, QT.latestPagesVariables>(
//     queries.LATEST_PAGES, { variables: { afterId: null } }
//   )
//   async function onClick() {
//     setIsLoadingMore(true)
//     await fetchMore({ variables: { afterId: data?.latestPages[-1].id } })
//     setIsLoadingMore(false)
//   }
//   if (loading)
//     return null
//   if (error)
//     return <p>ERROR: {error.message}</p>
//   if (!data)
//     return null
//   return (
//     <>
//       <WebpageList webpages={data.latestPages} />
//       {
//         isLoadingMore ?
//           <button onClick={onClick}>Load more</button> : "loading"
//       }
//     </>
//   )
// }

// interface SymbolListProps {
//   // symbols: QT.pollFragment_symbols[] | null
//   symbols: null
// }

// const SymbolList: React.FC<SymbolListProps> = ({ symbols }) => {
//   if (symbols === null) return null
//   return (
//     <Space>
//       {
//         symbols.map((e, i) =>
//           <Link key={i} to={`/symbol/${encodeURIComponent(e.name)}`}>
//             {/* <i><Typography.Text type="secondary">{d.name}</Typography.Text></i> */}
//             <i>{e.name}</i>
//           </Link>
//         )
//       }
//     </Space>
//   )
// }

// interface PostCardProps {
//   // createPostLike: (variables: QT.createPostLikeVariables) => void
//   // updatePostLike: (variables: QT.updatePostLikeVariables) => void
//   // comments: React.StatelessComponent
//   post: QT.pollFragment_posts
//   me?: QT.me_me
//   toLogin?: () => void
//   folded?: boolean
//   noHeader?: boolean
//   noSpin?: boolean
//   noThread?: boolean
//   choice: string
// }

// const PostCard: React.FC<PostCardProps> = ({ post, me, toLogin, choice, folded = true, noHeader = false, noSpin = false, noThread = false }) => {
//   const [commentCount, setCommentCount] = useState<number>(post.count.nComments)
//   const [showComments, setShowComments] = useState<boolean>(false)

//   function toAddCommentCountByOne() { setCommentCount(commentCount + 1) }

//   const mePosted = me?.id === post.userId
//   const edit = me?.id === post.userId
//     ? <Link to={`/post/${post.id}?update`}>edit</Link>
//     : null

//   return (
//     <>
//       <Typography.Paragraph>
//         {`[${choice}] ${post.text}`}
//         <PostFooter {...{ post, commentCount, showComments, setShowComments, mePosted }} />
//       </Typography.Paragraph>
//       {/* {
//         showComments &&
//         <CommentList me={me} postId={post.id} toAddCommentCountByOne={toAddCommentCountByOne} />
//       } */}
//     </>
//   )
// }

// interface PollProps {
//   // createPostLike: (variables: QT.createPostLikeVariables) => void
//   // updatePostLike: (variables: QT.updatePostLikeVariables) => void
//   // comments: React.StatelessComponent
//   poll: QT.pollFragment
//   me?: QT.me_me
//   toLogin?: () => void
//   folded?: boolean
//   noHeader?: boolean
//   noSpin?: boolean
//   noThread?: boolean
//   myVotes?: QT.myVotes_myVotes[]
// }

// enum TailPanel {
//   POSTS,
//   SUBMIT,
// }

// function ChoicePanel({ choices }: { choices: QT.choice[] }) {
//   return (
//     <Space>
//       {
//         choices.map(e =>
//           <Button key={e.id} size="small" shape="round" onClick={() => {
//             // setShowComments(!showComments)
//           }}>
//             {e.text}
//             {/* &nbsp; */}
//             {/* <small><LikeOutlined />30</small> */}
//           </Button>
//         )
//       }
//     </Space>
//   )
// }

// export const PollCard: React.FC<PollProps> = ({ poll, me, toLogin, myVotes = [], folded = true, noHeader = false, noSpin = false, noThread = false }) => {
//   const [commentCount, setCommentCount] = useState<number>(poll.count.nComments)
//   const [showComments, setShowComments] = useState<boolean>(false)
//   const [showDetail, setShowDetail] = useState<boolean>(!folded)
//   const [viewed, setViewed] = useState<boolean>(false)
//   const [tailPanel, setTailPanel] = useState<TailPanel>(TailPanel.POSTS)
//   const [clickedChoiceId, setClickedChoiceId] = useState<string | null>(null)

//   function toAddCommentCountByOne() {
//     setCommentCount(commentCount + 1)
//   }

//   const mePolled = me?.id === poll.userId
//   const meVote = myVotes.find(e => e.pollId === poll.id)
//   // const edit = me?.id === poll.userId
//   //   ? <Link to={`/post/${poll.id}?update`}>edit</Link>
//   //   : null

//   const start = dayjs(poll.start)
//   const end = dayjs(poll.end)
//   const title = poll.cat === QT.PollCat.FIXED ? poll.title : `${poll.title}[開放式回答]`

//   const comments = poll.posts.map(e => ({
//     ...e,
//     thisPollVote: e.votes.find(e => e.pollId === poll.id)
//   }))

//   const postsDict = Object.fromEntries<QT.pollFragment_posts[]>(
//     poll.choices.map(e => {
//       const posts = poll.posts.filter(f => {
//         const v = f.votes.find(g => g.pollId === poll.id)
//         if (v?.choiceId === e.id) return true
//         else return false
//       })
//       return [e.id, posts]
//     })
//   )
//   const choiceDict = Object.fromEntries(
//     poll.choices.map(e => [e.id, e])
//   )

//   return (
//     <Card>

//       <Typography.Paragraph>

//         <PollFooter {...{ poll, commentCount, showComments, setShowComments, mePolled }} />

//         {/* <Typography.Text type="secondary">邀請您參與評審：</Typography.Text> */}
//         {
//           <span onClick={() => { setViewed(true); setShowDetail(!showDetail) }}>
//             {
//               viewed ?
//                 <Typography.Text>{title}&nbsp;</Typography.Text>
//                 :
//                 <Typography.Text strong>{title}&nbsp;</Typography.Text>
//             }
//           </span>
//         }

//         <SymbolList symbols={poll.symbols} />

//         {
//           meVote &&
//           <>
//             <br />
//             <Typography.Text type="secondary">你已經投票</Typography.Text>
//           </>
//         }

//         {/* <PollChoiceRadioGroup {...{ pollId: poll.id, me, poll, count: poll.count, setShowDetail }} /> */}

//       </Typography.Paragraph>

//       {/* {
//         showComments &&
//         <Typography.Paragraph>
//           {poll.text}
//         </Typography.Paragraph>
//       } */}

//       <Typography.Paragraph>
//         <Space>
//           {
//             poll.choices.map(e =>
//               <Button key={e.id} data-id={e.id} size="small" shape="round"
//                 type={e.id === clickedChoiceId ? "primary" : "default"}
//                 onClick={(e) => {
//                   setShowComments(true)
//                   setShowDetail(true)
//                   setClickedChoiceId(e.currentTarget.getAttribute('data-id'))
//                 }}
//               >
//                 {e.text}&nbsp;<small>?%</small>
//                 {/* &nbsp; <small><LikeOutlined />30</small> */}
//               </Button>
//             )
//           }
//           <Button type="link" size="small">新增選項</Button>
//           {/* <Button type="link" size="small">所有</Button> */}
//         </Space>
//       </Typography.Paragraph>

//       {/* {
//         showDetail &&
//         <Typography.Paragraph>
//           <Typography.Text type="secondary">
//             預測日：{end.format('l')}
//             <br />投票期間：{start.format('l')} - {end.format('l')}
//             <br />判定方式：投票人評審小組
//           </Typography.Text>
//         </Typography.Paragraph>
//       } */}

//       {
//         // showComments && clickedChoiceId && postsByChoice[clickedChoiceId].length > 0 &&
//         showComments && clickedChoiceId &&
//         <>
//           <List
//             bordered
//             size="small"
//             dataSource={postsDict[clickedChoiceId]}
//             locale={{ emptyText: `[${choiceDict[clickedChoiceId].text}] 無人回覆` }}
//             renderItem={e => {
//               return (
//                 <List.Item>
//                   <PostCard post={e} me={me} choice={choiceDict[clickedChoiceId].text} />
//                 </List.Item>
//               )
//             }}
//           />
//           <br />
//         </>

//         // <>
//         //   <Divider />
//         //   {
//         //     poll.posts && poll.posts.length > 0 ?
//         //       poll.posts.map((e, i) => <PostCard key={i} post={e} me={me} />)
//         //       :
//         //       "暫無回應"
//         //   }
//         // </>
//         // <CommentList me={me} postId={poll.id} toAddCommentCountByOne={toAddCommentCountByOne} />
//       }

//       {
//         showComments && clickedChoiceId && !meVote &&
//         <>
//           <Card size="small">
//             <VotePostForm pollId={poll.id} choice={choiceDict[clickedChoiceId]} />
//             {/* <NewChoicePostForm /> */}
//           </Card>
//         </>
//       }

//     </Card>
//   )
// }

// export const Post: React.FC<PostCardProps> = ({ post, me, toLogin, folded = false, noHeader = false }) => {
//   switch (post.cat) {
//     case QT.PostCat.LINK:
//       // return <PostCard title={<a target="_new" href="link">title<a />} />
//       return null
//     case QT.PostCat.REPLY:
//       return <PostCard post={post} me={me} toLogin={toLogin} folded={folded} noHeader={noHeader} noThread noSpin choice="choice" />
//   }
// }
