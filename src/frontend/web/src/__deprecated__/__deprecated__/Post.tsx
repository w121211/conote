import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Tag, Button, Divider } from 'antd'
import { UpOutlined, DownOutlined } from '@ant-design/icons'


export function Post(props: RouteComponentProps) {
  return (
    <>
      <h1>Leo vel fringilla est ullamcorper eget nulla facilisi</h1>
      <p>Type: Link / Post / Poll</p>
      <p>
        <Tag>event-aaa-bbb</Tag>
        <Tag>$ABC</Tag>
        <Tag>$OPQ</Tag>
      </p>
      <p>In ante metus dictum at tempor commodo ullamcorper a lacus. Vel fringilla est ullamcorper eget. Nulla facilisi morbi tempus iaculis. Bibendum at varius vel pharetra vel. Iaculis urna id volutpat lacus laoreet. Vestibulum sed arcu non odio euismod lacinia at quis risus. Sit amet consectetur adipiscing elit duis tristique sollicitudin nibh. Egestas integer eget aliquet nibh praesent tristique. Tincidunt dui ut ornare lectus sit amet est. Enim praesent elementum facilisis leo vel fringilla est ullamcorper eget.</p>
      <Button shape="circle" icon={<UpOutlined />} />
      <Button shape="circle" icon={<DownOutlined />} />

      <Divider />
      <ul>
        <li>#1 Dictum non consectetur a erat nam at lectus urna.<br /><a>upvote</a></li>
        <li>#2 Dolor purus non enim praesent elementum facilisis leo.<br /><a>upvote</a></li>
      </ul>
      <a>23 more</a>
    </>
  )
}