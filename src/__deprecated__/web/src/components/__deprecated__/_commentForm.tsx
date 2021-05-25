// import React, { useState } from 'react'
// import { useMutation, } from '@apollo/client'

// import * as queries from '../../../store/queries'
// import * as QT from '../../../store/queryTypes'


// interface Props {
//   postId: string
//   // createComment: (variables: QT.CreateCommentVariables) => void
//   // disabled: boolean
// }

// export const CommentForm: React.FC<Props> = ({ postId }) => {
//   const [createComment] = useMutation<QT.createComment, QT.createCommentVariables>(
//     queries.CREATE_COMMENT, {
//     // update(cache, { data }) {
//     //   const res = cache.readQuery<QT.comments>({
//     //     query: queries.COMMENTS,
//     //   })
//     //   if (data?.createComment && res?.myCommentLikes) {
//     //     cache.writeQuery<QT.myCommentLikes>({
//     //       query: queries.MY_COMMENT_LIKES,
//     //       data: {
//     //         myCommentLikes: res?.myCommentLikes.concat([data?.createCommentLike]),
//     //       },
//     //     })
//     //   }
//     // },
//   })
//   // const [updateCommentLike] = useMutation<QT.updateCommentLike, QT.updateCommentLikeVariables>(
//   //   queries.UPDATE_COMMENT_LIKE, {
//   //   update(cache, { data }) {
//   //     const res = cache.readQuery<QT.myCommentLikes>({
//   //       query: queries.MY_COMMENT_LIKES,
//   //     })
//   //     if (data?.updateCommentLike && res?.myCommentLikes) {
//   //       cache.writeQuery<QT.myCommentLikes>({
//   //         query: queries.MY_POST_LIKES,
//   //         data: {
//   //           myCommentLikes: res.myCommentLikes.map((x) =>
//   //             x.commentId === data.updateCommentLike.commentId ? data.updateCommentLike : x
//   //           ),
//   //         },
//   //       })
//   //     }
//   //   },
//   // })
//   return null

//   // const { register, handleSubmit, setValue, errors } = useForm({
//   //   defaultValues: {
//   //     content: "this is a content"
//   //   }
//   // })
//   // const onSubmit = handleSubmit(({ content }) => {
//   //   console.log('submit...')
//   //   createComment({
//   //     variables: {
//   //       postId,
//   //       data: { content }
//   //     }
//   //   })
//   // })
//   // return (
//   //   <form onSubmit={onSubmit}>

//   //     <div>
//   //       <label htmlFor="content">content</label>
//   //       <input
//   //         name="content"
//   //         placeholder="body..."
//   //         ref={register}
//   //       />
//   //     </div>

//   //     <button type="submit">
//   //       Submit
//   //     </button>

//   //   </form>
//   // )
// }

