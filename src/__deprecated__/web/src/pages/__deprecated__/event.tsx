import React from 'react'
import { RouteComponentProps } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Badge, Button, Card, Radio, Space, List, Typography, Result, Divider } from 'antd'
import * as queries from '../../store/queries'
import * as QT from '../../store/queryTypes'
import { Pane } from '../../components/layout'
import { LineChart } from '../../components/charts'

const demo0 = (
  <>
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography>
        <Typography.Title level={2}>
          <Space size="large">
            <i>#原油大跌# #PS5發表# #廣明反托拉斯# #COVID-19# #2020美國總統大選# </i>
            {/* <i>{getSymbol.data.symbol.name}</i> */}
            <Button type="primary">追蹤</Button>
          </Space>
        </Typography.Title>

        <Typography.Paragraph>
          屬性：#原油 #遊戲 #反托拉斯<br />
          {/* 影響：觀光、航運、<br /> */}
          機會：$A3類、$B2類、$AAA、PS5供應鏈、生技、COVID-19疫苗概念股、口罩、醫療用品、<br />
          世界線：和解、石油繼續下跌、V型反彈、U型反彈、勾型緩步回升、PS5拉貨備貨<br />
          關注重點：PS5價格、二次爆發、<br />
          關聯事件：<br />
          [分析（3）] [] [新擂台]<br />

          觀光類股可以進場了嗎？#拐點 ：通過投票變化可以看出進場時機<br />
          事件與子事件<br />
          歷史事件<br />

          [新增欄位]<br />
        </Typography.Paragraph>

      </Typography>

      <Typography.Paragraph>
        比較
      </Typography.Paragraph>

      <Typography.Paragraph>
        QA
      </Typography.Paragraph>

      <Card>
        #原油大跌#將影響哪些金融資產？ [$原油類股] [$運輸類股] [$EXON]
        -------------
        [$原油類股] 因為.........
        -------------
        [$運輸類股] 因為.........
        -------------
        [新增]
      </Card>

      <Card>
        $原油類股
        ----------
        事件：#原油大跌#
        板塊：產油、煉油、儲油
        相關類股：運輸
        -----------
        比較（chart、table）板塊間、單獨板塊、板塊與個股：（目的）選適合投資的股票、每人所在意的數據不同、各種價格間的相互關係（正向、反向、因果、無關係）、控制比較對象在一個合理的範圍（不過多過少）、比較對象可以分享（？）、比較對象間的文字說明、比較圖/表格可以嵌入文字中、
        ----------
        產油類中哪個股票值得投資？
      </Card>

      <Card>
        #原油大跌# x $原油類股
        ----------
        事件：#原油大跌#
      </Card>

      {/* <LineChart /> */}

      {/* <Divider>Focus</Divider> */}

      <div>
        <Button type="link">最新</Button>
        <Button type="text"><b>熱門</b></Button>
      </div>

      <Card>
        <Typography.Paragraph>
          <Space>
            <Typography.Text strong>全球大放錢，未來該如何投資</Typography.Text>
            <i><Typography.Text type="secondary">#預測</Typography.Text></i>
            <i><Typography.Text type="secondary">#想法</Typography.Text></i>
          </Space>
        </Typography.Paragraph>

        <Typography.Paragraph>
          預測: 1年期間走勢, 2020/1/1-2021/1/1
          <ul>
            <li>未來情勢判斷：主要國際貨幣利率持續低靡，即便疫情重創經濟，但在資金行情下會持續推高金融商品價格，例如股市、房市<Button type="link">[社群判定]</Button></li>
            <li>股市多頭，漲幅將超過債市、匯市<Button type="link">[robo判定]</Button></li>
            <li>美股漲幅優於歐股、日股<Button type="link">[robo判定]</Button>
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>反對</Radio>
                <Button size="small" shape="round">投票</Button>
              </Radio.Group>
            </li>
          </ul>
        </Typography.Paragraph>

        <Typography.Paragraph>
          總之這裏就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Space>
            <Typography.Text strong>全球大放錢，未來該如何投資</Typography.Text>
            <i><Typography.Text type="secondary">#預測</Typography.Text></i>
            <i><Typography.Text type="secondary">#想法</Typography.Text></i>
          </Space>
        </Typography.Paragraph>

        <Typography.Paragraph>
          預期: 半年期，電動車類股
          <ul>
            <li>漲幅優於電動車綜合：$AAA、$BBB<Button type="link">[社群判定]</Button></li>
            <li>哪個<Button type="link">[robo判定]</Button>
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>反對</Radio>
                <Button size="small" shape="round">投票</Button>
              </Radio.Group>
            </li>
          </ul>
        </Typography.Paragraph>

        <Typography.Paragraph>
          總之這裏就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，
        </Typography.Paragraph>
      </Card>



      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>$XXXX進場點</Typography.Text><br />
          社群： Buy: 123.45 Sell: 146.78<br />
          機器：Buy: 123.45 Sell: 146.78
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>$XXXX還會持續上漲？</Typography.Text><br />
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>該買哪個好？$XXXX, $XXXY, $XXXXZ?</Typography.Text><br />
        </Typography.Paragraph>
      </Card>

    </Space>
  </>
)


const demo1 = (
  <>
    <Space direction="vertical" style={{ width: "100%" }}>
      <Typography>
        <Typography.Title level={2}>
          <Space size="large">
            <i>#QE-2020#</i>
            {/* <i>{getSymbol.data.symbol.name}</i> */}
            <Button type="primary">追蹤</Button>
          </Space>
        </Typography.Title>
        <Typography.Paragraph>
          屬性：#原油 #遊戲 #反托拉斯
          影響：觀光、航運、
          機會：$A3類、$B2類、$AAA、PS5供應鏈、生技、COVID-19疫苗概念股、口罩、醫療用品、
          可能發展：和解、石油繼續下跌、V型反彈、U型反彈、勾型緩步回升、PS5拉貨備貨
          關注重點：PS5價格、二次爆發、
          關聯事件：
          [分析（3）] [] [新擂台]

          觀光類股可以進場了嗎？#拐點 ：通過投票變化可以看出進場時機
          事件與子事件
        </Typography.Paragraph>
      </Typography>

      {/* <LineChart /> */}

      {/* <Divider>Focus</Divider> */}

      <div>
        <Button type="text"><b>熱門</b></Button>
        <Button type="link">最新</Button>
      </div>

      <Card>
        <Typography.Paragraph>
          <Space>
            <Typography.Text strong>全球大放錢，未來該如何投資</Typography.Text>
            <i><Typography.Text type="secondary">#預測</Typography.Text></i>
            <i><Typography.Text type="secondary">#想法</Typography.Text></i>
          </Space>
        </Typography.Paragraph>

        <Typography.Paragraph>
          預測: 1年期間走勢, 2020/1/1-2021/1/1
          <ul>
            <li>未來情勢判斷：主要國際貨幣利率持續低靡，即便疫情重創經濟，但在資金行情下會持續推高金融商品價格，例如股市、房市<Button type="link">[社群判定]</Button></li>
            <li>股市多頭，漲幅將超過債市、匯市<Button type="link">[robo判定]</Button></li>
            <li>美股漲幅優於歐股、日股<Button type="link">[robo判定]</Button>
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>反對</Radio>
                <Button size="small" shape="round">投票</Button>
              </Radio.Group>
            </li>
          </ul>
        </Typography.Paragraph>

        <Typography.Paragraph>
          總之這裏就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Space>
            <Typography.Text strong>全球大放錢，未來該如何投資</Typography.Text>
            <i><Typography.Text type="secondary">#預測</Typography.Text></i>
            <i><Typography.Text type="secondary">#想法</Typography.Text></i>
          </Space>
        </Typography.Paragraph>

        <Typography.Paragraph>
          預期: 半年期，電動車類股
          <ul>
            <li>漲幅優於電動車綜合：$AAA、$BBB<Button type="link">[社群判定]</Button></li>
            <li>哪個<Button type="link">[robo判定]</Button>
              <Radio.Group>
                <Radio value={1}>同意</Radio>
                <Radio value={2}>反對</Radio>
                <Button size="small" shape="round">投票</Button>
              </Radio.Group>
            </li>
          </ul>
        </Typography.Paragraph>

        <Typography.Paragraph>
          總之這裏就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，總之就是論述上面的判斷，
        </Typography.Paragraph>
      </Card>



      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>$XXXX進場點</Typography.Text><br />
          社群： Buy: 123.45 Sell: 146.78<br />
          機器：Buy: 123.45 Sell: 146.78
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>$XXXX還會持續上漲？</Typography.Text><br />
        </Typography.Paragraph>
      </Card>

      <Card>
        <Typography.Paragraph>
          <Typography.Text strong>該買哪個好？$XXXX, $XXXY, $XXXXZ?</Typography.Text><br />
        </Typography.Paragraph>
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


interface EventProps {
  name: string
}

const Event: React.FC<EventProps> = ({ name }) => {
  return (
    <Pane left={demo0} right={demoRight} />
  )
}


interface Props extends RouteComponentProps {
  name?: string
}

export const EventPage: React.FC<Props> = ({ name = "#event#" }) => {
  // if (name === undefined) return <Event name="404" />
  return <Event name={name} />
}