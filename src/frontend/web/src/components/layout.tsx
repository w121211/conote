import React from 'react'
import { Link, RouteComponentProps } from '@reach/router'
import { Row, Col, Layout, Button, Space, Typography } from 'antd'
import * as QT from '../graphql/query-types'

interface PageContainerProps extends RouteComponentProps {
  isLoggedIn: boolean
  children?: React.ReactNode
}

export function PageContainer({ isLoggedIn, children }: PageContainerProps): JSX.Element {
  return (
    <Layout>
      {/* <Layout.Header style={{ zIndex: 1, width: '100%' }}> */}
      <Layout.Header>
        <Link to="/" style={{ color: 'white' }}>
          HOME
        </Link>

        {/* <div style={{ float: 'left' }}>
          <Input.Search
            placeholder="ticker or company name"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
        </div> */}

        <div style={{ float: 'right' }}>
          <Space direction="horizontal" size="large">
            <Typography.Text style={{ color: 'white' }}>Karma（待開放）</Typography.Text>
            {/* <Typography.Text style={{ color: 'white' }}>
              Votes 5/10
          </Typography.Text> */}
            {isLoggedIn ? null : (
              <Button type="primary" shape="round">
                <Link to="login">LOGIN</Link>
              </Button>
            )}
            {/* <Button shape="round">SIGN UP</Button> */}
          </Space>
        </div>

        {/* <Menu
          theme="dark"
          mode="horizontal"
          // defaultSelectedKeys={['2']}
          style={{ lineHeight: '64px' }}
        >
          <Menu.Item key="2">nav 2</Menu.Item>
          <Menu.Item key="1">Me</Menu.Item>
        </Menu> */}
      </Layout.Header>

      {/* <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, maxWidth: 800 }}> */}
      {/* <Layout.Content className="site-layout" style={{ maxWidth: 800 }}> */}
      <Layout.Content>{children}</Layout.Content>

      <Layout.Footer style={{ textAlign: 'center' }}>
        任何問題、意見交流請至<a href="aaa">連結</a>
      </Layout.Footer>
    </Layout>
  )
}

interface PaneProps extends RouteComponentProps {
  left: React.ReactNode
  right?: React.ReactNode
  leftSpan?: number
}

export function Pane({ left, right, leftSpan = 10 }: PaneProps): JSX.Element {
  if (right) {
    return (
      <Row justify="center">
        <Col span={leftSpan}>{left}</Col>
        <Col span={4} offset={1}>
          {right}
        </Col>
      </Row>
    )
  }
  return (
    <Row justify="center">
      <Col span={leftSpan}>{left}</Col>
    </Row>
  )
}
