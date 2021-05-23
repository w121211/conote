import React, { useState, useEffect } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import { useRepliesQuery, Reply, useCommentQuery } from '../../apollo/query.graphql'
import { List } from 'antd'
// import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
// import * as QT from '../../graphql/query-types'
import CommentTemplate from '../commentTemplate/commentTemplate'
import Radios from '../radios/radios'
// import ParentSize from '@visx/responsive/lib/components/ParentSize'
import BarChart from '../bar/bar'
import classes from './commentList.module.scss'
import Item from 'antd/lib/list/Item'

type RadioArr = {
  label: string
  counts: number
}

interface listData {
  //   href: string
  //   title: string
  //   description: string
  id: number
  parent?: boolean
  content: string
  floor: string
  type?: string
  radios: RadioArr[]
  clicked: boolean
  comment?: listData[]
  // commentId:string
  // counts?: number[]
}

type FormValues = {
  votes: string
}

const CommentList = ({
  type,
  commentId,
  pollCommentId,
}: {
  type?: string
  commentId: string
  pollCommentId?: string
}) => {
  //如果有poll的commentid replies query 的 variable 要輸入pollCommentId

  const { data: commentsData, loading: commentsLoading, error: commentsError } = useCommentQuery({
    variables: { id: commentId },
  })

  const { data: repliesData, loading: repliesLoading, error: repliesError } = useRepliesQuery({
    // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
    variables: { commentId },
  })

  const { register, handleSubmit } = useForm<FormValues>()
  // const {fields}=useFieldArray()

  const onSubmit: SubmitHandler<FormValues> = (data, e) => {
    console.log(data, e)
  }
  const onError: SubmitErrorHandler<FormValues> = (data, e) => {
    console.log(data, e)
  }

  const repliesLength = repliesData?.replies.length

  return (
    // <>
    //   {commentsData?.comment?.poll && (
    //     <form onSubmit={handleSubmit(onSubmit, onError)}>
    //       {/* {commentsData.comment.poll.choices.map((e, i) => (
    //         ))} */}
    //       {count?.map((e, i) => (
    //         <div key={i}>
    //           <label>
    //             <input type="radio" {...register('votes')} value={`${i}`} />
    //             {commentsData.comment?.poll?.choices[i]}
    //           </label>
    //           <BarChart count={e} total={total && total} />
    //         </div>
    //       ))}
    //       <button type="submit">送出</button>
    //     </form>)}
    <List
      className={classes.List}
      size="small"
      itemLayout="vertical"
      // header={`討論`}
      // pagination={{
      //   onChange: page => {
      //     // console.log(page)
      //   },
      //   pageSize: 5,
      // }}
      rowKey={item => item.id}
      dataSource={repliesData?.replies}
      // footer={
      //   //   <div>
      //   //     <b>ant design</b> footer part
      //   //   </div>
      // }
      renderItem={
        (item, idx) => (
          // item.type == 'vote' ? (null
          // <>
          //   <List.Item>
          //     <List.Item.Meta title={item.content} />

          //     <Radios data={item.radios} countsHandler={countsHandler} />

          //     {/* <BarChart total={item.counts.reduce((a, b) => a + b)} /> */}
          //     {/* <ParentSize>{({ width }) => <PieChart width={width} height={width - 80} />}</ParentSize> */}
          //   </List.Item>
          //   <li className={classes.commentRoot}>
          //     <h4>共{item.comment.length + 1}則留言</h4>
          //     {item.comment.map((el, idx) => {
          //       return <CommentTemplate key={idx} id={item.id} content={el.content} floor={el.floor} />
          //     })}
          //   </li>
          // </>
          // ) : (
          <li className={classes.commentRoot}>
            <CommentTemplate
              id={item.id}
              content={item.text}
              updatedAt={item.updatedAt}
              floor={`#${repliesLength && repliesLength - idx}`}
            />
          </li>
        )
        // )
      }
    />
    // </>
  )
}

export default CommentList
