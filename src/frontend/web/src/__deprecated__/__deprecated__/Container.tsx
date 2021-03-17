import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Modal, Comment, Input, Card, Divider, Row, Col, Typography, Tag, Layout, Menu, Button, List, Skeleton, Descriptions, Collapse } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'

function Header() {
  return (
    <Layout.Header style={{ width: '100%' }}>
      <Row justify="center">
        <Col span={13}>
          <p>some test</p>
        </Col>
      </Row>
      {/* <div style={{ float: 'left', marginRight: 30 }}>
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
      </div> */}

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
  )
}

export function PageContainer(props: any) {
  // return <>{props.children}</>
  return (
    <Layout>
      {/* <Header /> */}
      <Layout.Content>
        {/* <Layout.Content style={{ margin: '30px auto' }}> */}
        {/* <Layout.Content style={{ margin: 'auto auto' }}> */}
        {props.children}
      </Layout.Content>
    </Layout>
  )
}

interface Props extends RouteComponentProps {
  left: any
  right: any
}


export function Pane(props: Props) {
  return (
    <Row justify="center">
      <Col span={9}>{props.left}</Col>
      <Col span={4}>{props.right}</Col>
    </Row>
  )
}