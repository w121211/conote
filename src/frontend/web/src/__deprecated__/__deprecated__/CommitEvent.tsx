import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Radio, Divider, Form, Input, Button, Checkbox, Layout, Typography, Tag } from 'antd'

export function CommitEvent(props: RouteComponentProps) {
  const radioStyle = {
    display: 'block',
    // height: '30px',
    // lineHeight: '30px',
  }
  return (
    <>
      <Typography.Title>Event</Typography.Title>
      <Form name="event">
        <Form.Item label="Title" name="title">
          <Input defaultValue="Cras adipiscing enim eu turpis egestas pretium aenean" />
        </Form.Item>
        <Form.Item label="Short name" name="slug">
          <Input defaultValue="!this-is-a-event-name" />
          {/* <Input placeholder="use common to seperate, eg #abc, #def" /> */}
        </Form.Item>
        <Form.Item label="Tags" name="slug">
          <Input defaultValue="#aaa, #bbb, #ccc" />
        </Form.Item>
        <Form.Item label="Parent" name="slug">
          <Input defaultValue="!this-is-a-event-name" />
        </Form.Item>
        {/* <Form.Item label="Siblings" name="slug">
          <Input defaultValue="!event-a" />
        </Form.Item> */}
      </Form>
    </>
  )
}