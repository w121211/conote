import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Modal, Alert, Typography, Tag, Layout, Menu, Button, List, Skeleton, Descriptions, Collapse, Divider } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'

export function TrackingEvents(props: RouteComponentProps) {
  return (
    <>
      <Typography.Title>Tracking Events</Typography.Title>
      <List
        // bordered
        // footer={<div>Footer</div>}
        // className="demo-loadmore-list"
        // loading={initLoading}
        loading={false}
        itemLayout="vertical"
        dataSource={["aaa", "bbb", "ccc"]}
        renderItem={x => (
          <List.Item>
            <Typography.Paragraph>
              <b>Short-event-name</b> [+2.38%]
            <ul>
                <li>[News] Dolor purus non enim praesent elementum facilisis leo</li>
                <li>[Poll] Metus dictum at tempor commodo ullamcorper a.</li>
              </ul>
            </Typography.Paragraph>
            <Tag>
              <a>$JKL +8.18%</a>
            </Tag>
            <Tag>
              <a>$OPQ +3.28%</a>
            </Tag>
            <Tag>
              <a>related-event-name</a>
            </Tag>
            <a>Remove</a>
          </List.Item>
        )}
      />
      <div>3 slots avaliable, total 10 slots</div>
    </>
  )
}