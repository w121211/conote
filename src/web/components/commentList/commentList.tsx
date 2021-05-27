import React, { useState, useEffect, useRef } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import { useRepliesQuery, Reply, useCommentQuery, ReplyFragment } from '../../apollo/query.graphql'
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
  switchTab,
  anchorHLHandler,
  myScrollIntoView,
  resetHighLight,
}: {
  type?: string
  commentId: string
  pollCommentId: string
  switchTab: boolean
  anchorHLHandler: (anchorId: string) => void
  myScrollIntoView: () => void
  resetHighLight: () => void
}) => {
  //   const [repliesList,setRepliesList]=useState<Array<({
  //     __typename?: 'Reply';
  // } & ReplyFragment)>>()
  const myRef = useRef<HTMLLIElement>(null)

  const onClickHandler = (e: any, anchorId: string) => {
    anchorHLHandler(anchorId)
    myScrollIntoView()

    // const highLight = document.getElementsByClassName('highLight')
    // highLight && highLight[0].scrollIntoView()
  }

  const handleClickOutside = (e: any) => {
    if (myRef.current && !myRef.current.contains(e.target)) {
      anchorHLHandler('')
      resetHighLight()
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })
  const meCommentId = switchTab && commentId ? commentId : pollCommentId

  const { data: repliesData, loading: repliesLoading, error: repliesError } = useRepliesQuery({
    // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
    variables: { commentId: meCommentId },
    fetchPolicy: 'cache-first',
  })

  const repliesLength = repliesData?.replies.length
  // useEffect(() => {
  //   if(repliesData&&!repliesLoading){
  //     setRepliesList(repliesData.replies)
  //   }
  // },[])

  // const { register, handleSubmit } = useForm<FormValues>()
  // // const {fields}=useFieldArray()

  // const onSubmit: SubmitHandler<FormValues> = (data, e) => {
  //   console.log(data, e)
  // }
  // const onError: SubmitErrorHandler<FormValues> = (data, e) => {
  //   console.log(data, e)
  // }

  // const loadMore = () => {}

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
      // loadMore={loadMore}
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
          <li className={classes.commentRoot} ref={myRef} onClick={e => onClickHandler(e, item.text.slice(0, 3))}>
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
