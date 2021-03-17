import React, { useState, useEffect } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Card, Layout, Modal, Typography, Form, Button, Input } from 'antd'
import { FormInstance } from 'antd/lib/form'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
import { Pane } from '../../components/layout'
import { SymbolAutoComplete } from '../../components/symbolHint'
// import { PollForm } from '../components/pollForm'

interface Props extends RouteComponentProps { }

export const CreatePollPage: React.FC<Props> = () => {
  return (
    <Layout>
      <Layout.Content>
        {/* <Modal visible>
          <Typography.Paragraph>
            新增標籤原則[source：社群規則v0.1]：<br />
          1. 標籤（#賭博）可以有類股<br />
          2. 當這個概念可用數個標籤組合而成時，則不必創此標籤，改用（#賭博+#線上）<br />
          3. ...<br />
          </Typography.Paragraph>
          <Form>
            <Form.Item label="標籤">
              <Input placeholder="需要以#開頭，不能包含特殊標點，範例：#高鐵 #觀光 #航空" />
            建議：#AAA #BBB
          </Form.Item>
            <Form.Item label="理由">
              <Input />
            </Form.Item>
            <Button>搜尋類似標籤</Button>
            <Button disabled>新增標籤</Button>
          </Form>
        </Modal> */}

        <br />
        <Pane left={
          <Card>
            {/* <PollForm /> */}
          </Card>
        } />
      </Layout.Content>
      <Layout.Footer />
    </Layout>
  )
}