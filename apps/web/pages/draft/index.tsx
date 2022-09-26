import React, { useEffect, useState } from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { docGetOrCreate } from '../../frontend/components/editor-textarea/src/events'
import SearcherModal from '../../frontend/components/search-all-modal/SearcherModal'
import type { AppPageProps, SearcherProps } from '../../frontend/interfaces'
import { getDraftPageURL } from '../../frontend/utils'
import { omitBy } from 'lodash'

type Props = AppPageProps & {
  query: {
    symbol?: string
    isFromExtension?: boolean // Open this page by extension
  }
}

const DraftIndexPage = ({ query }: Props): JSX.Element | null => {
  const router = useRouter(),
    [loading, setLoading] = useState(true)

  async function redirectToDraftIdPage(symbol: string) {
    setLoading(true)
    const doc = await docGetOrCreate(symbol)
    router.push(getDraftPageURL(doc.noteDraftCopy.id))
  }

  useEffect(() => {
    if (query.symbol) {
      redirectToDraftIdPage(query.symbol)
    } else {
      setLoading(false)
    }
  }, [query])

  const searcher: SearcherProps['searcher'] = {
    searchRange: 'symbol',
    onClickHit: hit => redirectToDraftIdPage(hit.str),
  }

  if (loading) {
    return null
  }
  return <SearcherModal searcher={searcher} />
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { s, from } = query
  const symbol = typeof s === 'string' ? s : undefined
  const isFromExtension = from === 'extension'
  const query_ = { symbol, isFromExtension }
  const query__ = omitBy(query_, v => v === undefined)

  return {
    props: {
      query: query__,
      protected: true,
      sidebarPinned: !isFromExtension,
    },
  }
}

export default DraftIndexPage
