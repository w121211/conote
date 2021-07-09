import React, { useState, useEffect, useRef, EventHandler } from 'react'
import { SubmitErrorHandler, SubmitHandler, useForm, useFieldArray } from 'react-hook-form'
import { useRepliesQuery, Reply, useCommentQuery, ReplyFragment } from '../../apollo/query.graphql'
// import { List } from 'antd'
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
  // type,
  boardId,
}: // pollCommentId,
// switchTab,
// anchorHLHandler,
// myScrollIntoView,
// resetHighLight,
{
  boardId: string
  // type?: string
  // commentId: string
  // pollCommentId?: string
  // switchTab?: boolean
  // anchorHLHandler?: (anchorId: string) => void
  // myScrollIntoView?: () => void
  // resetHighLight?: () => void
}) => {
  //   const [repliesList,setRepliesList]=useState<Array<({
  //     __typename?: 'Reply';
  // } & ReplyFragment)>>()
  const myRef = useRef<HTMLLIElement>(null)

  // const onClickHandler = (e: React.MouseEvent, anchorId: IterableIterator<RegExpMatchArray> | null) => {
  //   if (anchorId) {
  //     const anchorIdArr = Array.from(anchorId)
  //     anchorIdArr[0] && anchorHLHandler([...anchorIdArr][0][1].trimEnd())
  //   }
  // }

  // const handleClickOutside = (e: any) => {
  //   if (myRef.current && !myRef.current.contains(e.target)) {
  //     anchorHLHandler('')
  //     resetHighLight()
  //   }
  // }

  // useEffect(() => {
  //   document.body.addEventListener('click', handleClickOutside, true)
  //   return () => {
  //     document.body.removeEventListener('click', handleClickOutside, true)
  //   }
  // })
  // const meCommentId = commentId ? commentId : pollCommentId

  const {
    data: repliesData,
    loading: repliesLoading,
    error: repliesError,
  } = useRepliesQuery({
    // variables: { commentId: `${pollCommentId ? pollCommentId : commentId}` },
    variables: { commentId: boardId },
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
  const testData = {
    replies: [{ text: '測試' }, { text: '測試' }, { text: '哈哈' }, { text: 'yesysefsek' }, { text: '測試' }],
  }

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
    <div
      className={classes.List}
      // size="small"
      // itemLayout="vertical"
      // loadMore={loadMore}
      // rowKey={item => item.id}
      // dataSource={repliesData?.replies}
      // footer={
      //   //   <div>
      //   //     <b>ant design</b> footer part
      //   //   </div>
      // }
      // renderItem={
      //   (item, idx) => (
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
      // )
      // )
      // }
    >
      {testData.replies.map((e, i) => (
        <ul
          className={classes.commentRoot}
          key={i}
          ref={myRef}
          // onClick={e => onClickHandler(e, item.text.matchAll(/(^\d+ )(.+$)/g))}
        >
          <CommentTemplate
            id={`${i}`}
            content={e.text.replace(/(^\d+ )(.+$)/g, '$2')}
            // updatedAt={item.updatedAt}
            floor={`#${repliesLength && repliesLength - i}`}
          />
        </ul>
      ))}
    </div>
    // </>
  )
}

export default CommentList
