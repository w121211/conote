import React, { useState } from 'react'
// import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Layout, Button } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { CardHead, CardBody } from '../components/card'
import { symbolToUrl, getCardUrlParam } from '../helper'

interface RouteProps {
  me?: QT.me_me
  path?: string
  url?: string
}

export function ResolvedCardPage({ card }: { card: QT.cocardFragment }): JSX.Element {
  return (
    <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
      <CardHead card={card} />
      <CardBody card={card} />
      {/* <Button
        onClick={() => {
          navigate(`/form?${getCardUrlParam(card)}`)
        }}
      >
        編輯
      </Button> */}
    </Layout.Content>
  )
}

export function FetchCard({ url }: { url: string }) {
  const { loading, data, error } = useQuery<QT.cocard, QT.cocardVariables>(queries.COCARD, {
    variables: { url },
    // fetchPolicy: 'no-cache',
  })
  if (loading) return <h1>loading</h1>
  if (error || !data) return <h1>{error?.message}</h1>
  if (data.cocard === null) {
    // 目前query cocard若沒找到會直接建立新的，所以這個原則上不會發生
    // navigate(`/webpage/form?${_toUrlParams('url', url)}`)
    console.error('something wrong')
    return <h1>Unpected error</h1>
  }
  return <ResolvedCardPage card={data.cocard} />
}
