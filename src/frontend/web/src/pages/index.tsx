import React, { Fragment } from 'react'
import { Layout } from 'antd'
import { Link, Router, RouteComponentProps, Redirect } from '@reach/router'
import { useQuery } from '@apollo/client'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { PageContainer, Pane } from '../components/layout'
import { ProtectedRoute, LoginPage, AutoLogin } from './login'
import { HomePage } from './home-page'
// import { AuthorPage } from './authorPage'
import { CardPage } from './card-page'
import { CardFormPage } from './card-form-page'
import { GiveandtakeCardPage } from './card-giveandtake'
import '../appLayout/appLayout.less'

function NotFoundPage({ path }: RouteComponentProps): JSX.Element {
  return <h1>Page not found</h1>
}

export function Pages(): JSX.Element | null {
  // 作為entry-point，初始化apollo-cache
  useQuery<QT.myAnchorLikes>(queries.MY_ANCHOR_LIKES)
  useQuery<QT.myCommentLikes>(queries.MY_COMMENT_LIKES)
  useQuery<QT.myReplyLikes>(queries.MY_REPLY_LIKES)
  useQuery<QT.myVotes>(queries.MY_VOTES)

  const { data, loading } = useQuery<QT.me>(queries.ME)
  const isLoggedIn = !!data?.me

  if (loading) return null

  return (
    <Layout className="site-layout" style={{ position: 'relative' }}>
      <AutoLogin />
      <div>
        <Link to="/">HOME</Link>&nbsp;|&nbsp;
        <a href="https://www.notion.so/Work-Log-491e5e9bdff942cf96ab0e9dfbf86c4e">測試說明: 3/4 上線測試A1</a>
      </div>

      {/* {!isLoggedIn && <Redirect from="" to="/login" noThrow />} */}

      <Router primary={false} component={Fragment}>
        <HomePage path="/" />

        <CardPage path="card" />
        <CardFormPage path="form" />

        <GiveandtakeCardPage path="give" me={data?.me} />

        {/* <TickerPage path="ticker/:symbol" /> */}
        {/* <TickerFormPage path="ticker/:symbol/form" /> */}
        {/* <TopicPage path="topic/:title" /> */}
        {/* <AuthorPage path="author/:symbol" /> */}

        <PageContainer path="/" isLoggedIn={isLoggedIn}>
          {/* <ProtectedRoute as={Feed} isLoggedIn={isLoggedIn} default /> */}
          {/* <Pane left={<Board me={data?.me} />} right={<BoardRightPane />} default /> */}
          <LoginPage path="login" />
          <NotFoundPage default />
        </PageContainer>
      </Router>
    </Layout>
  )
}
