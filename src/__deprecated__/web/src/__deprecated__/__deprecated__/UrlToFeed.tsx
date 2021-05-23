import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Radio, Divider, Form, Input, Button, Checkbox, Layout, Typography, Tag } from 'antd'

export function FeedCreate() {
  const radioStyle = {
    display: 'block',
    // height: '30px',
    // lineHeight: '30px',
  }
  return (
    <Layout>
      <Layout.Content className="site-layout" style={{ padding: '0 50px', marginTop: 64, maxWidth: 800 }}>
        <Typography.Title>Input URL to create a feed</Typography.Title>
        <Form
          name="basic"
          initialValues={{ remember: true }}
        // onFinish={onFinish}
        // onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="URL"
            name="url"
            rules={[{ message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
          // wrapperCol={{ offset: 4, span: 16 }}
          >
            <Button type="primary" htmlType="submit">FETCH</Button>
          </Form.Item>
        </Form>

        <Divider>Fetching URL and analyzing web content ...</Divider>

        {/* <Typography.Paragraph></Typography.Paragraph> */}

        <Form name="feed" initialValues={{ remember: true }}>
          <Form.Item label="Title" name="title">
            <Input defaultValue="Cras adipiscing enim eu turpis egestas pretium aenean" />
          </Form.Item>
          <Form.Item label="Tags" name="tags">
            <Input defaultValue="#abc, #def" />
            {/* <Input placeholder="use common to seperate, eg #abc, #def" /> */}
          </Form.Item>
          <Form.Item label="Event (auto-detected)" name="event">
            <Input defaultValue="!event-abc" disabled={true} />
            {/* <Input placeholder="use common to seperate, eg #abc, #def" /> */}
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">SUBMIT</Button>
          </Form.Item>
        </Form>

        <Button>Create New Event</Button>

        <Divider>Create New Event [需觸發]</Divider>

        <Form name="event" initialValues={{ remember: true }}>
          <Form.Item label="Title" name="title">
            <Input defaultValue="Cras adipiscing enim eu turpis egestas pretium aenean" />
          </Form.Item>
          <Form.Item label="Short name" name="slug">
            <Input defaultValue="!this-is-a-event-name" disabled={true} />
            {/* <Input placeholder="use common to seperate, eg #abc, #def" /> */}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">SUBMIT</Button>
          </Form.Item>
        </Form>

        {/* <Divider>Select related event or create a new one</Divider> */}
        {/* <Radio.Group onChange={e => { }}>
          <Radio value={1}>
            event-abc
        </Radio>
          <Radio value={2}>
            event-def
        </Radio>
          <Radio value={3}>
            event-ghi
        </Radio>
        </Radio.Group> */}


      </Layout.Content>
      <Layout.Footer style={{ textAlign: 'center' }}>Footer</Layout.Footer>
    </Layout >
  )
}