import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate, createHistory } from '@reach/router'
import { useQuery, useMutation, useLazyQuery } from '@apollo/client'
import { Button, Layout } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { On404 } from '../components/result'
import { CardBody, CardForm } from '../components/card'

// interface RouteProps extends RouteComponentProps<{ symbol: string, location: { state?: { mycard: QT.selfcardFragment } } }> {
//   me?: QT.me_me
// }

interface RouteProps extends RouteComponentProps<{ symbol: string }> {
  me?: QT.me_me
}

function ResolvedForm({ card }: { card: QT.selfcard_selfcard }) {
  const [mode, setMode] = useState<string>('EDIT')
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      <pre>
        MyCard Header
        {card.symbol.name}
        -----------------
      </pre>
      {/* <CardForm
        card={card}
        allowedSects={[]}
        rootFormat={TICKER_ALLOWED_MARKERS}
        onFinishFn={() => { navigate(`/ticker/${card.symbol.name}`) }}
      /> */}
    </Layout.Content>
  )
}

export function TickerFormPage({ location, symbol, me }: RouteProps): JSX.Element | null {
  const [card, cardResult] = useLazyQuery<QT.mycard, QT.mycardVariables>(queries.MYCARD)
  const [createCard, createCardResult] = useMutation<QT.createMycard, QT.createMycardVariables>(queries.CREATE_MYCARD)

  if (symbol === undefined) return <h1>Require symbol</h1>
  if (!cardResult.called) {
    card({ variables: { symbolName: symbol } })
  }

  if (cardResult.loading || createCardResult.loading) return null
  if (cardResult.error) return <h1>{cardResult.error.message}</h1>
  if (createCardResult.error) return <h1>{createCardResult.error.message}</h1>
  // if (!data)
  //   return <h1>Cocard not found</h1>
  if (cardResult.data && cardResult.data.mycard !== null) return <ResolvedForm card={cardResult.data.mycard} />
  // if (cardResult.data && cardResult.data.mycard === null && !createCardResult.called) {
  //   createCard({ variables: { symbolName: symbol, data: [] } })
  //     .catch(err => { console.log(err) })
  // }
  if (createCardResult.data) return <ResolvedForm card={createCardResult.data.createMycard} />
  return <h1>Unpected error</h1>
}

export function TickerPage({ location, symbol, me }: RouteProps): JSX.Element | null {
  const queryCocard = useQuery<QT.cocard, QT.cocardVariables>(queries.COCARD, { variables: { url: symbol ?? '' } })
  const queryMycard = useQuery<QT.mycard, QT.mycardVariables>(queries.MYCARD, {
    variables: { symbolName: symbol ?? '' },
  })
  const [curCard, setCurCard] = useState<'COCARD' | 'MYCARD'>('COCARD')
  // const showMycard = new URLSearchParams(location?.search).get("mycard") === 'true'
  // console.log(showMycard)
  // if (showMycard && curCard !== 'MYCARD')
  //   setCurCard('MYCARD')
  // else if (curCard !== 'COCARD')
  //   setCurCard('COCARD')
  if (symbol === undefined) return <On404 />
  if (queryCocard.loading || queryMycard.loading) return null
  if (queryCocard.error) return <p>{queryCocard.error.message}</p>
  if (queryMycard.error) return <p>{queryMycard.error.message}</p>
  if (!queryCocard.data || !queryMycard.data) return <On404 />
  if (queryCocard.data.cocard === null) return <p>Symbol not found</p>
  const header = (
    <pre>
      Plantier, $PLTR [[topic aaa]] [[topic bbb]] [[topic ccc]] [homesite] [YF!] [Wiki] (NEXT)Edit meta data (NEXT)Price
      (and chart)
    </pre>
  )
  const cocard =
    queryMycard.data.mycard === null ? (
      <p>
        目前有???張卡片，需解鎖才能查看
        <br />
        解鎖方式：1. 建立你的卡片 或 2.做一張筆記卡
      </p>
    ) : null
  // <CardBody card={queryCocard.data.cocard} allowedMarkers={TICKER_ALLOWED_MARKERS} />
  const mycard =
    queryMycard.data.mycard === null ? (
      <div>
        你還沒有寫{symbol}的卡片，<Link to={`/ticker/${symbol}/form`}>建立</Link>
      </div>
    ) : null
  // <CardBody card={queryMycard.data.mycard} allowedMarkers={TICKER_ALLOWED_MARKERS} />
  // <TickerMycardForm symbol={symbol} />
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      {/* TODO: 轉到mycard時需要在URL加上?mycard=true */}
      <Button
        onClick={function () {
          setCurCard('COCARD')
        }}
        type={curCard === 'COCARD' ? 'primary' : undefined}
      >
        Co-Card
      </Button>
      <Button
        onClick={function () {
          setCurCard('MYCARD')
        }}
        type={curCard === 'MYCARD' ? 'primary' : undefined}
      >
        My-Card
      </Button>
      <Button
        onClick={() => {
          navigate(`/ticker/${symbol}/form`)
        }}
      >
        編輯
      </Button>
      {/* <Button type={curCard === 'COCARD' ? 'primary' : undefined}>
        <Link to={`/ticker/${symbol}`}>Co-Card</Link>
      </Button>
      <Button type={curCard === 'MYCARD' ? 'primary' : undefined}>
        <Link to='?mycard=true'>My-Card</Link>
      </Button> */}
      {header}
      {/* <Link to="/">新增Note-Card</Link> */}
      {curCard === 'COCARD' ? cocard : mycard}
      {/* <pre>(NEXT) Discuss (use filter)</pre> */}
    </Layout.Content>
  )
}

// export const _TickerPage: React.FC<RouteProps> = function ({ symbol, me }) {
//   /** @deprecated */
//   const { data, loading } = useQuery<QT.page, QT.pageVariables>(
//     queries.PAGE, { variables: { symbolName: symbol } }
//   )
//   if (loading)
//     return null
//   if (!data)
//     return <p>something goes wrong</p>
//   if (data.page === null)
//     return <h1>Null Page</h1>
//   return (
//     <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>

//       {/* <SearchPageForm /> */}
//       {/* <ReplyForm commentId="123" addReplyCountByOne={function () { }} /> */}

//       <h1>{data.page.title} ({data.page.props.selfSymbol})</h1>
//       <CssBlockCard title="">
//         <ul>
//           {data.page.props.topics &&
//             <Comment comment={data.page.props.topics} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', dispReplyAs: 'tile', swapText: 'Topics' }} />}
//           {data.page.props.links &&
//             <Comment comment={data.page.props.links} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', dispReplyAs: 'tag', swapText: 'Links' }} />}
//           {data.page.props.intro &&
//             <Comment comment={data.page.props.intro} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', swapText: '簡介' }} />}
//           {data.page.props.pros &&
//             <Comment comment={data.page.props.pros} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', dispReplyAs: 'tag', swapText: '利多', suggestReplies: prosSuggestReplies }} />}
//           {data.page.props.cons &&
//             <Comment comment={data.page.props.cons} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', dispReplyAs: 'tag', swapText: '利空', suggestReplies: consSuggestReplies }} />}
//           {data.page.props.act &&
//             <Comment comment={data.page.props.act} options={{ ...defaultTileOptions, dispCommentAs: 'key-value', swapText: '操作判斷', swapChoices: ['買入', '持有', '賣出'] }} />}
//         </ul>
//       </CssBlockCard>
//       <CssBlockCard title="實驗中">
//         <ul>
//           <li>
//             <span className={blockMetaCss.span}>Note</span>
//             <ul>
//               <li># this is some note</li>
//               <li># this is another</li>
//             </ul>
//           </li>
//           <li>
//             <span className={blockMetaCss.span}>Alternative</span>
//             <ul>
//               <li>this is one this is one this is one</li>
//               <li>this is two</li>
//             </ul>
//           </li>
//           <li>
//             <span className={blockMetaCss.span}>Battle</span>
//             <ul>
//               <li>this is one this is one this is one</li>
//               <li>this is two</li>
//             </ul>
//           </li>
//           <li>
//             <span className={blockMetaCss.span}>主要股東</span>
//             <ul>
//               <li>this is one</li>
//               <li>this is two</li>
//             </ul>
//           </li>
//           <li>
//             <span className={blockMetaCss.span}>Insider交易</span>
//             <ul>
//               <li>this is one</li>
//               <li>this is two</li>
//             </ul>
//           </li>
//         </ul>
//       </CssBlockCard>
//       <pre>
//         (NEXT) Alternative Block
//       </pre>
//       <pre>
//         (NEXT) Battle Block
//       </pre>
//       <pre>
//         Comments Filter
//       </pre>
//       <pre>
//         Comments Form
//       </pre>

//       {/* <NoteForm /> */}

//       {/* <h2>Block Body (含nested blocks)</h2> */}
//       {/* <BlockBody body={bk.body} /> */}

//       {/* <h2>Block Comments</h2>
//       <h3>1. spot comments</h3>
//       {bk.comments ? <CommentList comments={bk.comments} /> : <p>null spot comments</p>}

//       <h3>2. comments (若允許comment的話)</h3>
//       {bk.props.canComment ? <QueryCommentList blockId={id} /> : <p>不允許comment</p>}

//       <h3>3. new comment (若允許comment的話)</h3>
//       {bk.props.canComment
//         ? <CommentForm blockId={bk.id} toAddCommentCountByOne={() => { }} />
//         : <p>不允許comment</p>} */}
//     </Layout.Content>
//   )
// }
