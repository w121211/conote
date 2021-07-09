import { ReactNode, useEffect, useRef, useState } from 'react'
import {
  useCreateReplyMutation,
  useCommentQuery,
  RepliesQuery,
  RepliesQueryVariables,
  RepliesDocument,
  useRepliesQuery,
  useCreateVoteMutation,
  CommentQuery,
  CommentQueryVariables,
  CommentDocument,
  MyVotesDocument,
  MyVotesQuery,
  useMyVotesQuery,
  MyVotesQueryResult,
  Vote,
} from '../../apollo/query.graphql'
import Link from 'next/link'
import { Popconfirm, PopconfirmProps } from 'antd'
import { toUrlParams } from '../../lib/helper'
import { Editor, Section, ExtTokenStream, streamToStr, ExtToken } from '../../../packages/editor/src/index'
import { CommentForm } from '../discuss/discuss-comment-form'
import CommentList from '../commentList/commentList'
import classes from '../card.module.scss'
import quesClasses from './question.module.scss'

const QuestionChildren = ({
  stream,
  voteCount,
  type,
}: {
  stream: ExtToken | string
  voteCount?: number[]
  type: string
}) => {
  return (
    <span className={quesClasses.childrenWrapper}>
      {typeof stream !== 'string' && stream.content !== '\n'
        ? typeof stream !== 'string' &&
          Array.isArray(stream.content) &&
          stream.content
            .filter(e => e !== '\n')
            .map((e, i) => {
              if (typeof e !== 'string' && (e.type === 'topic' || e.type === 'ticker'))
                return (
                  <span className={`${classes.keyword} ${quesClasses.link}`} key={i}>
                    <Link href={`/card?${toUrlParams({ s: (typeof e.content === 'string' && e.content) || '' })}`}>
                      {e.content}
                    </Link>
                  </span>
                )
              if (typeof e !== 'string' && e.type === 'vote-chocie') {
                const persentage =
                  (voteCount &&
                    Math.round((voteCount[i] / voteCount.reduce((a, b) => a + b) + Number.EPSILON) * 100)) ||
                  0
                return (
                  // <span>
                  <span className={` ${quesClasses.vote} ${quesClasses.text}`} key={i}>
                    <div className={quesClasses.voteColorBlock} style={{ width: ` ${persentage + '%'}` }}>
                      <span className={quesClasses.voteText}>
                        {typeof e.content === 'string' && e.content.replace(/^<(.+)>$/g, '$1').toLowerCase()}
                      </span>
                      {/* <span className={quesClasses.voteColorBlockText}>{e.content}</span> */}
                    </div>
                  </span>
                  // </span>
                )
              }
              if (typeof e !== 'string' && e.type === 'vote-chocie' && type === 'inline-mark') {
                const persentage =
                  (voteCount &&
                    Math.round((voteCount[i] / voteCount.reduce((a, b) => a + b) + Number.EPSILON) * 100)) ||
                  0
                return (
                  // <span>
                  <span className={` ${quesClasses.vote} ${quesClasses.text}`} key={i}>
                    <div className={quesClasses.voteColorBlock} style={{ width: ` ${persentage + '%'}` }}>
                      <span className={quesClasses.voteText}>
                        {typeof e.content === 'string' && e.content.replace(/^<(.+)>$/g, '$1').toLowerCase()}
                      </span>
                      {/* <span className={quesClasses.voteColorBlockText}>{e.content}</span> */}
                    </div>
                  </span>
                  // </span>
                )
              }

              if (typeof e === 'string' && e !== '\n') return <span className={quesClasses.text}>{e}</span>
            })
        : null}
    </span>
  )
}
interface showModal {
  show: boolean
}

const QuestionParent = ({
  stream,
  mykey,
  cardCommentId,
  type,
}: {
  stream: ExtToken | string
  mykey: number
  cardCommentId: number
  type: string
}) => {
  const [showModal, setShowModal] = useState(false)
  const [voteTotal, setVoteTotal] = useState<number[]>()
  const myRef = useRef<HTMLSpanElement>(null)
  const handleClickOutside = (e: any) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      setShowModal(false)
    }
  }
  useEffect(() => {
    document.body.addEventListener('click', handleClickOutside, true)
    return () => {
      document.body.removeEventListener('click', handleClickOutside, true)
    }
  })
  const commentId = (typeof stream !== 'string' && stream.markerline?.commentId) || cardCommentId
  // if (stream.markerline?.commentId) {
  const {
    data: commentsData,
    loading: commentsLoading,
    error: commentsError,
    refetch: refetchComment,
  } = useCommentQuery({
    variables: { id: commentId.toString() },
    fetchPolicy: 'cache-first',
  })
  const {
    data: myVotesData,
    loading: myVotesLoading,
    error: myVotesError,
  } = useMyVotesQuery({
    fetchPolicy: 'cache-first',
  })
  useEffect(() => {
    if (commentsData?.comment?.poll) {
      setVoteTotal(commentsData?.comment?.poll?.count.nVotes)
    }
  }, [commentsData, commentsLoading])
  // }

  return (
    <span ref={myRef} style={{ position: 'relative' }}>
      {/* {console.log(stream)} */}
      <Popconfirm
        placement="bottom"
        getPopupContainer={trigger => {
          // console.log('trigger', trigger)
          return trigger
        }}
        visible={showModal}
        // title="d"
        title={
          <>
            {typeof stream !== 'string' && stream.markerline?.anchorId && (
              <>
                <CommentForm commentId={commentId.toString()} anchorId={stream.markerline.anchorId.toString()} />
                <CommentList commentId={commentId.toString()} />
              </>
            )}
          </>
        }
        onCancel={e => {
          // e.stopPropagation()
          // e?.preventDefault()
          // console.log('clickCancel')
          setShowModal(false)
        }}
        onConfirm={e => {
          // e.stopPropagation()
          // e?.preventDefault()
          setShowModal(false)
        }}
        icon={null}
      >
        <span
          className={`${quesClasses.inlineValue} ${classes.inlineValue} `}
          onClick={e => {
            // console.log('clicked', showModal)
            // e.preventDefault()
            setShowModal(prev => !prev)
          }}
        >
          {/* {console.log(stream)} */}
          <span className={quesClasses.bulletWrapper}>
            <div>{mykey}.</div>
          </span>
          <QuestionChildren stream={stream} voteCount={voteTotal} type={type} />
        </span>
      </Popconfirm>
    </span>
  )
}
const Question = ({ stream, cardCommentId }: { stream: (ExtToken | string)[]; cardCommentId: number }) => {
  return (
    <>
      {/* {console.log(stream)} */}
      {Array.isArray(stream) &&
        stream
          .filter(e => e !== '\n')
          .map((e, i) => {
            if (typeof e !== 'string' && (e.type === 'line-mark' || e.type === 'inline-mark')) {
              return (
                <span className={classes.marker}>
                  提問<span className={classes.markerSyntax}>{e.content}</span>
                </span>
              )
            }

            return (
              <QuestionParent
                stream={e}
                key={i}
                mykey={i}
                cardCommentId={cardCommentId}
                type={(typeof e !== 'string' && e.type) || ''}
              />
            )
          })}
    </>
  )
}
export default Question
