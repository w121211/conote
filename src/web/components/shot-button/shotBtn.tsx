import React from 'react'
import classes from './shotBtn.module.scss'

const ShotBtn = ({
  author,
  target,
  choice,
  handleClick,
}: {
  author?: string
  target?: string
  choice?: string
  handleClick: () => void
}): JSX.Element => {
  if (!author && !target && !choice) {
    return (
      <button className="noStyle" onClick={handleClick} contentEditable={false}>
        <span className={classes.left}>新增Shot</span>
      </button>
    )
  }
  return (
    <button className="noStyle" onClick={handleClick} contentEditable={false}>
      <span className={classes.left}>
        {author && <span className={classes.author}>{author}</span>}

        <span className={classes.target}>·{target}</span>
      </span>
      <span
        className={`${classes.choice} ${
          choice === '#LONG' ? classes.long : choice === '#SHORT' ? classes.short : classes.hold
        }`}
      >
        {choice?.replace('#LONG', '看多').replace('#SHORT', '看空').replace('#HOLD', '觀望')}
      </span>
    </button>
  )
}
export default ShotBtn
