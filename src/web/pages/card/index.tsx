import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useWebpageCardLazyQuery } from '../../apollo/query.graphql'

export function CardIndexPage(): JSX.Element | null {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>()
  const [queryCard, { data, loading, error }] = useWebpageCardLazyQuery()

  useEffect(() => {
    const { query, isReady } = router
    if (isReady) {
      if (query.url && typeof query.url === 'string') {
        setUrl(query.url)
        queryCard({
          variables: { url: query.url },
        })
      } else {
        setUrl(null)
      }
    }
  }, [router])

  if (url === null) {
    return <div>Give a url or symbol to query a card</div>
  }
  if (loading) {
    return null
  }
  if (data && data.webpageCard) {
    router.push(`/card/${encodeURIComponent(data.webpageCard.symbol)}`)
    return null
  }
  if (error) {
    console.error(error)
    return <div>Given url: {url} is not supported yet.</div>
  }
  return null
}

export default CardIndexPage
