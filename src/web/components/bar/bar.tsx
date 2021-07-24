import React from 'react'
import { Poll } from '../../apollo/query.graphql'
import classes from './bar.module.scss'

const BarChart = ({ pollData }: { pollData: Poll }) => {
  const persentage = (count: number, total: number) => Math.round((count / total + Number.EPSILON) * 100) || 0
  const total = pollData.count.nVotes.length === 0 ? 0 : pollData.count.nVotes.reduce((a, b) => a + b)
  return (
    <>
      {pollData.choices.map((e, i) => (
        // <div key={i}>
        <span className={` ${classes.vote} ${classes.text}`} key={i}>
          <div
            className={classes.voteColorBlock}
            style={{
              clipPath: ` polygon(0 0, ${persentage(pollData.count.nVotes[i], total) + '%'} 0, ${
                persentage(pollData.count.nVotes[i], total) + '%'
              } 100%,0 100%) `,
            }}
          >
            <span className={classes.voteColorBlockText}>
              {typeof e === 'string' && e.replace(/^<(.+)>$/g, '$1').toLowerCase()}
              <span>
                {persentage(pollData.count.nVotes[i], total)}%({pollData.count.nVotes[i] || 0})
              </span>
            </span>
          </div>
          <span className={classes.voteText}>
            {typeof e === 'string' && e.replace(/^<(.+)>$/g, '$1').toLowerCase()}
            <span>
              {persentage(pollData.count.nVotes[i], total)}%({pollData.count.nVotes[i] || 0})
            </span>
          </span>
          {/* <span className={quesClasses.voteColorBlockText}>{e.content}</span> */}
        </span>
        // {/* </div> */}
        // <div className={classes.container} key={i}>
        //   <div className={classes.barWrapper}>
        //     <div className={classes.bar} style={{ width: `${persentage(pollData.count.nVotes[i], total) + '%'}` }} />
        //   </div>
        //   <span className={classes.number}>{`${persentage(pollData.count.nVotes[i], total)}% (${
        //     pollData.count.nVotes[i]
        //   })`}</span>
        // </div>
      ))}
    </>
  )
}
export default BarChart
