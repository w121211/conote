import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Badge, Button, Card, Descriptions, Radio, Space, List, Typography, Result, Divider } from 'antd'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
import { Pane } from '../../components/layout'
import { LineChart } from '../../components/charts'

interface EventProps {
  name: string
}

const _eventContent = {
  status: "ALIVE",  // ALIVE, END
  cat: "", // NEWS, COMPANY, SIGNAL
  start: Date.now(),
  end: null,
  // title: "Some event name?",
  tags: ["#tag1", "tag2"],
  events: ["a-event", "b-event"],
  shotedAt: Date.now(),
}

const Event: React.FC<EventProps> = ({ name }) => {
  // const header = <h1>{getSymbol.data?.symbol.name}</h1>
  // const status = <p>{getSymbol.data?.symbol.status}</p>
  // const chart = null

  const morePosts = null
  const commits = null
  const createCommit = null
  const parentEvent = null
  const tickers = ["$$風電"]
  const tags = []
  const synonyms = []  // resolve


  const demo = (
    <>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Typography>
          <Typography.Title level={2}>
            <Space size="large">
              <i>#航空運輸</i>
              {/* <i>{getSymbol.data.symbol.name}</i> */}
              <Button type="primary">追蹤</Button>
            </Space>
          </Typography.Title>

          <Typography.Paragraph>
            公司：西南航空、新加坡航空（[]up []down）、漢莎航空、國泰航空、全日空、維珍航空、更多...<br />
            相關行業：#飛機製造、#觀光、＃<br />
            相關事件：#全球境管#（[]up []down）、#COVID-19#、新增（＿＿＿）
          </Typography.Paragraph>
        </Typography>

        <div>
          新加坡航空、漢莎航空、國泰航空、全日空、維珍航空（最多5家）<br />
          [[chart]] [[比較table]] [[社群]]
        </div>

        {/* <Divider>Focus</Divider> */}

        <div>
          <Button type="text"><b>熱門</b></Button>
          <Button type="link">最新</Button>
        </div>

        <Card>
          航空股推薦哪家？
        </Card>

        <Card>
          維珍澳洲航空瀕臨破產
        </Card>

        <Card>
          航空業何時復甦？ [up] [down] <br />

          <Card>一則回覆</Card>

          [up]此問題看其他回答<br />

        </Card>


      </Space>
    </>
  )

  const demoRight =
    <Space direction="vertical" style={{ width: "100%" }}>
      <div />
      <Card>
        <List
          size="small"
          // header={<b>關聯</b>}
          dataSource={["#COVID-19#", "#聯準會", "#歐洲央行", "#日本央行", "#外匯", "$^USD", "$^GOLD"]}
          renderItem={e => <List.Item>{e}</List.Item>}
        />
      </Card>
      {/* <Card>
        <List
          size="small"
          // header={<b>關聯</b>}
          dataSource={["預測$XXXX未來走勢", "$XXXX還會持續上漲？", "該買哪個好？$XXXX, $XXXY, $XXXXZ?"]}
          renderItem={e => <List.Item>{e}</List.Item>}
        />
      </Card> */}
    </Space>

  return (
    <Pane left={demo} right={demoRight} />
  )
}


interface Props extends RouteComponentProps {
  name?: string
}

export const StackPage: React.FC<Props> = ({ name = "#event#" }) => {
  // if (name === undefined) return <Event name="404" />
  return <Event name={name} />
}