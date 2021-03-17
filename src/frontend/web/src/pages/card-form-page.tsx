import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery, useLazyQuery, useMutation } from '@apollo/client'
import { Alert, Form, Layout, Button, Input } from 'antd'
import * as QT from '../graphql/query-types'
import * as queries from '../graphql/queries'
import { getCardUrlParam, symbolToUrl } from '../helper'
import { CardForm, CardBody } from '../components/card'

interface RouteProps extends RouteComponentProps {
  me?: QT.me_me
}

function ResolvedCardFormPage({ card }: { card: QT.cocardFragment }): JSX.Element {
  const [mode, setMode] = useState<string>('EDIT')
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      {/* <CardHeader card={card} /> */}
      {/* <Button onClick={() => { setMode('EDIT') }}>編輯</Button> */}
      {/* <Button onClick={() => { setMode('BROWSE') }}>瀏覽</Button> */}
      {mode === 'EDIT' && (
        <CardForm
          card={card}
          // allowedSects={['ticker', 'topic']}
          onFinishFn={() => {
            navigate(`/card?${getCardUrlParam(card)}`)
          }}
        />
      )}
      {mode === 'BROWSE' && <CardBody card={card} />}
    </Layout.Content>
  )
}

function FetchCard({ url }: { url: string }) {
  const { loading, data, error } = useQuery<QT.cocard, QT.cocardVariables>(queries.COCARD, {
    variables: { url },
    // fetchPolicy: 'no-cache',
  })
  if (loading) {
    return <h1>loading</h1>
  }
  if (error) {
    return <h1>{error.message}</h1>
  }
  if (data && data.cocard !== null) {
    return <ResolvedCardFormPage card={data.cocard} />
  }
  if (data && data.cocard === null) {
    // 目前query cocard若沒找到會直接建立新的，所以這個原則上不會發生
    // navigate(`/webpage/form?${_toUrlParams('url', url)}`)
    console.error('something wrong')
    return <h1>Unpected error</h1>
  }
  return <h1>Unpected error</h1>
}

export function CardFormPage({ path }: RouteProps): JSX.Element | null {
  /**
   * 注意：
   * - 不要用locatiion.state：因為找不到方法變更state，會記錄著之前的狀態而不更新 -> 用apollo cache
   *
   * TODO:
   * - ticker section
   * - comment freeze -> 暫時方案：與既有comment重複的marker直接忽略不重複創建
   * - 載入預設template
   * - poll marker
   * - pretty form
   * - input auto-complete: ticker, topic
   * - 在編輯時可以叫出其他卡片 & import comment
   * - comment replies
   * - modify/delete existed markers
   */
  const location = useLocation()
  const params = new URLSearchParams(location?.search)
  const url = params.get('u')
  const symbol = params.get('s')

  if (url) return <FetchCard url={url} />
  if (symbol) {
    try {
      return <FetchCard url={symbolToUrl(symbol)} />
    } catch {
      return <h1>Symbol format error</h1>
    }
  }
  return <h1>Require URL or Symbol</h1>
}

// export function PlainWebcardForm() {
//   /** （僅用於測試期間）在沒有預先給URL的情況，用textarea取得URL，再轉至cardForm */
//   const [err, setErr] = useState<string | undefined>()
//   function onChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
//     const { url, textAfterUrl: text } = findUrl(e.target.value)
//     if (url) {
//       navigate(`/webpage/form?${_toUrlParams('url', url)}`)
//     } else {
//       setErr('No URL found')
//     }
//   }
//   return (
//     <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
//       <pre>URL: 用input首行代表 貼上文字後會自動fetch</pre>
//       {err && <h1>{err}</h1>}
//       <Input.TextArea onChange={onChange} rows={10} autoSize />
//     </Layout.Content>
//   )
// }
