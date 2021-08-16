import React, { useEffect, useState } from 'react'
// import { Poll } from '../../apollo/query.graphql'

import classes from './bar.module.scss'

const BarChart = ({
  content,
  value,
  count,
  total,
  voted,

  checked,
}: {
  // pollData?: Poll
  content: string
  value: number
  total: number
  count: number
  voted: boolean

  checked?: boolean
}): JSX.Element => {
  // const [myData, setMyData] = useState(pollData)
  const persentage = (count: number, total: number) => Math.round((count / total + Number.EPSILON) * 100) || 0
  // const total = myData?.count.nVotes.length === 0 ? 0 : myData?.count.nVotes.reduce((a, b) => a + b)
  // useEffect(() => {
  //   setMyData(pollData)
  // }, [pollData])

  return (
    <div className={classes.barChartWrapper}>
      <span className={` ${classes.vote} ${classes.text} ${checked && classes.clicked}`}>
        <div
          className={`${classes.voteColorBlock} ${voted ? classes.voted : ''}`}
          style={{
            clipPath: `polygon(0% 0, ${persentage(count, total)}% 0, ${persentage(count, total)}% 100%,0% 100%) `,

            // width: `${persentage(count, total)}%`,
          }}
        >
          <span className={classes.voteColorBlockText}>
            {content}
            {/* {typeof e === 'string' && e.replace(/^<(.+)>$/g, '$1').toLowerCase()} */}
            <span>
              {persentage(count, total)}%({count || 0})
            </span>
          </span>
        </div>
        <span className={classes.voteText}>
          {content}
          {/* {typeof e === 'string' && e.replace(/^<(.+)>$/g, '$1').toLowerCase()} */}
          <span>
            {persentage(count, total)}%({count || 0})
          </span>
        </span>
        {/* <span className={quesClasses.voteColorBlockText}>{e.content}</span> */}
      </span>

      {/* ))} */}
    </div>
  )
}
export default BarChart
