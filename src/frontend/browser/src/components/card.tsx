import React, { useState } from 'react'
// import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery } from '@apollo/client'
// import { Layout, Button } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
// import { CardHead, CardBody } from '../components/card'
import { symbolToUrl, getCardUrlParam } from '../helper'

// interface RouteProps extends RouteComponentProps {
//   me?: QT.me_me
// }

export function ResolvedCardPage({ card }: { card: QT.cocardFragment }): JSX.Element {
  console.log(card)
  return <h1>Card</h1>
  // return (
  //   <Layout.Content className="site-layout-background content" style={{ minHeight: 280 }}>
  //     <CardHead card={card} />
  //     <CardBody card={card} />
  //     <Button
  //       onClick={() => {
  //         navigate(`/form?${getCardUrlParam(card)}`)
  //       }}
  //     >
  //       編輯
  //     </Button>
  //   </Layout.Content>
  // )
}

function FetchCard({ url }: { url: string }) {
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

// export function CardPage({ path }: RouteProps): JSX.Element {
//   /** 入口，檢查有沒有url，有的話query cocard，然後轉至render-page */
//   const location = useLocation()
//   const params = new URLSearchParams(location?.search)
//   const url = params.get('u')
//   const symbol = params.get('s')

//   if (url) {
//     return <FetchCard url={url} />
//   } else if (symbol) {
//     try {
//       return <FetchCard url={symbolToUrl(symbol)} />
//     } catch {
//       return <h1>Symbol format error</h1>
//     }
//   } else {
//     return <h1>Require URL or Symbol</h1>
//   }
// }

export function CardPage(): JSX.Element {
  /** 入口，檢查有沒有url，有的話query cocard，然後轉至render-page */
  // const location = useLocation()
  // const params = new URLSearchParams(location?.search)
  // const url = params.get('u')
  // const symbol = params.get('s')
  const url = null
  const symbol = '$BA'

  if (url) {
    return <FetchCard url={url} />
  }
  if (symbol) {
    try {
      return <FetchCard url={symbolToUrl(symbol)} />
    } catch {
      return <h1>Symbol format error</h1>
    }
  }
  return <h1>Require URL or Symbol</h1>
}
