import dayjs from 'dayjs'
import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { AnchorLike, AnchorDislike, ReplyLike, ReplyDislike, CommentLike, CommentDislike } from './tile-upndown'
import classes from './tile-panel.module.scss'
import { ReactComponent as CommentIcon } from '../assets/chat.svg'
import MyModal from '../components/modal/modal'

export function AnchorPanel({
  anchorId,
  meAuthor,
  className,
}: {
  anchorId: string
  meAuthor: boolean
  className?: string
}): JSX.Element {
  const [count, setCount] = useState<QT.anchorCount | null>(null)
  const [createLike] = useMutation<QT.createAnchorLike, QT.createAnchorLikeVariables>(queries.CREATE_ANCHOR_LIKE, {
    update(cache, { data }) {
      const res = cache.readQuery<QT.myAnchorLikes>({ query: queries.MY_ANCHOR_LIKES })
      if (data?.createAnchorLike && res?.myAnchorLikes) {
        cache.writeQuery<QT.myAnchorLikes>({
          query: queries.MY_ANCHOR_LIKES,
          data: { myAnchorLikes: res?.myAnchorLikes.concat([data?.createAnchorLike.like]) },
        })
        setCount(data.createAnchorLike.count)
      }
    },
  })
  const [updateLike] = useMutation<QT.updateAnchorLike, QT.updateAnchorLikeVariables>(queries.UPDATE_ANCHOR_LIKE, {
    update(cache, { data }) {
      const res = cache.readQuery<QT.myAnchorLikes>({ query: queries.MY_ANCHOR_LIKES })
      if (data?.updateAnchorLike && res?.myAnchorLikes) {
        cache.writeQuery<QT.myAnchorLikes>({
          query: queries.MY_ANCHOR_LIKES,
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
  const myAnchorLikes = useQuery<QT.myAnchorLikes>(queries.MY_ANCHOR_LIKES, { fetchPolicy: 'cache-only' })
  const meLike = myAnchorLikes.data?.myAnchorLikes.find(e => e.anchorId.toString() === anchorId)
  let classList: string[] = []
  const classLister = (className: string) => {
    classList.push(className)
    return classList.join(' ')
  }
  const [showModal, setShowModal] = useState(false)
  const onClickHandler = (e: any) => {
    e.stopPropagation()
    setShowModal(prevShowModal => !prevShowModal)
  }
  return (
    <span className={classLister(classes.comment)}>
      <AnchorLike {...{ anchorId, count, meLike, createLike, updateLike }} />
      <AnchorDislike {...{ anchorId, count, meLike, createLike, updateLike }} />
      <CommentIcon className={classes.commentIcon} onClick={onClickHandler} />
      <MyModal modalVisible={showModal} handleOk={onClickHandler} handleCancel={onClickHandler} />
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

export function ReplyPanel({ reply, meAuthor }: { reply: QT.replies_replies; meAuthor: boolean }) {
  const [count, setCount] = useState<QT.reply_count>(reply.count)
  const [createReplyLike] = useMutation<QT.createReplyLike, QT.createReplyLikeVariables>(queries.CREATE_REPLY_LIKE, {
    update(cache, { data }) {
      const res = cache.readQuery<QT.myReplyLikes>({ query: queries.MY_REPLY_LIKES })
      if (data?.createReplyLike && res?.myReplyLikes) {
        cache.writeQuery<QT.myReplyLikes>({
          query: queries.MY_REPLY_LIKES,
          data: { myReplyLikes: res?.myReplyLikes.concat([data?.createReplyLike.like]) },
        })
        setCount(data.createReplyLike.count)
      }
    },
  })
  const [updateReplyLike] = useMutation<QT.updateReplyLike, QT.updateReplyLikeVariables>(queries.UPDATE_REPLY_LIKE, {
    update(cache, { data }) {
      const res = cache.readQuery<QT.myReplyLikes>({ query: queries.MY_REPLY_LIKES })
      if (data?.updateReplyLike && res?.myReplyLikes) {
        cache.writeQuery<QT.myReplyLikes>({
          query: queries.MY_REPLY_LIKES,
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
  const myReplyLikes = useQuery<QT.myReplyLikes>(queries.MY_REPLY_LIKES, { fetchPolicy: 'cache-only' })
  const meLike = myReplyLikes.data?.myReplyLikes.find(e => e.replyId === reply.id)
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

interface CommentPanelProps {
  comment: QT.commentFragment
  // nReplies: number
  // showReplies: boolean
  // setShowReplies: (a: boolean) => void
  meAuthor?: boolean
}

export function CommentPanel({ comment, meAuthor = false }: CommentPanelProps): JSX.Element {
  const [count, setCount] = useState<QT.comment_comment_count>(comment.count)
  const [createCommentLike] = useMutation<QT.createCommentLike, QT.createCommentLikeVariables>(
    queries.CREATE_COMMENT_LIKE,
    {
      update(cache, { data }) {
        const res = cache.readQuery<QT.myCommentLikes>({ query: queries.MY_COMMENT_LIKES })
        if (data?.createCommentLike && res?.myCommentLikes) {
          cache.writeQuery<QT.myCommentLikes>({
            query: queries.MY_COMMENT_LIKES,
            data: { myCommentLikes: res?.myCommentLikes.concat([data?.createCommentLike.like]) },
          })
          setCount(data.createCommentLike.count)
        }
      },
    },
  )
  const [updateCommentLike] = useMutation<QT.updateCommentLike, QT.updateCommentLikeVariables>(
    queries.UPDATE_COMMENT_LIKE,
    {
      update(cache, { data }) {
        const res = cache.readQuery<QT.myCommentLikes>({ query: queries.MY_COMMENT_LIKES })
        if (data?.updateCommentLike && res?.myCommentLikes) {
          cache.writeQuery<QT.myCommentLikes>({
            query: queries.MY_COMMENT_LIKES,
            data: {
              myCommentLikes: res.myCommentLikes.map(e =>
                e.commentId === data.updateCommentLike.like.commentId ? data.updateCommentLike.like : e,
              ),
            },
          })
          setCount(data.updateCommentLike.count)
        }
      },
    },
  )
  const myCommentLikes = useQuery<QT.myCommentLikes>(queries.MY_COMMENT_LIKES, { fetchPolicy: 'cache-only' })
  const meLike = myCommentLikes.data?.myCommentLikes.find(e => e.commentId === comment.id)

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
