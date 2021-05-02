import React, { useState } from 'react'
import { useQuery, useMutation } from '@apollo/client'
// import { Link } from '@reach/router'
import { Button, Comment as AntdComment, Modal, Popover, Tag, Tooltip, Radio, Form, Space } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
// import { CommentList } from './commentList'
import { PollForm } from './poll-form'
import { ReplyPanel, CommentPanel } from './tile-panel'
// import { ReplyList, QueryReplyList } from './tile-list'
import { ReplyForm } from './tile-forms'
// import tagCss from './tag/tag.module.scss'
// import tagPopoverCss from './tagPopover/tagPopover.module.scss'
// import commentListSmallCss from './commentListSmall/commentListSmall.module.scss'
// import blockMetaCss from './blockMeta/blockMeta.module.scss'
// import modalCss from '../components/modal.module.scss'
// import { MdText } from './markdown'

export interface TileOptions {
  dispReplies?: boolean
  dispTopReplies?: boolean
  dispCommentAs?: 'comment' | 'key-value'
  dispReplyAs?: 'line' | 'tag' | 'tile'
  swapText?: string
  swapChoices?: string[]
  suggestReplies?: string[]
}

export const defaultTileOptions: TileOptions = {
  dispReplies: false,
  dispTopReplies: true,
  dispCommentAs: 'comment',
  dispReplyAs: 'line',
}

// export function Reply({
//   reply,
//   me,
//   options = defaultTileOptions,
// }: {
//   reply: QT.replies_replies
//   me?: QT.me_me
//   options?: TileOptions
// }): JSX.Element {
//   // const edit = me?.id === post.userId ? <Link to={`/post/${post.id}?update`}>edit</Link> : null
//   const panel = <ReplyPanel reply={reply} meAuthor={me?.id === reply.userId} />
//   // return <MdText text={reply.text} />
//   if (options.dispReplyAs === 'tag') {
//     return (
//       <span>
//         <Popover className={tagPopoverCss.popover} content={panel}>
//           <Tag className={tagCss.tag}>
//             <MdText text={reply.text} />
//             <span>({reply.count.nUps - reply.count.nDowns})</span>
//           </Tag>
//         </Popover>
//       </span>
//     )
//   } else if (options.dispReplyAs === 'tile') {
//     return (
//       <span>
//         <Popover className={tagPopoverCss.popover} content={panel}>
//           <MdText text={reply.text} />
//           <span>({reply.count.nUps - reply.count.nDowns})</span>
//         </Popover>
//         {/* {panel} */}
//       </span>
//     )
//   } else {
//     return (
//       <li className={commentListSmallCss.commentRoot}>
//         <AntdComment content={reply.text} />
//         {panel}
//       </li>
//     )
//   }
//   // return (
//   //   <li>
//   //     <TextMarker text={reply.text} />
//   //     <p>{reply.text}</p>
//   //     <ReplyPanel reply={reply} meAuthor={me?.id === reply.userId} />
//   //   </li>
//   // )
// }

// export function SuggestReply({
//   text,
//   onClick = () => {},
//   options = defaultTileOptions,
// }: {
//   text: string
//   onClick(): void
//   options?: TileOptions
// }): JSX.Element {
//   return (
//     <Tag style={{ background: '#fff', borderStyle: 'dashed' }} onClick={onClick}>
//       {text}
//     </Tag>
//   )
// }

export function QueryCommentModal({
  commentId,
  children,
}: {
  commentId: string
  children: React.ReactNode
}): JSX.Element {
  const [showModal, setShowModal] = useState<boolean>(false)
  const [suggestReply, setSuggestReply] = useState<string | undefined>()
  const { data, loading, error, refetch } = useQuery<QT.comment, QT.commentVariables>(queries.COMMENT, {
    variables: { id: commentId },
  })

  function onClickFactory(text: string) {
    return function () {
      setSuggestReply(text)
      setShowModal(true)
    }
  }

  if (loading) return <span>loading...</span>
  if (error || !data) return <p>ERROR: {error?.message}</p>
  if (data.comment === null) return <p>Comment not found</p>
  return (
    <div>
      <Modal
        // title="Comment"
        visible={showModal}
        footer={null}
        onCancel={() => {
          setShowModal(false)
        }}
      >
        {data.comment.poll ? (
          <PollForm poll={data.comment.poll} setShowModal={setShowModal} />
        ) : (
          <ReplyForm
            commentId={data.comment.id}
            suggestText={suggestReply}
            addReplyCountByOne={() => {}}
            // onFinish={() => {
            //   setShowModal(false)
            // }}
          />
        )}
        {/* <QueryReplyList commentId={data.comment.id} /> */}

        {/* <SearchAllForm /> */}
      </Modal>
      <Button
        onClick={() => {
          setShowModal(true)
        }}
      >
        {children}
      </Button>
    </div>
  )
  // }
  // if (folded)
  //   return (
  //     <div>
  //       ------Comment-------
  //       <p>{options.swapText ? options.swapText : comment.text}</p>
  //       <CommentPanel comment={comment} />
  //       <h4>-Spot Replies-</h4>
  //       {comment.topReplies ? <ReplyList replies={comment.topReplies} /> : null}
  //       <button onClick={function (e) { setFolded(!folded) }}>展開</button>
  //       <br />
  //       -------------
  //     </div>
  //   )
  // return (
  //   <>
  //     <span>{options.swapText ? options.swapText : comment.text}</span>
  //     <CommentPanel comment={comment} />

  //     {/* <h4>-Queried Replies-</h4> */}
  //     {/* <QueryReplyList commentId={comment.id} /> */}
  //     {/* <ReplyForm commentId={comment.id} addReplyCountByOne={function () { }} /> */}
  //     {/* <button onClick={function (e) { setFolded(!folded) }}>折疊</button> */}
  //   </>
  // )

  // if (options.dispCommentAs === 'key-value') {
  // if (folded)
  //   return (
  //     <li>
  //       <span className={blockMetaCss.span}>{options.swapText ? options.swapText : comment.text}</span>
  //       {/* TODO: 為了replyForm的cache而叫，但每個comment都叫太花費資源 */}
  //       {<QueryReplyList commentId={comment.id} />}
  //       {/* {comment.topReplies && <ReplyList replies={comment.topReplies} options={{ dispReplyAs: options.dispReplyAs }} />} */}
  //       <Button type="link" onClick={function () { setShowModal(true) }}>
  //         新增
  //       </Button>
  //       <Modal title="Reply" visible={showModal} footer={null} onCancel={function () { setShowModal(false) }}>
  //         <ReplyForm commentId={comment.id} addReplyCountByOne={function () { }} onFinish={function () { setShowModal(false) }} />
  //       </Modal>
  //       {/* <p>{options.replacedText ? options.replacedText : comment.text}</p>
  //       <CommentPanel comment={comment} />
  //       <h4>-Spot Replies-</h4>
  //       {comment.topReplies ? <ReplyList replies={comment.topReplies} /> : null}
  //       <button onClick={function (e) { setFolded(!folded) }}>展開</button>
  //       <br /> */}
  //     </li>
  //   )
}

// export function CommentList({ comments }: { comments: QT.comment[] }) {
//   const spotComments = comments.filter(e => e.isTop)
//   const otherComments = comments.filter(e => !e.isTop)
//   return (
//     <>
//       <h3>Spot Comments</h3>
//       {spotComments.map(function (e, i) {
//         return <Comment comment={e} key={i} />
//       })}
//       <h3>Other Comments</h3>
//       {otherComments.map(function (e, i) {
//         return <Comment comment={e} key={i} />
//       })}
//     </>
//   )
// }

// const PostCard: React.FC<PostCardProps> = ({ post, me, toLogin, choice, folded = true, noHeader = false, noSpin = false, noThread = false }) => {
//   const [commentCount, setCommentCount] = useState<number>(post.count.nComments)
//   const [showComments, setShowComments] = useState<boolean>(false)

//   function toAddCommentCountByOne() { setCommentCount(commentCount + 1) }

//   const mePosted = me?.id === post.userId
//   const edit = me?.id === post.userId
//     ? <Link to={`/post/${post.id}?update`}>edit</Link>
//     : null

//   return (
//     <>
//       <Typography.Paragraph>
//         {`[${choice}] ${post.text}`}
//         <PostFooter {...{ post, commentCount, showComments, setShowComments, mePosted }} />
//       </Typography.Paragraph>
//       {/* {
//         showComments &&
//         <CommentList me={me} postId={post.id} toAddCommentCountByOne={toAddCommentCountByOne} />
//       } */}
//     </>
//   )
// }

// interface PollProps {
//   // createPostLike: (variables: QT.createPostLikeVariables) => void
//   // updatePostLike: (variables: QT.updatePostLikeVariables) => void
//   // comments: React.StatelessComponent
//   poll: QT.pollFragment
//   me?: QT.me_me
//   toLogin?: () => void
//   folded?: boolean
//   noHeader?: boolean
//   noSpin?: boolean
//   noThread?: boolean
//   myVotes?: QT.myVotes_myVotes[]
// }

// enum TailPanel {
//   POSTS,
//   SUBMIT,
// }

// function ChoicePanel({ choices }: { choices: QT.choice[] }) {
//   return (
//     <Space>
//       {
//         choices.map(e =>
//           <Button key={e.id} size="small" shape="round" onClick={() => {
//             // setShowComments(!showComments)
//           }}>
//             {e.text}
//             {/* &nbsp; */}
//             {/* <small><LikeOutlined />30</small> */}
//           </Button>
//         )
//       }
//     </Space>
//   )
// }

// export const PollCard: React.FC<PollProps> = ({ poll, me, toLogin, myVotes = [], folded = true, noHeader = false, noSpin = false, noThread = false }) => {
//   const [commentCount, setCommentCount] = useState<number>(poll.count.nComments)
//   const [showComments, setShowComments] = useState<boolean>(false)
//   const [showDetail, setShowDetail] = useState<boolean>(!folded)
//   const [viewed, setViewed] = useState<boolean>(false)
//   const [tailPanel, setTailPanel] = useState<TailPanel>(TailPanel.POSTS)
//   const [clickedChoiceId, setClickedChoiceId] = useState<string | null>(null)

//   function toAddCommentCountByOne() {
//     setCommentCount(commentCount + 1)
//   }

//   const mePolled = me?.id === poll.userId
//   const meVote = myVotes.find(e => e.pollId === poll.id)
//   // const edit = me?.id === poll.userId
//   //   ? <Link to={`/post/${poll.id}?update`}>edit</Link>
//   //   : null

//   const start = dayjs(poll.start)
//   const end = dayjs(poll.end)
//   const title = poll.cat === QT.PollCat.FIXED ? poll.title : `${poll.title}[開放式回答]`

//   const comments = poll.posts.map(e => ({
//     ...e,
//     thisPollVote: e.votes.find(e => e.pollId === poll.id)
//   }))

//   const postsDict = Object.fromEntries<QT.pollFragment_posts[]>(
//     poll.choices.map(e => {
//       const posts = poll.posts.filter(f => {
//         const v = f.votes.find(g => g.pollId === poll.id)
//         if (v?.choiceId === e.id) return true
//         else return false
//       })
//       return [e.id, posts]
//     })
//   )
//   const choiceDict = Object.fromEntries(
//     poll.choices.map(e => [e.id, e])
//   )

//   return (
//     <Card>

//       <Typography.Paragraph>

//         <PollFooter {...{ poll, commentCount, showComments, setShowComments, mePolled }} />

//         {/* <Typography.Text type="secondary">邀請您參與評審：</Typography.Text> */}
//         {
//           <span onClick={() => { setViewed(true); setShowDetail(!showDetail) }}>
//             {
//               viewed ?
//                 <Typography.Text>{title}&nbsp;</Typography.Text>
//                 :
//                 <Typography.Text strong>{title}&nbsp;</Typography.Text>
//             }
//           </span>
//         }

//         <SymbolList symbols={poll.symbols} />

//         {
//           meVote &&
//           <>
//             <br />
//             <Typography.Text type="secondary">你已經投票</Typography.Text>
//           </>
//         }

//         {/* <PollChoiceRadioGroup {...{ pollId: poll.id, me, poll, count: poll.count, setShowDetail }} /> */}

//       </Typography.Paragraph>

//       {/* {
//         showComments &&
//         <Typography.Paragraph>
//           {poll.text}
//         </Typography.Paragraph>
//       } */}

//       <Typography.Paragraph>
//         <Space>
//           {
//             poll.choices.map(e =>
//               <Button key={e.id} data-id={e.id} size="small" shape="round"
//                 type={e.id === clickedChoiceId ? "primary" : "default"}
//                 onClick={(e) => {
//                   setShowComments(true)
//                   setShowDetail(true)
//                   setClickedChoiceId(e.currentTarget.getAttribute('data-id'))
//                 }}
//               >
//                 {e.text}&nbsp;<small>?%</small>
//                 {/* &nbsp; <small><LikeOutlined />30</small> */}
//               </Button>
//             )
//           }
//           <Button type="link" size="small">新增選項</Button>
//           {/* <Button type="link" size="small">所有</Button> */}
//         </Space>
//       </Typography.Paragraph>
//       {/* {
//         showDetail &&
//         <Typography.Paragraph>
//           <Typography.Text type="secondary">
//             預測日：{end.format('l')}
//             <br />投票期間：{start.format('l')} - {end.format('l')}
//             <br />判定方式：投票人評審小組
//           </Typography.Text>
//         </Typography.Paragraph>
//       } */}
//       {
//         // showComments && clickedChoiceId && postsByChoice[clickedChoiceId].length > 0 &&
//         showComments && clickedChoiceId &&
//         <>
//           <List
//             bordered
//             size="small"
//             dataSource={postsDict[clickedChoiceId]}
//             locale={{ emptyText: `[${choiceDict[clickedChoiceId].text}] 無人回覆` }}
//             renderItem={e => {
//               return (
//                 <List.Item>
//                   <PostCard post={e} me={me} choice={choiceDict[clickedChoiceId].text} />
//                 </List.Item>
//               )
//             }}
//           />
//           <br />
//         </>
//         // <>
//         //   <Divider />
//         //   {
//         //     poll.posts && poll.posts.length > 0 ?
//         //       poll.posts.map((e, i) => <PostCard key={i} post={e} me={me} />)
//         //       :
//         //       "暫無回應"
//         //   }
//         // </>
//         // <CommentList me={me} postId={poll.id} toAddCommentCountByOne={toAddCommentCountByOne} />
//       }
//       {
//         showComments && clickedChoiceId && !meVote &&
//         <>
//           <Card size="small">
//             <VotePostForm pollId={poll.id} choice={choiceDict[clickedChoiceId]} />
//             {/* <NewChoicePostForm /> */}
//           </Card>
//         </>
//       }
//     </Card>
//   )
// }

// export const Post: React.FC<PostCardProps> = ({ post, me, toLogin, folded = false, noHeader = false }) => {
//   switch (post.cat) {
//     case QT.PostCat.LINK:
//       // return <PostCard title={<a target="_new" href="link">title<a />} />
//       return null
//     case QT.PostCat.REPLY:
//       return <PostCard post={post} me={me} toLogin={toLogin} folded={folded} noHeader={noHeader} noThread noSpin choice="choice" />
//   }
// }
