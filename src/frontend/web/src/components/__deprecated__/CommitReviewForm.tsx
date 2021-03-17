// import React, { useState, Fragment } from 'react'
// import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
// import { Link, Router, RouteComponentProps } from '@reach/router'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'


// // interface CommitReviewtFormProps {
// //   review: QT.commitReview
// // }

// // export const CommitReviewtForm: React.FC<CommitReviewtFormProps> = ({ review }) => {
// //   if (review.choice !== 0)
// //     throw Error("review form should not show when `reivew.choice !== 0`")

// //   const [updateCommitReview, { data, loading, error }] = useMutation<QT.updateCommitReview, QT.updateCommitReviewVariables>(
// //     // queries.UPDATE_COMMIT_REVIEW
// //     queries.BLOCK
// //   )
// //   // const { register, handleSubmit, setValue, errors } = useForm({
// //   //   defaultValues: {
// //   //     // title: page?.title,
// //   //     choice: 1,
// //   //     content: "some content goes here",
// //   //   }
// //   // })

// //   if (loading) return <p>Loading...</p>
// //   if (error) return <p>ERROR: {error.message}</p>
// //   // if (data?.createPost.id) return <Link to={`/post/${data.createPost.id}`}>Post Created</Link>

// //   const onSubmit = (data: any) => {
// //     updateCommitReview({
// //       variables: {
// //         id: review.id,
// //         data: {
// //           choice: data.choice
// //         }
// //       }
// //     })
// //   }

// //   return null

// //   // return (
// //   //   <>
// //   //     <form onSubmit={handleSubmit(onSubmit)}>
// //   //       <div>
// //   //         <label htmlFor="choice">choice</label>
// //   //         <input
// //   //           name="choice"
// //   //           placeholder="choice..."
// //   //           ref={register}
// //   //         />
// //   //       </div>

// //   //       <button type="submit">Submit</button>

// //   //     </form>
// //   //   </>
// //   // )
// // }