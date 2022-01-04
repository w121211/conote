import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useCardLazyQuery } from '../../apollo/query.graphql'

export function CardIndexPage(): JSX.Element | null {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>()
  const [queryCard, { data, loading, error }] = useCardLazyQuery()

  useEffect(() => {
    const { query, isReady } = router
    if (isReady) {
      const { url } = query
      if (url && typeof url === 'string') {
        setUrl(url)
        queryCard({
          variables: { url },
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
  if (data && data.card) {
    // router.push(`/card/${encodeURIComponent(data.card.sym.symbol)}`)
    router.push({
      pathname: '/card/[symbol]',
      query: { symbol: data.card.sym.symbol },
    })
    return null
  }
  if (error) {
    console.error(error)
    return <div>Given url: {url} is not supported yet.</div>
  }
  return null
}

export default CardIndexPage
