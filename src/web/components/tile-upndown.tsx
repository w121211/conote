/**
 * TODO:
 * - 應該可以簡化，目前重複的部分太多
 */
import React, { useEffect, useState } from 'react'
import { LikeOutlined, DislikeOutlined, LikeFilled, DislikeFilled } from '@ant-design/icons'
import {
  AnchorCountFragment,
  AnchorLikeFragment,
  CommentCountFragment,
  CommentLikeFragment,
  CreateAnchorLikeMutationVariables,
  CreateCommentLikeMutationVariables,
  CreateReplyLikeMutationVariables,
  LikeChoice,
  ReplyCountFragment,
  ReplyLikeFragment,
  UpdateAnchorLikeMutationVariables,
  UpdateCommentLikeMutationVariables,
  UpdateReplyLikeMutationVariables,
} from '../apollo/query.graphql'

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
  count: AnchorCountFragment | null
  meLike?: AnchorLikeFragment
  createLike: (a: { variables: CreateAnchorLikeMutationVariables }) => void
  updateLike: (a: { variables: UpdateAnchorLikeMutationVariables }) => void
  showCount?: boolean
  // myAnchorLikeRefetch: any
}

export function AnchorLike({
  anchorId,
  count,
  meLike,
  createLike,
  updateLike,
}: // showCount = false,
// myAnchorLikeRefetch,
AnchorLikeProps): JSX.Element {
  let onClick: () => void
  const [liked, setLiked] = useState(false)
  const [showCount, setShowCount] = useState(false)
  useEffect(() => {
    if (meLike) setLiked(meLike && meLike.choice === LikeChoice.Up)
    // console.log('liked true')
    setShowCount(true)
  })
  if (meLike && meLike.choice !== LikeChoice.Up) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Up } } })
      setLiked(true)
      setShowCount(true)
    }
  } else if (meLike && meLike.choice === LikeChoice.Up) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
      setLiked(false)
    }
    // setLiked(true)
  } else {
    onClick = function () {
      createLike({ variables: { anchorId, data: { choice: LikeChoice.Up } } })
      // myAnchorLikeRefetch()
      setLiked(true)
      setShowCount(true)
      console.log('like true')
    }
  }

  return (
    <span onClick={onClick}>
      {liked ? <LikeFilled /> : <LikeOutlined />}
      {showCount && count && count.nUps}

      {/* {console.log('count', count)} */}
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
  let onClick: () => void
  let disliked = false

  if (meLike && meLike.choice !== LikeChoice.Down) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Down } } })
    }
  } else if (meLike && meLike.choice === LikeChoice.Down) {
    onClick = function () {
      updateLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
    }
    disliked = true
  } else {
    onClick = function () {
      createLike({ variables: { anchorId, data: { choice: LikeChoice.Down } } })
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
  count: ReplyCountFragment
  meLike?: ReplyLikeFragment
  createReplyLike: (a: { variables: CreateReplyLikeMutationVariables }) => void
  updateReplyLike: (a: { variables: UpdateReplyLikeMutationVariables }) => void
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
  let onClick: () => void
  let liked = false

  if (meLike && meLike.choice !== LikeChoice.Up) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Up } } })
    }
  } else if (meLike && meLike.choice === LikeChoice.Up) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
    }
    liked = true
  } else {
    onClick = function () {
      createReplyLike({ variables: { replyId, data: { choice: LikeChoice.Up } } })
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
  let onClick: () => void
  let disliked = false

  if (meLike && meLike.choice !== LikeChoice.Down) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Down } } })
    }
  } else if (meLike && meLike.choice === LikeChoice.Down) {
    onClick = function () {
      updateReplyLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
    }
    disliked = true
  } else {
    onClick = function () {
      createReplyLike({ variables: { replyId, data: { choice: LikeChoice.Down } } })
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
  count: CommentCountFragment
  meLike?: CommentLikeFragment
  createCommentLike: (a: { variables: CreateCommentLikeMutationVariables }) => void
  updateCommentLike: (a: { variables: UpdateCommentLikeMutationVariables }) => void
}

export function CommentLike({
  commentId,
  count,
  meLike,
  createCommentLike,
  updateCommentLike,
}: CommentLikeProps): JSX.Element {
  let onClick: () => void
  let liked = false

  if (meLike && meLike.choice !== LikeChoice.Up) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Up } } })
  } else if (meLike && meLike.choice === LikeChoice.Up) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
    liked = true
  } else {
    onClick = () => createCommentLike({ variables: { commentId, data: { choice: LikeChoice.Up } } })
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
  let onClick: () => void
  let disliked = false

  if (meLike && meLike.choice !== LikeChoice.Down) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Down } } })
  } else if (meLike && meLike.choice === LikeChoice.Down) {
    onClick = () => updateCommentLike({ variables: { id: meLike.id, data: { choice: LikeChoice.Neutral } } })
    disliked = true
  } else {
    onClick = () => createCommentLike({ variables: { commentId, data: { choice: LikeChoice.Down } } })
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
