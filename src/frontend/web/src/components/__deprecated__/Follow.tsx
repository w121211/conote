// import React, { useState } from 'react'
// import { useQuery, useMutation } from '@apollo/client'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'

// interface DummyPostLikeProps {
//   // setShowLogin: React.Dispatch<React.SetStateAction<boolean>>
//   action: any
// }

// // const action = () => setShowLogin(true)

// export const DummyPostLike: React.FC<DummyPostLikeProps> = ({ action }) => {
//   return (
//     <>
//       <button onClick={action}>
//         like
//       </button>
//       <button onClick={action}>
//         dislike
//       </button>
//     </>
//   )
// }

// interface FollowProps {
//   symbolId: string
// }

// export const Follow: React.FC<FollowProps> = ({ symbolId }) => {
//   // const { data } = useQuery<QT.myFollows>(
//   //   queries.MY_FOLLOWS, {
//   //   fetchPolicy: "cache-only"
//   // })
//   // const [createFollow] = useMutation<QT.createFollow, QT.createFollowVariables>(
//   //   queries.CREATE_FOLLOW, {
//   //   update(cache, { data }) {
//   //     const res = cache.readQuery<QT.myFollows>({
//   //       query: queries.MY_FOLLOWS,
//   //     })
//   //     if (data?.createFollow && res?.myFollows) {
//   //       // data?.createPostLike.postId = postId
//   //       // const fake = { ...data?.createPostLike, postId, choice: 1 }
//   //       cache.writeQuery<QT.myFollows>({
//   //         query: queries.MY_FOLLOWS,
//   //         data: {
//   //           myFollows: res?.myFollows.concat([data?.createFollow]),
//   //           // myPostLikes: res?.myPostLikes.concat([fake]),
//   //         },
//   //       })
//   //     }
//   //   },
//   // })
//   // const [updateFollow] = useMutation<QT.updateFollow, QT.updateFollowVariables>(
//   //   queries.UPDATE_FOLLOW, {
//   //   refetchQueries: [],
//   //   update(cache, { data }) {
//   //     const res = cache.readQuery<QT.myFollows>({
//   //       query: queries.MY_FOLLOWS,
//   //     })
//   //     if (data?.updateFollow && res?.myFollows) {
//   //       cache.writeQuery<QT.myFollows>({
//   //         query: queries.MY_FOLLOWS,
//   //         data: {
//   //           myFollows: res.myFollows.map(
//   //             (x) => x.id === data.updateFollow.id
//   //               ? data.updateFollow : x,
//   //           ),
//   //         },
//   //       })
//   //     }
//   //   },
//   // })
//   // const [warnning, setWarnning] = useState<string>("")

//   // const meFollow = data?.myFollows.find((x) => x.symbolId === symbolId)

//   // // const canCreateFollow = data?.myFollows.length < me.nSlots
//   // // const canUnfollow = meFollow?.followed && ((now() - meFollow.updatedAt) > 3600 * 24)

//   // const canCreate = data?.myFollows && data?.myFollows.length < 10
//   // const canUpdate = true
//   // const toCreateFollow = canCreate
//   //   ? () => createFollow({ variables: { symbolId, data: { symbolId, followed: true } } })
//   //   : () => setWarnning("Slot full")
//   // const toUpdateToUnfollow = canUpdate
//   //   ? () => updateFollow({ variables: { symbolId, data: { symbolId, followed: false } } })
//   //   : () => setWarnning("Action freezed, require 1-day to unlock")
//   // const toUpdateToFollow = canUpdate
//   //   ? () => updateFollow({ variables: { symbolId, data: { symbolId, followed: false } } })
//   //   : () => setWarnning("Action freezed, require 1-day to unlock")

//   // if (meFollow?.followed) return <button onClick={toUpdateToUnfollow}>followed</button>
//   // if (meFollow && !meFollow.followed) return <button onClick={toUpdateToFollow}>follow</button>
//   // return <button onClick={toCreateFollow}>follow</button>
//   return null
// }