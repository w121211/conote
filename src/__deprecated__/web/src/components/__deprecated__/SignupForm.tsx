// import React, { useState } from 'react';
// import { useMutation, useQuery, useLazyQuery } from '@apollo/client'

// import { navigate } from "@reach/router"
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'

// interface Props {
//   postId: string
//   // createComment: (variables: QT.CreateCommentVariables) => void
//   // disabled: boolean
// }

// export function SignupForm(props: any) {
//   // const { data, loading, error } = useQuery<QT.me>(queries.ME)
//   const [signup, { data, loading, error }] = useMutation<QT.signup, QT.signupVariables>(
//     // const [signup] = useMutation<QT.signup, QT.signupVariables>(
//     queries.SINGUP, {
//     onError(err) {
//       console.log(err)
//     },
//     onCompleted(data) {
//       navigate("/login", { replace: false })
//     },
//     errorPolicy: "all",
//   })
//   // const { register, handleSubmit } = useForm({
//   //   defaultValues: {
//   //     email: "aaa@aaa.com",
//   //     password: "aaa",
//   //   }
//   // })
//   // const onSubmit = (data: any) => {
//   //   signup({
//   //     variables: {
//   //       email: data.email,
//   //       password: data.password
//   //     }
//   //   })
//   // }

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>ERROR: {error.message}</p>
//   // if (data?.createPost.id) return <Link to={`/post/${data.createPost.id}`}>Post Created</Link>
//   return null
//   // return (
//   //   <form onSubmit={handleSubmit(onSubmit)}>
//   //     <h1>signup</h1>

//   //     <div>
//   //       <label htmlFor="email">email</label>
//   //       <input
//   //         name="email"
//   //         // placeholder="body..."
//   //         ref={register}
//   //       />
//   //     </div>

//   //     <div>
//   //       <label htmlFor="password">password</label>
//   //       <input
//   //         name="password"
//   //         // placeholder="body..."
//   //         ref={register}
//   //       />
//   //     </div>

//   //     <button type="submit">
//   //       Submit
//   //     </button>

//   //   </form>
//   // )
// }



// // export const CommentForm: React.FC<Props> = ({ postId }) => {
// export function LoginForm(props: any) {
//   const [me] = useLazyQuery<QT.me>(queries.ME)
//   const [login, { data, loading, error }] = useMutation<QT.login, QT.loginVariables>(
//     queries.LOGIN, {
//     onError(err) {
//       console.log(err)
//     },
//     onCompleted(data) {
//       me()
//       // navigate(-1)
//     },
//   })
//   // const { register, handleSubmit } = useForm({
//   //   defaultValues: {
//   //     email: "aaa@aaa.com",
//   //     password: "aaa",
//   //   }
//   // })
//   // const onSubmit = (data: any) => {
//   //   login({
//   //     variables: {
//   //       email: data.email,
//   //       password: data.password
//   //     }
//   //   })
//   // }

//   if (loading) return <p>Loading...</p>
//   if (error) return <p>ERROR: {error.message}</p>
//   // if (data?.createPost.id) return <Link to={`/post/${data.createPost.id}`}>Post Created</Link>

//   return null

//   // return (
//   //   <form onSubmit={handleSubmit(onSubmit)}>
//   //     <h1>login</h1>

//   //     <div>
//   //       <label htmlFor="email">email</label>
//   //       <input
//   //         name="email"
//   //         // placeholder="body..."
//   //         ref={register}
//   //       />
//   //     </div>

//   //     <div>
//   //       <label htmlFor="password">password</label>
//   //       <input
//   //         name="password"
//   //         // placeholder="body..."
//   //         ref={register}
//   //       />
//   //     </div>

//   //     <button type="submit">
//   //       Submit
//   //     </button>

//   //   </form>
//   // )
// }