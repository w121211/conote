import React, { useState } from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import HomeIcon from '../../assets/svg/home.svg'
import CocardIcon from '../../assets/svg/app.svg'
import HeartIcon from '../../assets/svg/heart.svg'
import classes from './sidebar.module.scss'

const SideBar = () => {
  const [sidebar, setSidebar] = useState(false)
  const toggleSidebar = () => {
    setSidebar(prev => !prev)
  }

  return (
    <div className={classes.sidebar}>
      <span className="logo">
        <Link href="/">COCARD</Link>
      </span>
      {/* <Arrow className="arrowIcon" /> */}
      <div className="arrowIcon" onClick={toggleSidebar}></div>
      <div className="searchBar">
        <SearchAllForm />
      </div>
      <ul className={classes.sideList}>
        {/* <li>
            <Link to="/">
              <HomeIcon />
              首頁
            </Link>
          </li> */}
        <li>
          <a href="#">
            <CocardIcon />
            <span>社群卡</span>
          </a>
        </li>
        <li>
          <a href="#">
            <HeartIcon />
            <span>收藏</span>
          </a>
        </li>
        <li>
          <a href="https://www.notion.so/Work-Log-491e5e9bdff942cf96ab0e9dfbf86c4e">測試說明: 3/4 上線測試A1</a>
        </li>
      </ul>

      {/* <Search
          className="search"
          placeholder="Search..."
          enterButton
          size="middle"
          // suffix={suffix}
          // onSearch={onSearch}
        /> */}
    </div>
  )
}
export default SideBar
