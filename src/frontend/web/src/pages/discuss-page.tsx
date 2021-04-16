import React from 'react'
import CommentList from '../components/commentList/commentList'
import classes from './discuss-page.module.scss'

const Discuss = () => {
  return (
    <>
      <div className={classes.tags}>
        <span>討論</span>
        <span>Q&A</span>
      </div>
      <CommentList />
    </>
  )
}

export default Discuss
