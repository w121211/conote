import React, { forwardRef, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import CommentList from '../components/commentList/commentList'
import MyTextArea from '../components/myTextArea/myTextArea'
import classes from './discuss-page.module.scss'

const Discuss = () => {
  const [discuss, setDiscuss] = useState('left')
  const [ref, bounds] = useMeasure()
  const clickLHandler = () => {
    setDiscuss('left')
  }
  const clickRHandler = () => {
    setDiscuss('right')
  }

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
          <span onClick={clickLHandler}>討論</span>
          <span onClick={clickRHandler}>Q&A</span>
        </div>

        {/* tabs底線 */}
        <div className={classes.underLine}>
          <div className={classLister('underLineBar', discuss)}></div>
        </div>

        <MyTextArea />
      </div>

      {/* content */}
      <div className={classes.outer} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
        <div className={classes.inner}>
          <div className={classes.element} style={{ height: `calc(100vh - ${bounds.height}px)` }}>
            {discuss === 'left' && <CommentList />}
            {discuss === 'right' && <CommentList type="vote" />}
          </div>
        </div>
      </div>
    </div>
  )
}
Discuss.displayName = 'Discuss'
export default Discuss
