import React from 'react'
import classes from './bar.module.scss'

const BarChart = ({ total, count }: { total: number; count: number }) => {
  const persentage = Math.round((count / total + Number.EPSILON) * 100) || 0
  return (
    <div className={classes.container}>
      <div className={classes.barWrapper}>
        <div className={classes.bar} style={{ width: `${persentage + '%'}` }} />
      </div>
      <span className={classes.number}>{`${persentage}% (${count})`}</span>
    </div>
  )
}
export default BarChart
