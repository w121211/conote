// import dayjs from 'dayjs'
import React, { useState } from 'react'
import {
  AnchorCountFragment,
  CommentFragment,
  CommentCountFragment,
  MyAnchorLikesDocument,
  MyAnchorLikesQuery,
  MyCommentLikesDocument,
  MyCommentLikesQuery,
  MyReplyLikesDocument,
  MyReplyLikesQuery,
  ReplyFragment,
  ReplyCountFragment,
  useCreateAnchorLikeMutation,
  useCreateCommentLikeMutation,
  useCreateReplyLikeMutation,
  useMyAnchorLikesQuery,
  useMyCommentLikesQuery,
  useMyReplyLikesQuery,
  useUpdateAnchorLikeMutation,
  useUpdateCommentLikeMutation,
  useUpdateReplyLikeMutation,
} from '../apollo/query.graphql'
import { AnchorLike, AnchorDislike, ReplyLike, ReplyDislike, CommentLike, CommentDislike } from './tile-upndown'

export function AnchorPanel({ anchorId, meAuthor }: { anchorId: string; meAuthor: boolean }): JSX.Element {
  const [count, setCount] = useState<AnchorCountFragment | null>(null)
  const [createLike] = useCreateAnchorLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyAnchorLikesQuery>({ query: MyAnchorLikesDocument })
      if (data?.createAnchorLike && res?.myAnchorLikes) {
        cache.writeQuery<MyAnchorLikesQuery>({
          query: MyAnchorLikesDocument,
          data: { myAnchorLikes: res?.myAnchorLikes.concat([data?.createAnchorLike.like]) },
        })
        setCount(data.createAnchorLike.count)
      }
    },
  })
  const [updateLike] = useUpdateAnchorLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyAnchorLikesQuery>({ query: MyAnchorLikesDocument })
      if (data?.updateAnchorLike && res?.myAnchorLikes) {
        cache.writeQuery<MyAnchorLikesQuery>({
          query: MyAnchorLikesDocument,
          data: {
            myAnchorLikes: res.myAnchorLikes.map(function (e) {
              return e.anchorId === data.updateAnchorLike.like.anchorId ? data.updateAnchorLike.like : e
            }),
          },
        })
        setCount(data.updateAnchorLike.count)
      }
    },
  })
  const myAnchorLikes = useMyAnchorLikesQuery({ fetchPolicy: 'cache-only' })

  const meLike = myAnchorLikes.data?.myAnchorLikes.find(e => e.anchorId.toString() === anchorId)
  return (
    <span>
      <AnchorLike {...{ anchorId, count, meLike, createLike, updateLike }} />
      <AnchorDislike {...{ anchorId, count, meLike, createLike, updateLike }} />
    </span>
  )
  // return (
  //     <span>
  //         {meAuthor ? "@me" : "@anonymous"}
  //         <span>{dayjs(reply.updatedAt).format("H:mm")}</span>
  //         <ReplyLike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
  //         <ReplyDislike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
  //         {/* <span
  //         key="comments"
  //         onClick={() => { setShowComments(!showComments) }}>
  //         <CoffeeOutlined />{commentCount}
  //         </span> */}
  //     </span>
  // )
}

export function ReplyPanel({ reply, meAuthor }: { reply: ReplyFragment; meAuthor: boolean }): JSX.Element {
  const [count, setCount] = useState<ReplyCountFragment>(reply.count)
  const [createReplyLike] = useCreateReplyLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyReplyLikesQuery>({ query: MyReplyLikesDocument })
      if (data?.createReplyLike && res?.myReplyLikes) {
        cache.writeQuery<MyReplyLikesQuery>({
          query: MyReplyLikesDocument,
          data: { myReplyLikes: res?.myReplyLikes.concat([data?.createReplyLike.like]) },
        })
        setCount(data.createReplyLike.count)
      }
    },
  })
  const [updateReplyLike] = useUpdateReplyLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyReplyLikesQuery>({ query: MyReplyLikesDocument })
      if (data?.updateReplyLike && res?.myReplyLikes) {
        cache.writeQuery<MyReplyLikesQuery>({
          query: MyReplyLikesDocument,
          data: {
            myReplyLikes: res.myReplyLikes.map(function (e) {
              return e.replyId === data.updateReplyLike.like.replyId ? data.updateReplyLike.like : e
            }),
          },
        })
        setCount(data.updateReplyLike.count)
      }
    },
  })
  const myReplyLikes = useMyReplyLikesQuery({ fetchPolicy: 'cache-only' })
  const meLike = myReplyLikes.data?.myReplyLikes.find(e => e.replyId.toString() === reply.id)
  return (
    <span>
      <ReplyLike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
      <ReplyDislike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
    </span>
  )
  // return (
  //     <span>
  //         {meAuthor ? "@me" : "@anonymous"}
  //         <span>{dayjs(reply.updatedAt).format("H:mm")}</span>
  //         <ReplyLike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
  //         <ReplyDislike {...{ replyId: reply.id, count, meLike, createReplyLike, updateReplyLike }} />
  //         {/* <span
  //         key="comments"
  //         onClick={() => { setShowComments(!showComments) }}>
  //         <CoffeeOutlined />{commentCount}
  //         </span> */}
  //     </span>
  // )
}

// interface CommentPanelProps {
//   comment: QT.commentFragment
//   // nReplies: number
//   // showReplies: boolean
//   // setShowReplies: (a: boolean) => void
//   meAuthor?: boolean
// }

export function CommentPanel({
  comment,
  meAuthor = false,
}: {
  comment: CommentFragment
  meAuthor: boolean
}): JSX.Element {
  const [count, setCount] = useState<CommentCountFragment>(comment.count)
  const [createCommentLike] = useCreateCommentLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyCommentLikesQuery>({ query: MyCommentLikesDocument })
      if (data?.createCommentLike && res?.myCommentLikes) {
        cache.writeQuery<MyCommentLikesQuery>({
          query: MyCommentLikesDocument,
          data: { myCommentLikes: res?.myCommentLikes.concat([data?.createCommentLike.like]) },
        })
        setCount(data.createCommentLike.count)
      }
    },
  })
  const [updateCommentLike] = useUpdateCommentLikeMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyCommentLikesQuery>({ query: MyCommentLikesDocument })
      if (data?.updateCommentLike && res?.myCommentLikes) {
        cache.writeQuery<MyCommentLikesQuery>({
          query: MyCommentLikesDocument,
          data: {
            myCommentLikes: res.myCommentLikes.map(e =>
              e.commentId === data.updateCommentLike.like.commentId ? data.updateCommentLike.like : e,
            ),
          },
        })
        setCount(data.updateCommentLike.count)
      }
    },
  })
  const myCommentLikes = useMyCommentLikesQuery({ fetchPolicy: 'cache-only' })

  const meLike = myCommentLikes.data?.myCommentLikes.find(e => e.commentId.toString() === comment.id)

  return (
    <span>
      {meAuthor ? '@me' : '@anonymous'}
      {/* <span>{dayjs(comment.createdAt).format("H:mm")}</span> */}
      <CommentLike {...{ commentId: comment.id, count, meLike, createCommentLike, updateCommentLike }} />
      <CommentDislike {...{ commentId: comment.id, count, meLike, createCommentLike, updateCommentLike }} />
      {/* <span
            key="comments"
            onClick={() => { setShowComments(!showComments) }}>
            <CoffeeOutlined />{commentCount}
            </span> */}
    </span>
  )
}

// interface PollFooterProps {
//   poll: QT.pollFragment
//   commentCount: number
//   showComments: boolean
//   setShowComments: (a: boolean) => void
//   mePolled: boolean
// }

// export const PollFooter: React.FC<PollFooterProps> = ({ poll, commentCount, showComments, setShowComments, mePolled }) => {
//   const [count, setCount] = useState<QT.pollFragment_count>(poll.count)
//   const [createPollLike] = useMutation<QT.createPollLike, QT.createPollLikeVariables>(
//     queries.BLOCK,
//     //   queries.CREATE_POLL_LIKE, {
//     //   update(cache, { data }) {
//     //     const res = cache.readQuery<QT.myPollLikes>({ query: queries.MY_POLL_LIKES })
//     //     if (data?.createPollLike && res?.myPollLikes) {
//     //       cache.writeQuery<QT.myPollLikes>({
//     //         query: queries.MY_POLL_LIKES,
//     //         data: { myPollLikes: res?.myPollLikes.concat([data?.createPollLike.like]), },
//     //       })
//     //       setCount(data.createPollLike.count)
//     //     }
//     //   },
//     // }
//   )
//   const [updatePollLike] = useMutation<QT.updatePollLike, QT.updatePollLikeVariables>(
//     queries.BLOCK,
//     //   queries.UPDATE_POST_LIKE, {
//     //   // refetchQueries: [],
//     //   update(cache, { data }) {
//     //     const res = cache.readQuery<QT.myPollLikes>({ query: queries.MY_POST_LIKES })
//     //     if (data?.updatePollLike && res?.myPollLikes) {
//     //       cache.writeQuery<QT.myPollLikes>({
//     //         query: queries.MY_POST_LIKES,
//     //         data: {
//     //           myPollLikes: res.myPollLikes.map((e) =>
//     //             e.pollId === data.updatePollLike.like.pollId ? data.updatePollLike.like : e,
//     //           ),
//     //         },
//     //       })
//     //       setCount(data.updatePollLike.count)
//     //     }
//     //   },
//     // }
//   )
//   const myPollLikes = useQuery<QT.myPollLikes>(
//     queries.BLOCK,
//     // queries.MY_POLL_LIKES, { fetchPolicy: "cache-only" }
//   )
//   const meLike = myPollLikes.data?.myPollLikes.find(e => e.pollId === poll.id)

//   return (
//     <div style={{ textAlign: "right" }}>
//       <small>
//         <Space>
//           <span>
//             {mePolled ? "@me" : "@anonymous"}
//           </span>
//           <span>{dayjs(poll.createdAt).format("H:mm")}</span>
//           <PollLike
//             key="comment-basic-like"
//             pollId={poll.id}
//             meLike={meLike}
//             createPollLike={createPollLike}
//             updatePollLike={updatePollLike}
//             count={count} />
//           <PollDislike
//             key="comment-basic-dislike"
//             pollId={poll.id}
//             meLike={meLike}
//             createPollLike={createPollLike}
//             updatePollLike={updatePollLike}
//             count={count} />
//           <span
//             key="comments"
//             onClick={() => { setShowComments(!showComments) }}>
//             <CoffeeOutlined />{commentCount}
//           </span>
//         </Space>
//       </small>
//     </div>
//   )
// }