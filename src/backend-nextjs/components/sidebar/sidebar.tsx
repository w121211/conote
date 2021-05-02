import React, { useState } from 'react'
import Link from 'next/link'
import { SearchAllForm } from '../search-all-form'
import { ReactComponent as HomeIcon } from '../../assets/icon/home.svg'
import { ReactComponent as CocardIcon } from '../../assets/icon/app.svg'
import { ReactComponent as HeartIcon } from '../../assets/icon/heart.svg'

const SideBar = () => {
  const [sidebar, setSidebar] = useState(false)
  const toggleSidebar = () => {
    setSidebar(prev => !prev)
  }

  return (
    <div className={'sidebar' + (sidebar ? '' : ' collapse')}>
      <span className="logo">
        <Link href="/">COCARD</Link>
      </span>
      {/* <Arrow className="arrowIcon" /> */}
      <div className="arrowIcon" onClick={toggleSidebar}></div>
      <div className="searchBar">
        <SearchAllForm />
      </div>
      <ul className="sideList">
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
