/**
 * TODO:
 * - 應該可以簡化，目前重複的部分太多
 */
import React, { useState } from 'react'
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons'
import * as QT from '../graphql/query-types'

// const action = () => setShowLogin(true)
export function DummyPostLike1({ action }: { action: any }): JSX.Element {
  return (
    <>
      <button onClick={action}>like</button>
      <button onClick={action}>dislike</button>
    </>
  )
}

// --- AnchorLike ---

interface AnchorLikeProps {
  anchorId: string
  count: QT.anchorCount | null
  meLike?: QT.anchorLike
  createLike: (a: { variables: QT.createAnchorLikeVariables }) => void
  updateLike: (a: { variables: QT.updateAnchorLikeVariables }) => void
  showCount?: boolean
}

export function AnchorLike({
  anchorId,
  count,
  meLike,
  createLike,
  updateLike,
  showCount = false,
}: AnchorLikeProps): JSX.Element {
  let onClick
  let liked = false
  if (meLike && meLike.choice !== QT.LikeChoice.UP) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.UP } } })
    }
  } else if (meLike && meLike.choice === QT.LikeChoice.UP) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    }
    liked = true
  } else {
    onClick = function () {
      createLike({ variables: { anchorId, data: { choice: QT.LikeChoice.UP } } })
    }
  }
  return (
    <span onClick={onClick}>
      {liked ? <LikeFilled /> : <LikeOutlined />}
      {showCount && count && count.nUps}
    </span>
  )
}

export function AnchorDislike({
  anchorId,
  count,
  meLike,
  createLike,
  updateLike,
  showCount = false,
}: AnchorLikeProps): JSX.Element {
  let onClick
  let disliked = false
  if (meLike && meLike.choice !== QT.LikeChoice.DOWN) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.DOWN } } })
    }
  } else if (meLike && meLike.choice === QT.LikeChoice.DOWN) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    }
    disliked = true
  } else {
    onClick = function () {
      createLike({ variables: { anchorId, data: { choice: QT.LikeChoice.DOWN } } })
    }
  }
  return (
    <span onClick={onClick}>
      {disliked ? <DislikeFilled /> : <DislikeOutlined />}
      {showCount && count && count.nDowns}
    </span>
  )
}

// --- ReplyLike ---

interface ReplyLikeProps {
  replyId: string
  count: QT.reply_count
  meLike?: QT.replyLike
  createReplyLike: (a: { variables: QT.createReplyLikeVariables }) => void
  updateReplyLike: (a: { variables: QT.updateReplyLikeVariables }) => void
  showCount?: boolean
}

export function ReplyLike({
  replyId,
  count,
  meLike,
  createReplyLike,
  updateReplyLike,
  showCount = false,
}: ReplyLikeProps): JSX.Element {
  let onClick
  let liked = false
  if (meLike && meLike.choice !== QT.LikeChoice.UP) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.UP } } })
    }
  } else if (meLike && meLike.choice === QT.LikeChoice.UP) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    }
    liked = true
  } else {
    onClick = function () {
      createReplyLike({ variables: { replyId, data: { choice: QT.LikeChoice.UP } } })
    }
  }
  return (
    <span onClick={onClick}>
      {liked ? <LikeFilled /> : <LikeOutlined />}
      {showCount && count.nUps}
    </span>
  )
}

export function ReplyDislike({
  replyId,
  count,
  meLike,
  createReplyLike,
  updateReplyLike,
  showCount = false,
}: ReplyLikeProps): JSX.Element {
  let onClick
  let disliked = false
  if (meLike && meLike.choice !== QT.LikeChoice.DOWN) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.DOWN } } })
    }
  } else if (meLike && meLike.choice === QT.LikeChoice.DOWN) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    }
    disliked = true
  } else {
    onClick = function () {
      createReplyLike({ variables: { replyId, data: { choice: QT.LikeChoice.DOWN } } })
    }
  }
  return (
    <span onClick={onClick}>
      {disliked ? <DislikeFilled /> : <DislikeOutlined />}
      {showCount && count.nDowns}
    </span>
  )
}

// --- CommentLike ---

interface CommentLikeProps {
  commentId: string
  count: QT.comment_comment_count
  meLike?: QT.commentLike
  createCommentLike: (a: { variables: QT.createCommentLikeVariables }) => void
  updateCommentLike: (a: { variables: QT.updateCommentLikeVariables }) => void
}

export function CommentLike({
  commentId,
  count,
  meLike,
  createCommentLike,
  updateCommentLike,
}: CommentLikeProps): JSX.Element {
  let onClick
  let liked = false
  if (meLike && meLike.choice !== QT.LikeChoice.UP) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.UP } } })
  } else if (meLike && meLike.choice === QT.LikeChoice.UP) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    liked = true
  } else {
    onClick = () => createCommentLike({ variables: { commentId, data: { choice: QT.LikeChoice.UP } } })
  }
  return (
    <span onClick={onClick}>
      {liked ? <LikeFilled /> : <LikeOutlined />}
      {count.nUps}
    </span>
  )
}

export function CommentDislike({
  commentId,
  count,
  meLike,
  createCommentLike,
  updateCommentLike,
}: CommentLikeProps): JSX.Element {
  let onClick
  let disliked = false
  if (meLike && meLike.choice !== QT.LikeChoice.DOWN) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.DOWN } } })
  } else if (meLike && meLike.choice === QT.LikeChoice.DOWN) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
    disliked = true
  } else {
    onClick = () => createCommentLike({ variables: { commentId, data: { choice: QT.LikeChoice.DOWN } } })
  }

  return (
    <span onClick={onClick}>
      {disliked ? <DislikeFilled /> : <DislikeOutlined />}
      {count.nDowns}
    </span>
  )
}

// interface PollLikeProps {
//   pollId: string
//   count: QT.pollCount
//   meLike?: QT.pollLike
//   createPollLike: (a: { variables: QT.createPollLikeVariables }) => void
//   updatePollLike: (a: { variables: QT.updatePollLikeVariables }) => void
// }

// export const PollLike: React.FC<PollLikeProps> = ({ pollId, count, meLike, createPollLike, updatePollLike }) => {
//   let onClick
//   let liked = false
//   if (meLike && meLike.choice !== QT.LikeChoice.UP) {
//     onClick = () =>
//       updatePollLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.UP } } })
//   } else if (meLike && meLike.choice === QT.LikeChoice.UP) {
//     onClick = () =>
//       updatePollLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
//     liked = true
//   } else {
//     onClick = () =>
//       createPollLike({ variables: { pollId, data: { choice: QT.LikeChoice.UP } } })
//   }
//   return (
//     <span onClick={onClick}>
//       {liked ? <LikeFilled /> : <LikeOutlined />}
//       {count.nUps}
//     </span>
//   )

// }

// export const PollDislike: React.FC<PollLikeProps> = ({ pollId, count, meLike, createPollLike, updatePollLike }) => {
//   let onClick
//   let disliked = false
//   if (meLike && meLike.choice !== QT.LikeChoice.DOWN) {
//     onClick = () =>
//       updatePollLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.DOWN } } })
//   } else if (meLike && meLike.choice === QT.LikeChoice.DOWN) {
//     onClick = () =>
//       updatePollLike({ variables: { id: meLike.id, data: { choice: QT.LikeChoice.NEUTRAL } } })
//     disliked = true
//   } else {
//     onClick = () =>
//       createPollLike({ variables: { pollId, data: { choice: QT.LikeChoice.DOWN } } })
//   }
//   return (
//     <span onClick={onClick}>
//       {disliked ? <DislikeFilled /> : <DislikeOutlined />}
//       {count.nDowns}
//     </span>
//   )
// }
