import React, { useState } from 'react'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Form, Button, Card, Descriptions, Radio, Space, List, Typography, Result, Divider, Row, Col, Input } from 'antd'
import { LikeOutlined } from '@ant-design/icons'
import { Pane } from '../../components/layout'
import { LineChart, BarChart } from '../../components/charts'
import blur from '../assets/download.jpeg'


const demoRight =
  <Space direction="vertical" style={{ width: "100%" }}>
    <div />
    <Card>
      <List
        size="small"
        // header={<b>關聯</b>}
        dataSource={["#COVID-19#", "#英國脫歐#", "$AAAA", "$BBBB", "#電動車", "#電池"]}
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

interface Props extends RouteComponentProps {
  id?: any
}

function Tag() {
  const [showChoiceForm, setShowChoiceForm] = useState<boolean>(false)
  const [showComments, setShowComments] = useState<boolean>(false)

  return (
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography>
        <Typography.Title level={3}>
          <Space size="large">
            <i>#博弈</i>
            <span>[審核中]</span>
          </Space>
        </Typography.Title>
        <Typography.Paragraph>
          （無法有tickers的tag？ eg：#反傾銷 #美國 #熱榜）<br />
          個股：$AAA $BBB $CCC [看好] [看壞] [比較] [新增] <br />
          鄰近：#觀光 #飯店 [比較] [新增]<br />
          組合（＋）：#線上 # [新增]<br />

          事件（近3個月）：#COVID-19# <br />
          判斷：看多、看空、題目不適合<br />

          [數據統計/chart] 話題熱度（週變化-2.3%）、類股價格變動（+3.1%）、<br />

          [新增欄位] - [機會] [風險] <br />

        </Typography.Paragraph>
      </Typography>

      <Card>
        個股：#博弈＋$AAA 相關新聞？
      </Card>

      <Card>
        個股比較：熱度高的股票？
      </Card>

      <Card>
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
      </Card>

      <Card>
        <Typography.Title level={4}>審核</Typography.Title>
        <Typography.Paragraph>
          <Typography.Text>同意讓 #賭博 成為正式的標籤嗎？</Typography.Text>
        </Typography.Paragraph>
        <Typography.Paragraph>
          <Space>
            <Button size="small" shape="round" onClick={() => { setShowComments(!showComments) }}>同意</Button>
            <Button size="small" shape="round">不同意</Button>
            <Button size="small" shape="round" type="link">舉報</Button>
            {/* <Button size="small" type="link" onClick={() => { setShowChoiceForm(!showChoiceForm) }}>新增</Button> */}
          </Space>
        </Typography.Paragraph>
        <Typography.Paragraph>
          評審原則[source：社群規則v0.1]：<br />
          1. 標籤（#賭博）可以有類股<br />
          2. 當這個概念可用數個標籤組合而成時，則不必創此標籤，改用（#賭博+#線上）<br />
        </Typography.Paragraph>

        <Divider />

        {
          showComments &&
          <>
            <List
              // bordered
              size="small"
              dataSource={[
                "產品有競爭力產品有競爭力產品有競爭力產品有競爭力產品有競爭力",
                "產品有競爭力產品有競爭力產品有競爭力產品有競爭力產品有競爭力",
              ]}
              renderItem={e => (
                <List.Item>
                  {/* <Button size="small" shape="round">產品有競爭力</Button><br /> */}
                [同意]<br />
                  {e}<br />
                [up] [down]
                </List.Item>
              )}
            />
            <Card size="small">
              <Form size="small">
                <Form.Item label="選項" required>
                  <Button size="small" shape="round" type="primary">同意</Button>
                </Form.Item>
                <Form.Item label="說明">
                  <Input.TextArea autoSize={{ minRows: 1 }} />
                </Form.Item>
                <Form.Item>
                  <Button>送出</Button>
                </Form.Item>
              </Form>
            </Card>
          </>
        }

      </Card>

      <Card>
        <Typography.Title level={4}>類股</Typography.Title>
        <Typography.Paragraph>
          <Button size="small" shape="round" type="primary">$AAA</Button>
          <Button size="small" type="text">$BBB</Button>
          <Button size="small" type="text">$CCC</Button>
          <Button size="small" type="link">新增</Button>
        </Typography.Paragraph>
        <Card size="small">
          <Form size="small">
            <Form.Item label="選項" required>
              <Button size="small" shape="round" type="primary">同意</Button>
            </Form.Item>
            <Form.Item label="說明">
              <Input.TextArea autoSize={{ minRows: 1 }} />
            </Form.Item>
            <Form.Item>
              <Button>送出</Button>
            </Form.Item>
          </Form>
        </Card>
      </Card>

      <Card>
        <Typography.Title level={4}>感受</Typography.Title>
        <Typography.Paragraph>
          <Typography.Text>對於此類別的</Typography.Text>
        </Typography.Paragraph>
        <Button size="small" type="dashed">看空</Button>
        <Button size="small" type="text">看多</Button>
      </Card>

      <Card>
        <Typography.Title level={4}>比較類股</Typography.Title>
        $AAA $BBB $CCC [候選：$DDD $EEE (新增)] <br />
        [chart] [經營數據] [與大盤相比] [與其他類股相比] [加入類股平均指數]
        [3個月] [半年] [1年]
        <Button size="small" type="dashed">看空</Button>
        <Button size="small" type="text">看多</Button>
      </Card>

      <Card>
        <Typography.Title level={4}>群組間比較</Typography.Title>
        #博弈 #觀光 #網購 [候選：#郵輪 #航空 (新增)] <br />
        [chart] [經營數據] [與大盤相比] [與其他類股相比] [加入類股平均指數] [3個月] [半年] [1年]
        <Button size="small" type="dashed">看空</Button>
        <Button size="small" type="text">看多</Button>
      </Card>

      <Typography.Title level={4}>擂台</Typography.Title>
      <Card>which 博弈類股可以投資哪隻？</Card>
      <Card>事件 疫情會影響博弈嗎？ #COVID-19# </Card>
      <Card>現在是買入博弈股的好時機嗎？</Card>

      <div>
        發起討論
        <Button>博弈類股可以投資哪隻？</Button>
        <Button>疫情會影響博弈嗎？</Button>
      </div>

    </Space>
  )
}

export const TagPage: React.FC<Props> = ({ id }) => {
  return <Pane left={<Tag />} />
}