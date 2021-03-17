// import dayjs from 'dayjs'
// import React, { useState, Dispatch, SetStateAction } from 'react'
// import { useQuery, useMutation } from '@apollo/client'
// import { Link } from '@reach/router'
// import { Spin, Button, Space, Typography, } from 'antd'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'
// // import { PollCard } from './tile'

// interface PollListProps {
//   me?: QT.me_me
//   toLogin?: () => void
//   symbolId?: string
//   noHeader?: boolean
// }

// export const PollList: React.FC<PollListProps> = ({ me, toLogin, symbolId, noHeader = false }) => {
//   // const { data, loading, error, fetchMore } = useQuery<QT.latestPolls, QT.latestPollsVariables>(
//   //   queries.LATEST_POLLS, {
//   //   variables: { symbolId },
//   // })
//   // const myVotes = useQuery<QT.myVotes>(
//   //   queries.MY_VOTES, {
//   // })
//   // const [hasMore, setHasMore] = useState<boolean>(true)

//   // if (loading) return null
//   // if (error) return <p>Something goes wrong...</p>
//   // if (!data) return <p>Something goes wrong...</p>

//   // const afterId = data.latestPolls[data.latestPolls.length - 1].id

//   // function onMore() {
//   //   fetchMore({
//   //     variables: { afterId },
//   //     updateQuery: (prev, { fetchMoreResult }) => {
//   //       if (!fetchMoreResult) return prev
//   //       if (fetchMoreResult.latestPolls.length === 0) {
//   //         setHasMore(false)
//   //         return prev
//   //       }
//   //       return {
//   //         ...prev,
//   //         latestPosts: [...prev.latestPolls, ...fetchMoreResult.latestPolls]
//   //       }
//   //     }
//   //   })
//   // }

//   // return (
//   //   <Space direction="vertical" style={{ width: "100%" }}>
//   //     <div />

//   //     {
//   //       data?.latestPolls && data?.latestPolls.map(e =>
//   //         <PollCard key={e.id} poll={e} me={me} toLogin={toLogin} noHeader={noHeader} folded myVotes={myVotes.data?.myVotes} />
//   //       )
//   //     }

//   //     <div />

//   //     {
//   //       hasMore ?
//   //         <div style={{ textAlign: "center" }}>
//   //           {
//   //             loading ?
//   //               <Spin /> :
//   //               <Button onClick={onMore}>載入更多</Button>
//   //           }
//   //         </div>
//   //         :
//   //         <div style={{ textAlign: "center" }}>已經到底</div>
//   //     }

//   //   </Space>
//   // )
//   return null

// }