import React from 'react'
import { RouteComponentProps } from "@reach/router"
import { Card, Typography, Tag, Input, Button, List, Skeleton, Descriptions, Collapse, Divider } from 'antd'


export function Me(props: RouteComponentProps) {
  return (
    <>
      <Descriptions title="Status">
        <Descriptions.Item label="Tasks">1/10</Descriptions.Item>
        <Descriptions.Item label="Credit">298 (+12.2%)</Descriptions.Item>
        <Descriptions.Item label="Lv">1</Descriptions.Item>
        <Descriptions.Item label="Exp">120/2000</Descriptions.Item>
      </Descriptions>

      <h3>My Commits</h3>
      <ul>
        <li><a>[Event-Commit] Ut eu sem integer vitae justo eget magna (Passed)</a></li>
        <li><a>[Event-Commit] Et odio pellentesque diam volutpat commodo sed egestas (Passed)</a></li>
      </ul>
      <a>2 more</a>

      <h3>My Pushed Feeds</h3>
      <ul>
        <li>Ut eu sem integer vitae justo eget magna</li>
        <li>[Event-Commit] Et odio pellentesque diam volutpat commodo sed egestas</li>
      </ul>
      <a>107 more</a>
    </>
  )
}