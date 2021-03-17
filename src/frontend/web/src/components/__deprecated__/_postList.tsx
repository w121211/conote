// import dayjs from 'dayjs'
// import React, { useState, Dispatch, SetStateAction } from 'react'
// import { useQuery, useMutation } from '@apollo/client'
// import { Link } from '@reach/router'
// import { Spin, Button, Space, Typography, } from 'antd'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// // import { Post } from './tile'

// interface PostListProps {
//   me?: QT.me_me
//   toLogin?: () => void
//   symbolId?: string
//   noHeader?: boolean
// }

// // interface RepliedPostListProps extends PostListProps {
// //   parent: QT.post_post
// // }

// // export const RepliedPostList: React.FC<RepliedPostListProps> = ({ me, toLogin, parent, noHeader = false }) => {
// //   const { data, loading, error, fetchMore } = useQuery<QT.repliedPosts, QT.repliedPostsVariables>(
// //     queries.BLOCK,
// //     //   queries.REPLIED_POSTS, {
// //     //   variables: { parentId: parent.id },
// //     // }
// //   )

// //   if (loading) return null
// //   if (error) return <p>Something goes wrong...</p>
// //   if (!data) return <p>Something goes wrong...</p>

// //   // const after = data.latestPosts[data.latestPosts.length - 1].id

// //   // function onMore() {
// //   //   fetchMore({
// //   //     // variables: { after },
// //   //     updateQuery: (prev, { fetchMoreResult }) => {
// //   //       if (!fetchMoreResult) return prev
// //   //       return {
// //   //         ...prev,
// //   //         latestPosts: [...prev.latestPosts, ...fetchMoreResult.latestPosts]
// //   //       }
// //   //     }
// //   //   })
// //   // }

// //   if (data.repliedPosts.length === 0)
// //     return (
// //       <Typography.Paragraph>
// //         目前還沒有回覆，成為第一個
// //         <Link to={`/submit?reply=${parent.id}`} state={{ parent }}>回覆</Link>
// //       </Typography.Paragraph>
// //     )
// //   return (
// //     <Space direction="vertical" style={{ width: "100%" }}>
// //       {
// //         data?.repliedPosts && data?.repliedPosts.map(e =>
// //           <Post key={e.id} post={e} me={me} toLogin={toLogin} noHeader={noHeader} choice="choice" />
// //         )
// //       }
// //       {/* <div />
// //       <div style={{ textAlign: "center" }}>
// //         {
// //           loading ?
// //             <Spin /> :
// //           <Button onClick={onMore}>載入更多</Button>
// //         }
// //       </div> */}
// //     </Space>
// //   )

// // }

// // export const PostList: React.FC<PostListProps> = ({ me, toLogin, symbolId, noHeader = false }) => {
// //   const { data, loading, error, fetchMore } = useQuery<QT.latestPosts, QT.latestPostsVariables>(
// //     queries.BLOCK,
// //     //   queries.LATEST_POSTS, {
// //     //   variables: { symbolId },
// //     // }
// //   )
// //   const [hasMore, setHasMore] = useState<boolean>(true)

// //   if (loading) return null
// //   if (error) return <p>Something goes wrong...</p>
// //   if (!data) return <p>Something goes wrong...</p>

// //   const afterId = data.latestPosts[data.latestPosts.length - 1].id

// //   function onMore() {
// //     fetchMore({
// //       variables: { afterId },
// //       updateQuery: (prev, { fetchMoreResult }) => {
// //         if (!fetchMoreResult) return prev
// //         if (fetchMoreResult.latestPosts.length === 0) {
// //           setHasMore(false)
// //           return prev
// //         }
// //         return {
// //           ...prev,
// //           latestPosts: [...prev.latestPosts, ...fetchMoreResult.latestPosts]
// //         }
// //       }
// //     })
// //   }

// //   return (
// //     <Space direction="vertical" style={{ width: "100%" }}>
// //       {
// //         data?.latestPosts && data?.latestPosts.map(x =>
// //           <Post key={x.id} post={x} me={me} toLogin={toLogin} noHeader={noHeader} folded choice="choice" />
// //         )
// //       }

// //       <div />

// //       {
// //         hasMore ?
// //           <div style={{ textAlign: "center" }}>
// //             {
// //               loading ?
// //                 <Spin /> :
// //                 <Button onClick={onMore}>載入更多</Button>
// //             }
// //           </div>
// //           :
// //           <div style={{ textAlign: "center" }}>已經到底</div>
// //       }

// //     </Space>
// //   )

// // }