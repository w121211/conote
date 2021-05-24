import React, { useState, useEffect } from 'react'
import { List } from 'antd'
import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import * as QT from '../../graphql/query-types'
import CommentTemplate from '../commentTemplate/commentTemplate'
import Radios from '../radios/radios'
import ParentSize from '@visx/responsive/lib/components/ParentSize'
import BarChart from '../bar/bar'
import classes from './commentList.module.scss'
import Item from 'antd/lib/list/Item'

// interface IconText {
//   icon: React.FunctionComponent
//   text: string
// }
// const IconText = ({ icon, text }: IconText) => (
//   <Space>
//     {React.createElement(icon)}
//     {text}
//   </Space>
// )
// interface RouteProps extends RouteComponentProps {
//   me?: QT.me_me
// }
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
  // counts?: number[]
}
const CommentList = ({ type }: { type?: string }) => {
  const listData = [
    // {
    //   // href: 'https://ant.design',
    //   // title: `ant design part ${i}`,
    //   // description:
    //   //   'Ant Design, a design language for background applications, is refined by Ant UED Team.',
    //   id: `1`,
    //   parent: false,
    //   content: '可以買了嗎？',
    //   floor: `1`,
    //   clicked: false,
    // },
  ]
  if (type === 'vote') {
    for (let i = 0; i < 14; i++) {
      listData.push({
        // href: 'https://ant.design',
        // title: `ant design part ${i}`,
        // description:
        //   'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        id: `${i}`,
        type: 'vote',
        content: `#${i + 1} 我是問題？`,
        radios: [
          { label: '買', counts: 20 },
          { label: '我是選項Ｂ', counts: 1 },
          { label: '我是選項Ｃ', counts: 50 },
          { label: '賣', counts: 36 },
          { label: '我是選項Ｄ', counts: 11 },
        ],
        // counts: [20, 1, 50, 36, 11],
        floor: `#${i + 1}`,
        clicked: false,
      })
    }
  } else {
    for (let i = 0; i < 14; i++) {
      listData.push({
        // href: 'https://ant.design',
        // title: `ant design part ${i}`,
        // description:
        //   'Ant Design, a design language for background applications, is refined by Ant UED Team.',
        id: `${i}`,
        parent: false,
        content: '可以買了嗎',
        floor: `#${i + 1}`,
        clicked: false,
      })
    }
  }
  const [list, setList] = useState(listData)

  const countsHandler = (key: string, prevIdx: number | null, idx: number) => {
    const keyNumber = +key
    if (list) {
      const deepCopyObj = JSON.parse(JSON.stringify(list))
      prevIdx !== null && (deepCopyObj[keyNumber].radios[prevIdx].counts -= 1)
      idx !== null && (deepCopyObj[keyNumber].radios[idx].counts += 1)
      setList(deepCopyObj)
      // setList(prev => {
      //   prev[keyNumber].radios[prevIdx].counts = prev[keyNumber].radios[prevIdx].counts - 1
      //   prev[keyNumber].radios[prevIdx].counts = prev[keyNumber].radios[prevIdx].counts + 1
      // })
    }
  }

  const parentCommentClickHandler = (id: string) => {
    const commentId = id
    const newList = list.map(item => {
      if (item.id === commentId) {
        // if (item.clicked) {
        //   if (item.input) {
        //     return item
        //   } else {
        //     const updatedItem = {
        //       ...item,
        //       clicked: !item.clicked,
        //     }
        //     return updatedItem
        //   }
        // }
        const updatedItem = {
          ...item,
          clicked: !item.clicked,
        }
        return updatedItem
      }
      return item
    })
    setList(newList)
  }

  return (
    <List
      className={classes.List}
      size="small"
      itemLayout="vertical"
      // header={`討論`}
      pagination={{
        onChange: page => {
          console.log(page)
        },
        pageSize: 5,
      }}
      rowKey={item => item.id}
      dataSource={list}
      // footer={
      //   //   <div>
      //   //     <b>ant design</b> footer part
      //   //   </div>
      // }
      renderItem={item =>
        item.type == 'vote' ? (
          <List.Item>
            <List.Item.Meta title={item.content} />

            <Radios data={item.radios} mykey={item.id} countsHandler={countsHandler} />

            {/* <BarChart total={item.counts.reduce((a, b) => a + b)} /> */}
            {/* <ParentSize>{({ width }) => <PieChart width={width} height={width - 80} />}</ParentSize> */}
          </List.Item>
        ) : (
          <li className={classes.commentRoot}>
            <CommentTemplate id={item.id} content={item.content} floor={item.floor} />
          </li>
        )
      }
    />
  )
}

export default CommentList