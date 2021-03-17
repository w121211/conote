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
              <i>@open-user</i>
              {/* <i>{getSymbol.data.symbol.name}</i> */}
            </Space>
          </Typography.Title>
          <Typography.Paragraph>
            免責聲明：社群建立<br />
            連結：facebookId<br />
            共有23則，社群連結33件predicates，平均預測值12%<br />
            主要關鍵字：#美股, #科技<br />
            Rank: B<br />
            [詳細] [連結此帳號] [與本站反應]
          </Typography.Paragraph>
        </Typography>

        <div>
          <Button type="text"><b>熱門</b></Button>
          <Button type="link">最新</Button>
        </div>

        <Card>
          @open-user：最前面的幾個字.... [link]<br />
          <div style={{ textAlign: "right" }}>@open-user 12:31 [up] [down] [comments] [predicates]</div>
            ----predicates----- [新增] <br />
            1. [OOOOOOOOOO?] (選項1) 選項2 （與社群預期相符）<br />
            建立：@anonymous（非@open-user）
            依據：講的某段話某個文字講的某段話某個文字講的某段話某個文字講的某段話某個文字<br />
            remark: 可以加幾個註解，給予一點彈性<br />
            2. [OOOOOOOOOO?] (選項1) 選項2  <br />
            [未通過社群審核的預測]
        </Card>

        <Card>
          @open-user：最前面的幾個字.... [link] [predicates]<br />
          <div style={{ textAlign: "right" }}>@open-user 12:31 [up] [down] [comments] [predicates]</div>
        </Card>

        <div>[更多]</div>
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

export const CreditPage: React.FC<Props> = ({ name = "#event#" }) => {
  // if (name === undefined) return <Event name="404" />
  return <Event name={name} />
}