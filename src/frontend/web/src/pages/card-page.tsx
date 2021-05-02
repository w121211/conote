import React, { useEffect, useRef, useState } from 'react'
import { RouteComponentProps, Redirect, Link, navigate, useLocation } from '@reach/router'
import { useQuery } from '@apollo/client'
import { Layout, Button } from 'antd'
import * as queries from '../graphql/queries'
import * as QT from '../graphql/query-types'
import { CardHead, CardBody } from '../components/card'
import { symbolToUrl, getCardUrlParam } from '../helper'
import TickerAnchor from '../components/anchor/tickerAnchor'
import { ReactComponent as EditIcon } from '../assets/edit.svg'
import classes from './card-page.module.scss'
// import { CommentContext } from '.'

interface RouteProps extends RouteComponentProps {
  me?: QT.me_me
}

export function ResolvedCardPage({ card }: { card: QT.cocardFragment }): JSX.Element {
  const [titleCount, setTitleCount] = useState(0)

  let titleRefArr: any[] = []
  // useEffect(() => {
  //   myRef()
  // })
  // console.log(myRef.current)
  const pushTitleHandler = (el: any) => {
    // myRef.current[titleCount] = el
    // setTitleCount(titleCount + 1)
  }
  const clickHandler = (e: any, index: number) => {
    titleRefArr[index].scrollIntoView({ behavior: 'smooth' })

    // console.log(myRef.current[index])
    // document.getElementById(data.symbol)?.scrollIntoView({ behavior: 'smooth' })
    // console.log(data.symbol)
    // if (myRef && 'current' in myRef) {
    // ref.current?.focus();
    // myRef.current?.scrollIntoView({ behavior: 'smooth' })
    // }
  }

  const titleRefHandler = (arr: any[]) => {
    // console.log(myRef.current)
    titleRefArr = arr
    // console.log(arr)
    // if (myRef.current) {
    // arr.forEach((el, idx) => (myRef.current[idx] = el))
    // }
    // myRef.current
    // myRef.current = arr
    // console.log(myRef.current)
  }

  return (
    <Layout.Content className="site-layout-background content">
      {console.log(card)}
      <TickerAnchor data={card} clickHandler={clickHandler} />
      <div className={classes.cardOuter}>
        <div className={classes.cardInner}>
          <div className={classes.cardElement}>
            <CardHead card={card} />
            {/* <div className={classes.cardBodyContainer}> */}
            <CardBody className={classes.section} card={card} titleRefHandler={titleRefHandler} />

            {/* </div> */}
          </div>
        </div>
      </div>
      {/* <div className={classes.buttonWrapper}> */}
      <Button
        className={classes.button}
        onClick={() => {
          navigate(`/form?${getCardUrlParam(card)}`)
        }}
      >
        <EditIcon className={classes.editIcon} />
      </Button>
      {/* </div> */}
    </Layout.Content>
  )
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

export function CardPage({ path }: RouteProps): JSX.Element {
  /** 入口，檢查有沒有url，有的話query cocard，然後轉至render-page */
  const location = useLocation()
  const params = new URLSearchParams(location?.search)
  const url = params.get('u')
  const symbol = params.get('s')

  if (url) {
    return <FetchCard url={url} />
  } else if (symbol) {
    try {
      return <FetchCard url={symbolToUrl(symbol)} />
    } catch {
      return <h1>Symbol format error</h1>
    }
  } else {
    return <h1>Require URL or Symbol</h1>
  }
}
