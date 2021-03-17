import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Row, Col, Layout, Menu, Button, Input } from 'antd'

function Header() {
  return (
    <Layout.Header style={{ zIndex: 1, width: '100%' }}>
      <div style={{ float: 'left', marginRight: 30 }}>
        HOME
        </div>
      <div style={{ float: 'left' }}>
        <Input.Search
          placeholder="ticker or company name"
          onSearch={value => console.log(value)}
          style={{ width: 200 }}
        />
      </div>
      <div style={{ float: 'right' }}>
        Karma 47 | Votes 5/10 |
          <Button type="primary">LOG IN</Button>
        <Button >SIGN UP</Button>
      </div>

      <Menu
        theme="dark"
        mode="horizontal"
        // defaultSelectedKeys={['2']}
        style={{ lineHeight: '64px' }}
      >
        <Menu.Item key="2">nav 2</Menu.Item>
        <Menu.Item key="1">Me</Menu.Item>
      </Menu>
    </Layout.Header>
  )
}

export function PageContainer(props: any) {
  return (
    <Layout>
      <Header />
      {/* <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, maxWidth: 800 }}> */}
      <Layout.Content className="site-layout" style={{ maxWidth: 800 }}>
        {props.children}
      </Layout.Content>
      <Layout.Footer>Footer</Layout.Footer>
    </Layout>
  )
}

interface Props extends RouteComponentProps {
  left: any
  right: any
}


export function Pane(props: Props) {
  return (
    <Row>
      <Col span={17} offset={1}>{props.left}</Col>
      <Col span={5} offset={1}>{props.right}</Col>
    </Row>
  )
}