import React, { Fragment, useState } from 'react'
import { Router } from '@reach/router'
import { Card, Layout, Input, Radio } from 'antd'

import '../appLayout/appLayout.less'
import BlockMetaCss from '../components/blockMeta/blockMeta.module.scss'
import Tag from '../components/tag/tag'
import ProsCons from '../components/prosCons/prosCons'
import Anchor from '../components/anchor/tickerAnchor'
import BlockCss from '../components/block/block.module.scss'
// import Radio from '../components/radios/radios'
import CommenTemplate from '../components/commentTemplate/commentTemplate'
import MyTextArea from '../components/myTextArea/myTextArea'
import CssCommentList from '../components/commentList/commentList'
import { LineChart } from '../components/charts'
import { SomeTable } from '../components/tables'
import CommentListSmall from '../components/commentListSmall/commentListSmall';
import Modal from '../components/modal/modal';

const { Header, Sider, Content } = Layout

function CssBlockCard({ title, children }: { title: string, children: React.ReactNode }) {
  // const [isloadding, setLoadding] = useState(true)
  // useEffect(() => {
  //   setTimeout(() => setLoadding(false), 1000)
  // }, [])
  return (
    <Card
      title={title}
      className={BlockCss.card}
      hoverable
      // loading={isloadding}
      bordered={false}
    >
      {children}
    </Card>
  )
}

function HomePage({ path }: { path: string }) {
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h1>Home</h1>
      {/* <NoteInput /> */}
      <CssBlockCard title="Search">
        <p>
          Search [________________]<br />
          熱門：$AAA, Boeing, COVID-19, [[輝瑞疫苗]] [[Apple發布會]]<br />
          補完：$DDD, $EEE, [[疫苗(new)]]
        </p>
      </CssBlockCard>
      <CssBlockCard title="Today">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>風向標</span>
            <span>
              [[SandP500]] [漲] [跌] <br />
              [[Dow]] [漲] [跌] <br />
              - (漲)受疫苗利好影響，持續高漲 @somebody <br />
              Nasdaq [漲] [跌] <br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>潛力</span>
            <span>
              [[冷鏈]](疫苗需要超低溫運送)  [[電動車]]  [[自動駕駛]]
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Stream<br />[[New]]</span>
            <span>
              [[AAA]]@YT OOOOOOOOOO...  #買入DJI... #近期反轉... (31+) <br />
              [[BBB]]@YT 逢高賣.........  (11-) <br />
              # [[Nasdaq]]阻力位130,穿破點140 [[chart]]<br />
              # 多頭格局確認，[[科技]]股逢低買入<br />
              # 買入[[疫苗受益股(new)]]<br />
              `highlighted text from source page`這裡可以加註一些東西<br />
              - 反駁[[%1]]，因為OOXX<br />
              [(#)_________________]<br />
              @CCC: Nasdaq突破新高 <a>facebook</a><br />
              @匿名?:強烈買入訊號 #flag在此  <br />
              more...<br />
              ...<br />
              ...<br />
              --- 2020.1.1 ---<br />
              ...<br />
              ...<br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>擂台</span>
            AAA ($AA) vs BBB ($BB)<br />
            $CC vs $DD<br />
          </li>
          <li>
            <span className={BlockMetaCss.span}>補完計畫 (進度0.01%)</span>
            $AA, $BB, $CC
          </li>
        </ul>
      </CssBlockCard>
      <CssBlockCard title="抽卡">
        <p>
          卡片來自 from @anonymous<br />
          推薦股票：$AAA, 理由：ＯＯＯＯＯＯＯＯＸＸＸＸＸＸＸ<br />
          Like Unlike
        </p>
      </CssBlockCard>
      <CssBlockCard title="New link form">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>Link</span>
            <span>
              [_________________]<br />
              [submit] 自動探測... (已存在) (未存在，建立中)
              </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Author</span>
            <span>@someone:youtube or [_____(author page)_____]</span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Comments<br /></span>
            <span>
              [(#)_________________]<br />
            </span>
          </li>
        </ul>
      </CssBlockCard>
    </Content>
  )
}

function TickerPage({ path }: { path: string }) {
  const bullishTag = ["競爭對手少 ", "產業領頭", "因疫情過度低估", "軍工產業"]
  const bearishTag = ["現金量低",
    "虧損中",
    "未來前景不明",
    "現金量低",
    "虧損中",
    "未來前景不明",
    "現金量低",
    "虧損中",
    "未來前景不明",
    "現金量低",
    "虧損中",
    "未來前景不明",
    "現金量低",
    "虧損中",
    "未來前景不明",
    "現金量低",
    "虧損中",
    "未來前景不明",]
  const operation = ["買入", '持有', '賣出']
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h1>波音, Boeing ($BA)</h1>
      {/* <embed src="https://www.youtube.com/watch?v=o5i2eIjOD94/" width="200" height="200" /> */}
      {/* <iframe src="https://www.youtube.com/watch?v=o5i2eIjOD94/" /> */}
      <CssBlockCard title="Brief">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>主題</span>
            <span>[新增]</span>
            {/* <Tag content="$BA" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>Links</span>
            [Yahoo Finance!] [官網] [Wikipedia]
          </li>
          {/* <li> 
            <span className={BlockMetaCss.span}>關聯事件</span>
            <Tag content="~COVI-19~" />
          </li> */}
          <li>
            <span className={BlockMetaCss.span}>簡介</span>
            [新增]
            {/* <span>
              波音公司（英語：The Boeing
              Company）是美國一家開發、生產及销售固定翼飛機、旋翼
              机、运载火箭、导弹和人造卫星等產品，為世界最大的航天航空器製造商。
              <a>[wikipedia]</a>
            </span> */}

          </li>
          <li>
            <span className={BlockMetaCss.span}>產業</span>
            {/* <Tag content="民航機" />
            <Tag content="軍工" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>利多</span>
            <Tag content={bullishTag} />

            <a>...more</a>
          </li>
          <li>
            <span className={BlockMetaCss.span}>利空</span>
            <span>
              <Tag content={bearishTag} />


            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>操作判斷</span>
            <span>
              <Tag content={operation} newTag={false} />
              <Modal />
              {/* <MyTextArea /> */}
              <p>
                (買入)因疫情關係處在低點，明年恢復正常後會強勢反彈
            </p>
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Alternatives</span>
            <span>
              價格：$BA $AA $CA<br />
              [[航空]]：$BA $AA $CA<br />
              [[軍工]]：$BA $AA $CA<br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Battle</span>
            <span>
              $BA vs $AA<br />
              $BA vs $CA<br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>近期交易</span>
            <span>
              OO基金 買入 30,000萬 股<br />
              XX基金 賣出 20,000萬 股<br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>主要持股</span>
            <span>
              OO基金 持有 300,000萬 股，佔1.3% (-0.01%)<br />
              XX基金 持有 300,000萬 股，佔1.3% (+0.01%)<br />
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>討論</span>

            <CommentListSmall />

          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="價格">
        <LineChart />
        <LineChart />
        <LineChart />
      </CssBlockCard>

      <CssBlockCard title="Alternatives">
        <p>排序：依1年內漲幅、依1個月漲幅、依社群看好度</p>
        <ul>
          <li>
            <span className={BlockMetaCss.span}>依價格</span>
            {/* #1 <Tag content="$AA (空巴)" />
            #2 <Tag content="$BB (雷神)" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>依航空產業</span>
            {/* #1 <Tag content="$BA (波音)" />
            #2 <Tag content="$AA (空巴))" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>依軍工產業</span>
            {/* #1 <Tag content="$BA (Boeing)" />
            #2 <Tag content="$AA (Airbus)" /> */}
          </li>
        </ul>
      </CssBlockCard>


      <CssBlockCard title="討論">
        <CssCommentList />
      </CssBlockCard>

    </Content>
  )
}

function JustCreatedTopicPage({ path }: { path: string }) {
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h2>[[航空]]</h2>
      <h3>頁面完成度(10%)</h3>
      <h3>同意建立此頁面? Y : N</h3>
      <CssBlockCard title="">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>這是</span>
            <span>[主題] [事件]</span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Wiki</span>
            <span>[新增]</span>
            {/* <Tag content="$BA" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>關聯</span>
            <span>[新增]</span>
            {/* <Tag content="$BA" /> */}
          </li>
          {/* <li>
            <span className={BlockMetaCss.span}>Links</span>
            [Yahoo Finance!] [官網] [Wikipedia]
          </li> */}
          <li>
            <span className={BlockMetaCss.span}>簡介</span>
            [新增]
          </li>
          <li>
            <span className={BlockMetaCss.span}>Tickers</span>
            <span>
              {/* <Tag content="AAA ($AA)" />
              <Tag content="BBB ($BB)" />
              <Tag content="CCC ($CC)" /> */}
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>短期</span>
            <span>
              {/* <Tag content="看好" />
              <Tag content="看壞" />
              <Tag content="中立" /> */}
              [____________]
              <p>
                (看好)因疫情關係處在低點，明年恢復正常後會強勢反彈
            </p>
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>長期</span>
            <span>
              {/* <Tag content="看好" />
              <Tag content="看壞" />
              <Tag content="中立" /> */}
              [____________]
              <p>
                (中立)因疫情關係處在低點，明年恢復正常後會強勢反彈
              </p>
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>討論</span>
            <span>
              Q:這是一個comment<br />
              Q:這是另一個comment<br />
              # 某個提到[[航空]]的comment // @AAA:youtube<br />
            </span>
          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="Compare">
        <SomeTable />
      </CssBlockCard>

      <CssBlockCard title="Price">
        ETF: $AAA, $BBB
        <LineChart />
      </CssBlockCard>

      <CssBlockCard title="討論">
        <span>
          自2020/3/1至2020/6/1，股價最為疲軟的類別：[[航空]] [[觀光]]
          </span>
        <CssCommentList />
      </CssBlockCard>

    </Content>

  )
}

function TopicPage({ path }: { path: string }) {
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h2>[[航空]]</h2>
      <h3>頁面完成度(10%)</h3>
      <h3>同意建立此頁面? Y : N</h3>
      <CssBlockCard title="">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>這是</span>
            <span>[主題] [事件]</span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Wiki</span>
            <span>[新增]</span>
            {/* <Tag content="$BA" /> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>關聯</span>
            <span>[新增]</span>
            {/* <Tag content="$BA" /> */}
          </li>
          {/* <li>
            <span className={BlockMetaCss.span}>Links</span>
            [Yahoo Finance!] [官網] [Wikipedia]
          </li> */}
          <li>
            <span className={BlockMetaCss.span}>簡介</span>
            [新增]
          </li>
          <li>
            <span className={BlockMetaCss.span}>Tickers</span>
            <span>
              {/* <Tag content="AAA ($AA)" />
              <Tag content="BBB ($BB)" />
              <Tag content="CCC ($CC)" /> */}
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>短期</span>
            <span>
              {/* <Tag content="看好" />
              <Tag content="看壞" />
              <Tag content="中立" /> */}
              [____________]
              <p>
                (看好)因疫情關係處在低點，明年恢復正常後會強勢反彈
            </p>
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>長期</span>
            <span>
              {/* <Tag content="看好" />
              <Tag content="看壞" />
              <Tag content="中立" /> */}
              [____________]
              <p>
                (中立)因疫情關係處在低點，明年恢復正常後會強勢反彈
              </p>
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>討論</span>
            <span>
              Q:這是一個comment<br />
              Q:這是另一個comment<br />
              # 某個提到[[航空]]的comment // @AAA:youtube<br />
            </span>
          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="Compare">
        <SomeTable />
      </CssBlockCard>

      <CssBlockCard title="Price">
        ETF: $AAA, $BBB
        <LineChart />
      </CssBlockCard>

      <CssBlockCard title="討論">
        <span>
          自2020/3/1至2020/6/1，股價最為疲軟的類別：[[航空]] [[觀光]]
          </span>
        <CssCommentList />
      </CssBlockCard>

    </Content>
  )
}

function AuthorPage({ path }: { path: string }) {
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h1>Some One's Name, @SomeBody</h1>
      <CssBlockCard title="">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>Link</span>
            <span>
              [Youtube]  [Facebook]
            </span>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Rank</span>
            <span>
              預測率: OOO，排名: OO
            </span>
          </li>
        </ul>
      </CssBlockCard>
      <CssBlockCard title="Feed">
        <ul>
          <li>
            <span>
              OOOOO...@AAA:youtube // #買入$AAA,目標價=123,止損=110 // *推薦買入... *近期反轉...
            </span>
          </li>
          <li>
            <span>
              OOOOO...@AAA:youtube #建議買$AA, $BB, $CC #近期反轉... <br />
              /獲利:+4.2%/
            </span>
          </li>
          <li>
            OOOOO...@AAA <a>youtube</a> #推薦買入... #近期反轉... <br />
            /預測:成功/
          </li>
        </ul>
      </CssBlockCard>
      <CssBlockCard title="Comments">
        <p>
          Comments go here
        </p>
      </CssBlockCard>
    </Content>
  )
}

function CardPage({ path }: { path: string }) {
  return (
    <Content className="site-layout-background content" style={{ minHeight: 280, }}>
      <h1>Plantier, $PLTR</h1>
      <pre>
        [[aaa]] [[bbb]] [[ccc]]
        [homesite] [YF!] [Wiki]
      </pre>
      <pre>
        [my] [community(需解鎖)]
        建立$PLTR的Card(?) 或 幫[______url______]做筆記(?)
      </pre>

      <CssBlockCard title="My Card">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>You are</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Verdict</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          </li>
          <li>
            <textarea style={{ width: 600, height: 300 }} />
          </li>
          <span>[Preview]</span>
          <li>
            <span className={BlockMetaCss.span}>Pros</span>
            <ul>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Cons</span>
            <ul>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
            {/* <span>
              預測率: OOO，排名: OO
            </span> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>目標價</span>
            <span>$32.1</span>
          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="My Card (Editing)">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>You are</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Verdict</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          </li>
          <li>
            {/* <span className={BlockMetaCss.span}>Note</span> */}
            <textarea style={{ width: 600, height: 300 }} />
          </li>
        </ul>
        <button>Preview</button>
        <button>Submit</button>
      </CssBlockCard>

      <CssBlockCard title="Community Card">
        <ul>
          <li>
            <span className={BlockMetaCss.span}>People</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
            <span>[結果]</span>
            {/* <span>你在幾月幾日投(A)</span> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>Verdict</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
              <Radio value={4}>D</Radio>
            </Radio.Group>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Pros</span>
            <ul>
              <li><span>&#8226;這是一個點 (點擊後開啟卡片) [Up] [Down]</span></li>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Cons</span>
            <ul>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
            {/* <span>
              預測率: OOO，排名: OO
            </span> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>目標價</span>
            <span>$32.1</span>
          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="Oauthor Card">
        <pre>
          @author, links
        </pre>
        <ul>
          <li>
            <span className={BlockMetaCss.span}>People</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
            </Radio.Group>
            <span>[結果]</span>
            {/* <span>你在幾月幾日投(A)</span> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>Verdict</span>
            <Radio.Group >
              <Radio value={1}>A</Radio>
              <Radio value={2}>B</Radio>
              <Radio value={3}>C</Radio>
            </Radio.Group>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Pros</span>
            <ul>
              <li><span>&#8226;這是一個點[link]</span></li>
              <li><span>&#8226;這是一個點[link]</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
          </li>
          <li>
            <span className={BlockMetaCss.span}>Cons</span>
            <ul>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
              <li><span>&#8226;這是一個點</span></li>
            </ul>
            {/* <span>
              預測率: OOO，排名: OO
            </span> */}
          </li>
          <li>
            <span className={BlockMetaCss.span}>目標價</span>
            <span>$32.1</span>
          </li>
        </ul>
      </CssBlockCard>

      <CssBlockCard title="Link Note">
        <pre>
          @author, [link title]
        </pre>
        Mini Cards
        [$AA 看多 / 這是一個理由 / 另一個理由]
        [$AB 看空]
      </CssBlockCard>

      <CssBlockCard title="(NEXT)Discuss by filter">
        <p>
          Comments go here
        </p>
      </CssBlockCard>
    </Content>
  )
}


export function DemoPages() {
  return (
    <Layout className="my-app">
      {/* <Sider
          trigger={null}
          collapsible
          collapsed={this.state.collapsed}
          theme="light"
          style={{ position: 'relative' }}
        >
          <div className="logo" />
          <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1" icon={<UserOutlined />}>
              探索
            </Menu.Item>
            <Menu.Item key="2" icon={<VideoCameraOutlined />}>
              熱門
            </Menu.Item>
            <Menu.Item key="3" icon={<UploadOutlined />}>
              關注
            </Menu.Item>
          </Menu>
        </Sider> */}
      <Layout className="site-layout" style={{ position: 'relative' }}>
        <Header
          className="site-layout-background header "
          style={{ padding: 0 }}
        >
        </Header>

        {/* <div className="anchorWrapper">
          <Anchor />
        </div> */}

        <Router primary={false} component={Fragment}>
          <HomePage path="/" />
          <TickerPage path="ticker" />
          <TopicPage path="topic" />
          <AuthorPage path="author" />
          <CardPage path="card" />
        </Router>

      </Layout>
    </Layout>

  )
}
