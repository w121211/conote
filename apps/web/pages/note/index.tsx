import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useNoteLazyQuery } from '../../apollo/query.graphql'

export function NoteIndexPage(): JSX.Element | null {
  const router = useRouter()
  const [url, setUrl] = useState<string | null>()
  const [queryNote, { data, loading, error }] = useNoteLazyQuery()

  useEffect(() => {
    const { query, isReady } = router
    if (isReady) {
      const { url } = query
      if (url && typeof url === 'string') {
        setUrl(url)
        queryNote({
          variables: { url },
        })
      } else {
        setUrl(null)
      }
    }
  }, [router])

  if (url === null) {
    return <div>Give a url or symbol to query a note</div>
  }
  if (loading) {
    return null
  }
  if (data && data.note) {
    // router.push(`/note/${encodeURIComponent(data.note.sym.symbol)}`)
    router.push({
      pathname: '/note/[symbol]',
      query: { symbol: data.note.sym.symbol },
    })
    return null
  }
  if (error) {
    console.error(error)
    return <div>Given url: {url} is not supported yet.</div>
  }
  return null
}

export default NoteIndexPage
