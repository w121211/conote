import React, { useState } from 'react';
import { RouteComponentProps, Link } from '@reach/router';
import { useQuery, useMutation } from '@apollo/client';
import { Button, Card, Space, List } from 'antd'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
// import { PostList } from '../components/postList'
import { Pane } from '../../components/layout'
import { BarChart, CandleChart } from '../../components/charts'

function TrendingList() {
  const [showList, setShowList] = useState<boolean>(false)
  if (!showList)
    return <Button type="primary" onClick={() => { setShowList(true) }}>trending</Button>

  return (
    <Card>
      <h3>trending</h3>
      <List
        size="small"
        bordered
        dataSource={[
          "#1. data",
          "#2. data",
          "#3. data"
        ]}
        renderItem={item => (
          <List.Item>
            {item}
          </List.Item>
        )}
      />
    </Card>
  )
}

interface BoardProps {
  me?: QT.me_me
}

const Board: React.FC<BoardProps> = ({ me }) => {
  return (
    <>
      <BarChart />
      <CandleChart />

      <Space direction="vertical" style={{ width: "100%" }}>
        {/* <Space direction="horizontal" size="large">
          <span><Badge color="blue" dot>#IPO</Badge></span>
          <span><Badge color="blue" dot>#熱門</Badge></span>
          <span>#預測</span>
          <span>#問題</span>
          <span>@roboCNBC</span>
          <a>...more</a>
        </Space> */}

        {/* <div style={{ textAlign: "center" }}>
                <TrendingList />
              </div> */}

        <div />
        {/* <PostList me={me} /> */}
      </Space>
    </>
  )
}

interface BoardPageProps extends RouteComponentProps, BoardProps { }

export const BoardPage: React.FC<BoardPageProps> = ({ me }) => {
  return (
    <Pane
      left={
        <Board me={me} />
      }
      right={
        <Space direction="vertical" style={{ width: "100%" }}>
          <div />
          <Button type="primary" size="large">
            <Link to="/submit">Post</Link>
          </Button>
        </Space>
      }
    />
  )
}

