import React, { Fragment, useState, useRef, useContext, createContext } from 'react'
import { Layout, Input } from 'antd'
import { Link, Router, RouteComponentProps, Redirect } from '@reach/router'
import { useQuery } from '@apollo/client'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { PageContainer, Pane } from '../components/layout'
import { ProtectedRoute, LoginPage, AutoLogin } from './login'
import { HomePage } from './home-page'
import { SearchAllForm } from '../components/forms'
// import { AuthorPage } from './authorPage'
import { CardPage } from './card-page'
import { CardFormPage } from './card-form-page'
import { GiveandtakeCardPage } from './card-giveandtake'
import { DebugPage } from './debug-page'
import Discuss from './discuss-page'
import '../appLayout/appLayout.less'
import { ReactComponent as HomeIcon } from '../assets/home.svg'
import { ReactComponent as CocardIcon } from '../assets/app.svg'
import { ReactComponent as HeartIcon } from '../assets/heart.svg'
import { ReactComponent as Arrow } from '../assets/arrow.svg'

const { Search } = Input
function NotFoundPage({ path }: RouteComponentProps): JSX.Element {
  return <h1>Page not found</h1>
}
const commentClickHandler = (ref: any) => {
  ref && ref.focus()
}

export function Pages(): JSX.Element | null {
  // 作為entry-point，初始化apollo-cache
  useQuery<QT.myAnchorLikes>(queries.MY_ANCHOR_LIKES)
  useQuery<QT.myCommentLikes>(queries.MY_COMMENT_LIKES)
  useQuery<QT.myReplyLikes>(queries.MY_REPLY_LIKES)
  useQuery<QT.myVotes>(queries.MY_VOTES)

  const [sidebar, setSidebar] = useState(false)
  const toggleSidebar = () => {
    setSidebar(prev => !prev)
  }
  const { data, loading } = useQuery<QT.me>(queries.ME)
  const isLoggedIn = !!data?.me

  if (loading) return null

  return (
    <Layout className="my-app">
      <AutoLogin />
      {/* <div>
        <Link to="/">HOME</Link>&nbsp;|&nbsp;
        <a href="https://www.notion.so/Work-Log-491e5e9bdff942cf96ab0e9dfbf86c4e">測試說明: 3/4 上線測試A1</a>
      </div> */}

      {/* {!isLoggedIn && <Redirect from="" to="/login" noThrow />} */}
      <div className={'sidebar' + (sidebar ? '' : ' collapse')}>
        <span className="logo">
          <Link to="/">COCARD</Link>
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
      <div className="mainWrapper">
        {/* <div className="searchWrapper"> */}
        {/* </div> */}
        {/* </div> */}
        <div className="pageDiscuss">
          <div className="routerPage">
            <Router primary={false} component={Fragment}>
              <HomePage path="/" />
              <CardPage path="card" />

              <CardFormPage path="form" />

              <GiveandtakeCardPage path="give" me={data?.me} />

              {/* <TickerPage path="ticker/:symbol" /> */}
              {/* <TickerFormPage path="ticker/:symbol/form" /> */}
              {/* <TopicPage path="topic/:title" /> */}
              {/* <AuthorPage path="author/:symbol" /> */}

              <DebugPage path="debug" me={data?.me} />

              <PageContainer path="/" isLoggedIn={isLoggedIn}>
                {/* <ProtectedRoute as={Feed} isLoggedIn={isLoggedIn} default /> */}
                {/* <Pane left={<Board me={data?.me} />} right={<BoardRightPane />} default /> */}
                <LoginPage path="login" />
                <NotFoundPage default />
              </PageContainer>
            </Router>
          </div>
          <div className="discuss">
            <Discuss />
          </div>
        </div>
      </div>
    </Layout>
  )
}
