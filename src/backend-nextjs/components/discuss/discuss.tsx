import React, { forwardRef, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import CommentList from '../commentList/commentList'
import MyTextArea from '../myTextArea/myTextArea'
import classes from './discuss-page.module.scss'

const Discuss = ({
  switchTab,
  discussClickLHandler,
  discussClickRHandler,
}: {
  switchTab: boolean
  discussClickLHandler: () => void
  discussClickRHandler: () => void
}) => {
  const [ref, bounds] = useMeasure()

  const classLister = (...classArr: string[]) => {
    const arr: string[] = []
    classArr.forEach(className => {
      arr.push(classes[className])
    })
    return arr.join(' ')
  }

  return (
    <div className={classes.container}>
      <div ref={ref}>
        <div className={classes.tabs}>
          <span onClick={discussClickLHandler}>討論</span>
          <span onClick={discussClickRHandler}>Q&A</span>
        </div>

        {/* tabs底線 */}
        <div className={classes.underLine}>
          <div className={`${classes.underLineBar} ${switchTab ? classes.left : classes.right}`}></div>
        </div>

        <MyTextArea />
      </div>

      {/* content */}
      <div className={classes.outer} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
        <div className={classes.inner}>
          <div className={classes.element} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
            {switchTab && <CommentList />}
            {switchTab || <CommentList type="vote" />}
          </div>
        </div>
      </div>
    </div>
  )
}
Discuss.displayName = 'Discuss'
export default Discuss
