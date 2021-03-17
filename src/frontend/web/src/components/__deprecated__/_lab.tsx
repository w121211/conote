// import React, { useState } from 'react'
// import { RouteComponentProps, Redirect, Link, navigate } from '@reach/router'
// import { useQuery } from '@apollo/client'
// import * as queries from '../../store/queries'
// import * as QT from '../../store/queryTypes'

// // 實驗：由child控制another-child的內容
// //   點poll的選項可作為comment-filter用

// function Poll({ poll }: { poll: { choices: string[] } }) {
//   const choices = poll.choices.map(e => (<button>{e}</button>))
//   return <>{choices}</>
// }

// const BaseComment: React.FC = () => {
//   const data = {
//     id: 11,
//     text: "this is something",
//     replies: [{ id: 11, text: "aaa" }, { id: 12, text: "bbb" }],
//     spotReplies: [{ id: 11, text: "aaa" }, { id: 12, text: "bbb" }],
//     poll: { id: 11, choices: ["aaa", "bbb"], nVotes: [10, 20], },
//   }
//   const folded = true
//   const spotted = true
//   const poll = data.poll ? <Poll poll={data.poll} /> : null

//   if (folded && spotted) return <>{data.text}-{data.spotReplies}</>
//   if (folded) return <>{data.text}</>
//   return (
//     <>
//       {data.text}-{data.spotReplies}
//       {data.replies}
//       {poll}
//       {/* <NewReply /> */}
//     </>
//   )
// }

// function Body({ pattern, setPattern }: { pattern: null | string, setPattern: (a: string | null) => void }) {
//   function setter(s: string) {
//     if (pattern !== null) {
//       setPattern(null)
//     }
//     else {
//       setPattern(s)
//     }
//   }
//   return (
//     <p>
//       <a onClick={e => { setter("a") }}>a</a>
//       <a onClick={e => { setter("b") }}>b</a>
//       <a onClick={e => { setter("c") }}>c</a>
//     </p>
//   )
// }

// function FilteredList({ comments, pattern }: { comments: string[], pattern: string | null }) {
//   const list = comments.map(e => {
//     if (pattern === null)
//       return <span>{e}, </span>
//     else if (e.indexOf(pattern) >= 0)
//       return <span>{e}</span>
//     return null
//   })
//   return <p>{list}</p>
// }


// export function TestCommentList() {
//   // const { data, loading, error, refetch } = useQuery<QT.comments, QT.commentsVariables>(
//   //   queries.COMMENTS, { variables: { postId: "12345" } }
//   // )

//   // if (loading) return null
//   // // if (error) return <p>ERROR: {error.message}</p>
//   // if (!data) return null
//   // function toAddCommentCountByOne() { }

//   const comments = ["aaa", "bbb", "ccc"]
//   const [pattern, setPattern] = useState<string | null>(null)

//   return (
//     <>
//       <Body pattern={pattern} setPattern={setPattern} />
//       <FilteredList comments={comments} pattern={pattern} />
//     </>
//   )
// }