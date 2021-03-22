import React, { useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Layout, Button } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { CardBody } from '../components/card'
import { CardForm } from '../components/card-form'
import { symbolToUrl, getCardUrlParam } from '../helper'
import { ResolvedCardPage } from './card-page'
import { TextEditor } from '@conote/editor'

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

export function GiveandtakeCardPage({ path, me }: RouteProps): JSX.Element {
  const location = useLocation()
  const params = new URLSearchParams(location?.search)
  const symbol = params.get('s')

  const { loading, data, error } = useQuery<QT.cocard, QT.cocardVariables>(queries.COCARD, {
    variables: { url: symbolToUrl(symbol ?? '') },
    // fetchPolicy: 'no-cache',
  })
  // const [isLock, setIsLock] = useState<boolean>(true)

  if (!me) return <h1>需要login</h1>
  if (!symbol) return <h1>僅用於symbol的測試</h1>
  if (loading) return <h1>loading</h1>
  if (error || !data) return <h1>{error?.message}</h1>
  if (data.cocard === null) {
    // 目前query cocard若沒找到會直接建立新的，所以這個原則上不會發生
    // navigate(`/webpage/form?${_toUrlParams('url', url)}`)
    console.error('something wrong')
    return <h1>Unpected error</h1>
  }

  const editor = new TextEditor(data.cocard.body?.text)
  const found = editor.getMarkerlines().find(e => e.userId === me.id)
  if (found === undefined) {
    return (
      <div>
        <p>
          {symbol}卡片鎖住中，解鎖方式：
          <br />
          1. <Link to="/">編寫</Link>
          {symbol}卡片
          <br />
          2. 用3點數<Link to="/">解鎖</Link>
        </p>
        {/* <CardForm
          card={data.cocard}
          // allowedSects={['ticker', 'topic']}
          onFinishFn={() => {
            navigate(`/card?${getCardUrlParam(data.cocard as QT.cocard_cocard)}`)
          }}
        /> */}
      </div>
    )
  }
  return (
    <>
      <p>已解鎖</p>
      <ResolvedCardPage card={data.cocard} />
    </>
  )
}
