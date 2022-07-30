// import dayjs from 'dayjs'
// import localizedFormat from 'dayjs/plugin/localizedFormat'
import React, { useState, useEffect } from 'react'
import { Button, Form, Radio, Spin, Input, Typography } from 'antd'
import { RadioChangeEvent } from 'antd/lib/radio/interface'
import {
  MyVotesQuery,
  MyVotesDocument,
  PollFragment,
  // RepliesDocument,
  // RepliesQuery,
  // RepliesQueryVariables,
  // useCreateReplyMutation,
  useCreateVoteMutation,
  useMyVotesQuery,
} from '../apollo/query.graphql'

// dayjs.extend(localizedFormat)

/**
 * 投票狀態分為：
 *   - 投票進行中，user沒投票 -> PollVoteForm
 *   - 投票進行中，user已投票 -> PollCount
 *   - 投票已結束，user有投票&邀請判定 -> PollJudgeForm
 *   - (投票已結束，user有投票&已判定 -> PollJudgeCount?)
 *   - 投票已結束，判定中，user有投票 -> PollCount
 *   - 投票已結束，判定中，user未投票 -> user需付費看PollCount
 *   - 投票已判定，user有投票 -> PollVerdict
 *   - 投票已判定，user未投票 -> user需付費看PollVerdict
 */

// interface FormProps {
//   poll: QT.pollFragment
//   // pollId: string
//   choices: React.ReactNode
// }

export function PollChoices({
  pollId,
  choices,
  // count,
  setShowReplies,
  setFilterRepliesPattern,
}: // setChoiceIdx,
{
  pollId: string
  choices: string[]
  // count: any
  setShowReplies?(a: boolean): void
  setFilterRepliesPattern?(a: string | null): void
  // setChoiceIdx?(a: number | null): void
  onClick?(): void
}): JSX.Element {
  // const myVotes = useQuery<QT.myVotes>(queries.MY_VOTES, { fetchPolicy: 'cache-only' })
  const myVotes = useMyVotesQuery({ fetchPolicy: 'cache-only' })
  const meVote = myVotes.data?.myVotes.find(e => e.pollId === parseInt(pollId))
  const [selectedIdx, setSelectedIdx] = useState<number | null>()

  function onChange(e: RadioChangeEvent) {
    // console.log('radio checked', e.target.value)
    if (!meVote) {
      // setChoiceIdx(e.target.value)
      setSelectedIdx(e.target.value)
    }
    //     setFilterRepliesPattern(`(${i})`)
    //     setShowReplies(true)
    //     setShowForm(true)
  }
  function _choice(i: number, text: string, count?: number) {
    // if (!me) return <Radio key={id} value={id} onClick={toLogin}>{text}</Radio>
    // me有投票
    if (meVote) {
      // 是me選的選項，粗體
      if (meVote.choiceIdx === i)
        return (
          <Radio key={i} value={i} checked>
            <Typography.Text mark>{text}</Typography.Text>
          </Radio>
        )
      // 非me選的選項
      if (meVote.choiceIdx !== i)
        return (
          <Radio key={i} value={i}>
            {text}
          </Radio>
        )
    }
    // return <Radio key={i} onClick={() => { setShowDetail(true) }}>{text} [{count}]</Radio>
    // if (showResult) return <Radio key={i} value={i}>{text} [{count}]</Radio>
    return (
      <Radio key={i} value={i}>
        {text}
      </Radio>
    )
  }
  return (
    <Form.Item name="choice" rules={[{ required: true, message: 'Please input your username!' }]}>
      <Radio.Group onChange={onChange} value={meVote?.choiceIdx ?? selectedIdx}>
        {choices.map((e, i) => _choice(i, e))}
      </Radio.Group>
    </Form.Item>
  )
  // return (
  //     <>
  //         {showForm ?
  //             <PollForm poll={poll} choices={choices} initialValues={{ choice: choiceIdx }} /> :
  //             choices
  //         }
  //         {
  //             showResult ??
  //             // <BarChart />
  //             <p>chart</p>
  //         }
  //     </>
  // )
}

// export function PollForm({ poll, choices, initialValues }: { poll: QT.poll, choices: React.ReactNode, initialValues: { choice: number | null } }) {
export function PollForm({ poll, setShowModal }: { poll: PollFragment; setShowModal(a: boolean): void }): JSX.Element {
  const [form] = Form.useForm()
  const [createVote, createVoteResult] = useCreateVoteMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyVotesQuery>({
        query: MyVotesDocument,
      })
      if (data?.createVote && res?.myVotes) {
        cache.writeQuery({
          query: MyVotesDocument,
          data: {
            myVotes: res?.myVotes.concat([data.createVote]),
          },
        })
      }
      setShowModal(false)
    },
  })
  // const [createReply, createReplyResult] = useCreateReplyMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<RepliesQuery, RepliesQueryVariables>({
  //       query: RepliesDocument,
  //       variables: { commentId: poll.commentId.toString() },
  //     })
  //     if (data?.createReply && res?.replies) {
  //       cache.writeQuery<RepliesQuery, RepliesQueryVariables>({
  //         query: RepliesDocument,
  //         variables: { commentId: poll.commentId.toString() },
  //         data: { replies: res?.replies.concat([data?.createReply]) },
  //       })
  //       // addReplyCountByOne()
  //       form.resetFields()
  //     }
  //   },
  // })
  function onFinish(values: any) {
    console.log(values)
    // form
    //   .validateFields()
    //   .then(v => {
    //     console.log(v)
    //   })
    //   .catch(e => {
    //     console.log(e)
    //   })

    const choiceIdx = values.choice
    // if (choiceIdx === undefined) {
    //   form.
    // }
    // createVote({
    //   variables: {
    //     pollId: poll.id,
    //     choiceIdx,
    //   },
    // })
    // if (values.text) {
    //   createReply({
    //     variables: {
    //       data: { text: `<${poll.choices[choiceIdx]}>${values.text}` },
    //       commentId: poll.commentId.toString(),
    //     },
    //   })
    // }
  }
  return (
    <Form form={form} onFinish={onFinish}>
      {/* Form.Item 需要跟<PollChoices />綁在一起，否則無法抓到value */}
      <PollChoices pollId={poll.id} choices={poll.choices} />

      <Form.Item name="text" rules={[{ required: true, message: 'Please input your username!' }]}>
        <Input.TextArea placeholder="意見（可留空）" autoSize={{ minRows: 3 }} />
      </Form.Item>

      <Form.Item>
        {/* {createVoteResult.loading || createReplyResult.loading ? (
          <Spin />
        ) : (
          <Button shape="round" htmlType="submit">
            送出
          </Button>
        )} */}
      </Form.Item>
    </Form>
  )
}

// export const VoteForm: React.FC<FormProps> = ({ poll, choices }) => {
//   const [createVote, { loading }] = useMutation<QT.createVote, QT.createVoteVariables>(
//     queries.CREATE_VOTE, {
//     update(cache, { data }) {
//       const res = cache.readQuery<QT.myVotes>({
//         query: queries.MY_VOTES,
//       })
//       if (data?.createVote && res?.myVotes) {
//         // const fake = { ...data?.createPostLike, postId, choice: 1 }
//         cache.writeQuery<QT.myVotes>({
//           query: queries.MY_VOTES,
//           data: {
//             myVotes: res?.myVotes.concat([data?.createVote]),
//             // myPostLikes: res?.myPostLikes.concat([fake]),
//           },
//         })
//       }
//     },
//   })
//   const [form] = Form.useForm()

//   function onFinish(values: any) {
//     console.log(values)
//     createVote({
//       variables: {
//         pollId: poll.id,
//         choiceId: values.choice,
//       }
//     })
//   }

//   return (
//     <Form
//       form={form}
//       layout="inline"
//       onFinish={onFinish}
//       size="small"
//     >
//       <Form.Item
//         name="choice"
//         rules={[{ required: true, message: '需點選一個選項' }]}
//       >
//         {choices}
//       </Form.Item>

//       <Form.Item>
//         {loading
//           ? <Spin />
//           : <Button shape="round" htmlType="submit">投票</Button>}
//       </Form.Item>

//       {/*
//       TODO: shouldUpdate 會被大量呼叫 -> 慢
//       <Form.Item shouldUpdate>
//         {() => {
//           console.log("touched")
//           if (form.isFieldTouched("choice"))
//             return <Button type="primary" htmlType="submit">送出</Button>
//           else if (loading)
//             return <Spin />
//           return null
//         }}
//       </Form.Item>
//       */}

//     </Form>
//   )
// }

// const PollJudgeForm: React.FC<FormProps> = ({ poll, choices }) => {
//   const [createPostVote, { loading }] = useMutation<QT.createVote, QT.createVoteVariables>(
//     queries.CREATE_VOTE, {
//     update(cache, { data }) {
//       const res = cache.readQuery<QT.myVotes>({
//         query: queries.MY_VOTES,
//       })
//       if (data?.createVote && res?.myVotes) {
//         // const fake = { ...data?.createPostLike, postId, choice: 1 }
//         cache.writeQuery<QT.myVotes>({
//           query: queries.MY_VOTES,
//           data: {
//             myVotes: res?.myVotes.concat([data?.createVote]),
//             // myPostLikes: res?.myPostLikes.concat([fake]),
//           },
//         })
//       }
//     },
//   })
//   const [form] = Form.useForm()
//   const [checkNick, setCheckNick] = useState(false);
//   // useEffect(() => {
//   //   form.validateFields(['nickname']);
//   // }, [checkNick])

//   function onFinish(values: any) {
//     // console.log(values)
//     // createPostVote({
//     //   variables: {
//     //     pollId,
//     //     data: {
//     //       pollId: values.pollId,
//     //       choiceId: values.choiceId,
//     //     }
//     //   }
//     // })
//   }

//   return (
//     <Form
//       layout="inline"
//       size="small"
//       form={form}
//       onFinish={onFinish}
//     >
//       <Form.Item
//         name="choice"
//         rules={[{ required: true, message: '需點選一個選項' }]}
//       >
//         {choices}
//       </Form.Item>

//       <Form.Item
//         rules={[
//           { required: true, message: '需要評斷理由' },
//           { min: 10, message: '需10字以上' }
//         ]}
//         name="comment"
//       >
//         <Input placeholder="理由（例如參考來源的網址）" />
//       </Form.Item>

//       <Form.Item>
//         {loading
//           ? <Spin />
//           : <Button shape="round" htmlType="submit">判定</Button>}
//       </Form.Item>

//     </Form>
//   )
// }

// interface PostPollProps {
//   me?: QT.me_me
//   toLogin?: () => void
//   poll: QT.pollFragment
//   count: QT.pollCount
//   setShowDetail: (a: boolean) => void
// }

// export const PollChoiceRadioGroup: React.FC<PostPollProps> = ({ me, toLogin, poll, count, setShowDetail }) => {
//   // const meJudgement = {
//   //   __typename: "PollJudge",
//   //   id: "1234",
//   //   postId: "2234",
//   //   choice: null
//   // }
//   const meJudgment = undefined

//   const [showResult, setShowResult] = useState<boolean>(false)
//   const [showForm, setShowForm] = useState<boolean>(false)

//   const myVotes = useQuery<QT.myVotes>(
//     queries.MY_VOTES, {
//     fetchPolicy: "cache-only"
//   })

//   // const { data } = useQuery<QT.myPostVotes>(
//   //   queries.MY_POST_VOTES, {
//   //   fetchPolicy: "cache-only"
//   // })
//   const meVote = myVotes.data?.myVotes.find((e) => e.pollId === poll.id)

//   function setOn() {
//     setShowDetail(true)
//     setShowForm(true)
//   }

//   function choice(id: string, text: string, count?: number) {
//     if (!me) return <Radio key={id} value={id} onClick={toLogin}>{text}</Radio>
//     if (meVote) {
//       if (meVote.choiceId === id)
//         return (
//           <Radio key={id} value={id} onClick={() => { setOn() }} checked>
//             <Typography.Text mark>{text}</Typography.Text>
//           </Radio>
//         )
//       if (meVote && meVote.choiceId !== id)
//         return <Radio key={id} value={id} onClick={() => { setOn() }}>{text}</Radio>
//     }
//     // return <Radio key={i} onClick={() => { setShowDetail(true) }}>{text} [{count}]</Radio>
//     // if (showResult) return <Radio key={i} value={i}>{text} [{count}]</Radio>
//     return <Radio key={id} value={id} onClick={() => { setOn() }}>{text}</Radio>
//   }

//   const choices = (
//     <Radio.Group>
//       {poll.choices.map((e, i) => choice(e.id, e.text))}
//     </Radio.Group>
//   )
//   const judgeChoices = (
//     <Radio.Group>
//       {poll.choices.map((c, i) => <Radio key={i} value={i}>{c}</Radio>)}
//       <Radio key={poll.choices.length} value={-1}>無法判定</Radio>
//     </Radio.Group>
//   )

//   let main
//   if (poll.status === QT.PollStatus.CLOSE_FAIL) {
//     main =
//       <>
//         <br />
//         {choices}
//         {/* 投票已結束，因{count.verdict?.failedMsg}原因判定為無效投票 */}
//         <Typography.Text type="secondary">你已經投票</Typography.Text>
//       投票已結束，經...判定為無效投票
//       </>

//   } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS && meVote && count.verdictChoice) {
//     main =
//       <>
//         <br />
//         {choices}
//       投票已結束，你的選擇為：{meVote.choiceId}，判定結果為：{poll.choices[count.verdictChoice]}
//         {/* 你預測成功，贏過71%的預測者，獲得獎勵： */}
//       </>

//   } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS && count.verdictChoice) {
//     main =
//       <>
//         <br />
//         {choices}
//         <Typography.Text type="secondary">你已經投票</Typography.Text>
//       投票已結束，判定結果為：{poll.choices[count.verdictChoice]}<br />
//       </>

//   } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS) {
//     main =
//       <>
//         <br />
//         {choices}
//         <Typography.Text type="secondary">投票已結束</Typography.Text>
//         <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看結果</Button>
//       </>

//   } else if (poll.status === QT.PollStatus.JUDGE && meJudgment) {
//     main =
//       <>
//         投票已結束，你被邀請加入評審團，請評斷實際的結果：
//         <PollJudgeForm poll={poll} choices={judgeChoices} />
//       </>

//   } else if (poll.status === QT.PollStatus.JUDGE) {
//     main =
//       <>
//         <br />
//         {choices}
//         <Typography.Text type="secondary">投票已結束，判定結果中</Typography.Text>
//         <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看投票數</Button>
//       </>

//   } else if (poll.status === QT.PollStatus.OPEN && meVote) {
//     main =
//       <>
//         <br />
//         {choices}
//         <Typography.Text type="secondary">你已經投票</Typography.Text>
//         <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看投票數</Button>
//       </>

//   } else if (poll.status === QT.PollStatus.OPEN && me) {
//     // main = <VoteForm pollId={poll.id} choices={choices} />
//     // main = <VotePostForm pollId={poll.id} choices={choices} />
//     main =
//       <>
//         {
//           showForm ?
//             <Card>
//               <VotePostForm poll={poll} choices={choices} />
//             </Card>
//             :
//             choices
//         }
//       </>

//   } else if (poll.status === QT.PollStatus.OPEN) {
//     main = choices

//   } else {
//     throw new Error("不應該有漏掉的case")
//   }

//   return (
//     <>
//       {main}
//       {
//         showResult &&
//         // <BarChart />
//         <p>chart</p>
//       }
//     </>
//   )
// }

// --- Deprecated ---

// function _PollChoicesAndForm({
//   poll,
//   count,
//   setShowReplies,
//   setFilterRepliesPattern,
// }: {
//   poll: QT.poll
//   count: any
//   setShowReplies(a: boolean): void
//   setFilterRepliesPattern(a: string | null): void
// }) {
//   /** @deprecated */
//   // const meJudgement = {
//   //   __typename: "PollJudge",
//   //   id: "1234",
//   //   postId: "2234",
//   //   choice: null
//   // }
//   // const meJudgment = undefined

//   const [showResult, setShowResult] = useState<boolean>(false)
//   const [showForm, setShowForm] = useState<boolean>(false)
//   const [choiceIdx, setChoiceIdx] = useState<number | null>(null)
//   const myVotes = useQuery<QT.myVotes>(queries.MY_VOTES, {
//     fetchPolicy: 'cache-only',
//   })
//   const meVote = myVotes.data?.myVotes.find(e => e.pollId === poll.id)

//   function onClickChoice(i: number) {
//     setChoiceIdx(i)
//     setFilterRepliesPattern(`(${i})`)
//     setShowReplies(true)
//     setShowForm(true)
//   }
//   function choice(i: number, text: string, count?: number) {
//     // if (!me) return <Radio key={id} value={id} onClick={toLogin}>{text}</Radio>
//     // me有投票
//     if (meVote) {
//       // 是me選的選項，粗體
//       if (meVote.choiceIdx === i)
//         return (
//           <Radio
//             key={i}
//             value={i}
//             onClick={function () {
//               onClickChoice(i)
//             }}
//             checked
//           >
//             <Typography.Text mark>{text}</Typography.Text>
//           </Radio>
//         )
//       // 非me選的選項
//       if (meVote.choiceIdx !== i)
//         return (
//           <Radio
//             key={i}
//             value={i}
//             onClick={function () {
//               onClickChoice(i)
//             }}
//           >
//             {text}
//           </Radio>
//         )
//     }
//     // return <Radio key={i} onClick={() => { setShowDetail(true) }}>{text} [{count}]</Radio>
//     // if (showResult) return <Radio key={i} value={i}>{text} [{count}]</Radio>
//     return (
//       <Radio
//         key={i}
//         value={i}
//         onClick={function () {
//           onClickChoice(i)
//         }}
//       >
//         {text}
//       </Radio>
//     )
//   }
//   const choices = <Radio.Group>{poll.choices.map((e, i) => choice(i, e))}</Radio.Group>
//   // const judgeChoices = (
//   //     <Radio.Group>
//   //         {poll.choices.map((c, i) => <Radio key={i} value={i}>{c}</Radio>)}
//   //         <Radio key={poll.choices.length} value={-1}>無法判定</Radio>
//   //     </Radio.Group>
//   // )

//   // let main
//   // if (poll.status === QT.PollStatus.CLOSE_FAIL) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //             {/* 投票已結束，因{count.verdict?.failedMsg}原因判定為無效投票 */}
//   //             <Typography.Text type="secondary">你已經投票</Typography.Text>
//   //     投票已結束，經...判定為無效投票
//   //         </>

//   // } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS && meVote && count.verdictChoice) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //     投票已結束，你的選擇為：{meVote.choiceId}，判定結果為：{poll.choices[count.verdictChoice]}
//   //             {/* 你預測成功，贏過71%的預測者，獲得獎勵： */}
//   //         </>

//   // } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS && count.verdictChoice) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //             <Typography.Text type="secondary">你已經投票</Typography.Text>
//   //     投票已結束，判定結果為：{poll.choices[count.verdictChoice]}<br />
//   //         </>

//   // } else if (poll.status === QT.PollStatus.CLOSE_SUCCESS) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //             <Typography.Text type="secondary">投票已結束</Typography.Text>
//   //             <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看結果</Button>
//   //         </>

//   // } else if (poll.status === QT.PollStatus.JUDGE && meJudgment) {
//   //     main =
//   //         <>
//   //             投票已結束，你被邀請加入評審團，請評斷實際的結果：
//   //             <PollJudgeForm poll={poll} choices={judgeChoices} />
//   //         </>

//   // } else if (poll.status === QT.PollStatus.JUDGE) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //             <Typography.Text type="secondary">投票已結束，判定結果中</Typography.Text>
//   //             <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看投票數</Button>
//   //         </>

//   // } else if (poll.status === QT.PollStatus.OPEN && meVote) {
//   //     main =
//   //         <>
//   //             <br />
//   //             {choices}
//   //             <Typography.Text type="secondary">你已經投票</Typography.Text>
//   //             <Button size="small" type="link" onClick={() => { setShowResult(!showResult) }}>查看投票數</Button>
//   //         </>

//   // } else if (poll.status === QT.PollStatus.OPEN && me) {
//   //     // main = <VoteForm pollId={poll.id} choices={choices} />
//   //     // main = <VotePostForm pollId={poll.id} choices={choices} />
//   //     main =
//   // <>
//   //     {
//   //         showForm ?
//   //             <Card>
//   //                 <VotePostForm poll={poll} choices={choices} />
//   //             </Card>
//   //             :
//   //             choices
//   //     }
//   // </>

//   // } else if (poll.status === QT.PollStatus.OPEN) {
//   //     main = choices

//   // } else {
//   //     throw new Error("不應該有漏掉的case")
//   // }

//   function onFinish(values: any) {
//     // console.log(values)
//     // if (values.text) {
//     //     const result = await createReply({
//     //         variables: {
//     //             data: {
//     //                 // cat: QT.PostCat.REPLY,
//     //                 // symbolIds: [],
//     //                 text: values.text,
//     //             },
//     //             commentId: poll.commentId,
//     //         }
//     //     })
//     // }
//     // createVote({
//     //     variables: {
//     //         pollId: poll.id,
//     //         choiceIdx: values.choice,
//     //         // postId: result.data?.createPost.id,
//     //     }
//     // })
//   }

//   return (
//     <>
//       {/* <Form onFinish={onFinish} size="small" initialValues={{ choice: 1 }}>
//                 <Form.Item name="choice" required={true}>
//                     {choices}
//                 </Form.Item>
//                 <Form.Item shouldUpdate={showForm}>
//                     {({ getFieldValue }) => (
//                         <Button shape="round" htmlType="submit">送出</Button>
//                     )}
//                 </Form.Item>
//             </Form> */}
//       {/* {main} */}
//       {/* {showForm ? <PollForm poll={poll} choices={choices} initialValues={{ choice: choiceIdx }} /> : choices} */}
//       {showResult ?? (
//         // <BarChart />
//         <p>chart</p>
//       )}
//     </>
//   )
// }
