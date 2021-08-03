import React, { useEffect, useState } from 'react'
// import { UserProvider } from '@auth0/nextjs-auth0'

import TestPage from './card'
import CardPage from './extension-page'
import Layout from './layout/layout'
import { useCardQuery, useWebpageCardQuery } from '../apollo/query.graphql'
// import { useRouter } from 'next/router'

function getTabUrl(): string | null {
  let url: string | null
  // if (window.location.protocol.includes('extension')) {
  //   // popup的情況
  //   const params = new URLSearchParams(new URL(window.location.href).search)
  //   url = params.get('u')
  // } else {
  // inject的情況
  // url = window.location.href
  const params = new URLSearchParams(new URL(window.location.href).search)
  url = params.get('u')
  // }

  return url
}

const CardIndex = () => {
  const [path, setPath] = useState<string[]>([])
  const [symbol, setSymbol] = useState('')
  const [url, setUrl] = useState('')
  useEffect(() => {
    const tabUrl = getTabUrl()

    if (tabUrl) {
      setUrl(tabUrl)
      setPath([`[[${tabUrl}]]`])
    }

    // console.log(tabUrl)
  }, [])
  const {
    data: webPageData,
    loading: webPageLoading,
    error: webPageError,
    refetch: webPageRefetch,
  } = useWebpageCardQuery({ variables: { url: url } })
  // console.log(webPageData?.webpageCard)

  useEffect(() => {
    if (webPageData?.webpageCard) {
      setPath([webPageData.webpageCard.symbol])
      setSymbol(webPageData.webpageCard.symbol)
      // console.log(webPageData.webpageCard)
    }
    if (!webPageData?.webpageCard) {
      webPageRefetch()
    }
  }, [webPageData])
  // const { data, loading, error } = useCardQuery({ variables: { symbol} })
  //   const router = useRouter()
  //   if (typeof window !== 'undefined') console.log(window.history)
  //   console.log(router.asPath)
  const handlePath = (i: number) => {
    setPath(prev => [...prev].slice(0, i + 1))
  }
  const handleSymbol = (e: string) => {
    setSymbol(e)
  }
  const handlePathPush = (e: string) => {
    setPath(prev => [...prev, e])
  }

  return (
    // <UserProvider>
    <Layout path={path} handlePath={handlePath} handleSymbol={handleSymbol}>
      {/* {window.location.protocol.includes('extension') ? (
        <CardPage pathSymbol={symbol} handlePathPush={handlePathPush} />
      ) : ( */}
      <TestPage pathSymbol={symbol} handlePathPush={handlePathPush} />
      {/* // )} */}
    </Layout>
    // </UserProvider>
  )
}

export default CardIndex
