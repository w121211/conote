import { useEffect, useState } from 'react'
import TestPage from './card'
import Layout from '../../components/layout/layout'
import { useCardQuery, useWebpageCardQuery } from '../../apollo/query.graphql'
// import { useRouter } from 'next/router'

function getTabUrl(): string | null {
  let url: string | null
  if (window.location.protocol.includes('extension')) {
    // popup的情況
    const params = new URLSearchParams(new URL(window.location.href).search)
    url = params.get('u')
  } else {
    // inject的情況
    url = window.location.href
  }

  return url
}

const CardIndex = () => {
  const [path, setPath] = useState<string[]>(['$GOOG'])
  const [symbol, setSymbol] = useState('$GOOG')
  const [url, setUrl] = useState('')
  useEffect(() => {
    const tabUrl = getTabUrl()

    tabUrl && setUrl(tabUrl)
  }, [])
  const {
    data: webPageData,
    loading: webPageLoading,
    error: webPageError,
  } = useWebpageCardQuery({ variables: { url: url } })

  useEffect(() => {
    if (webPageData?.webpageCard) {
      setPath([webPageData.webpageCard.symbol])
      setSymbol(webPageData.webpageCard.symbol)
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
    <Layout path={path} handlePath={handlePath} handleSymbol={handleSymbol}>
      <TestPage pathSymbol={symbol} handlePathPush={handlePathPush} />
    </Layout>
  )
}

export default CardIndex
