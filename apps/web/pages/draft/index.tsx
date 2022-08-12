import React, { useEffect, useState } from 'react'
import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import { docGetOrCreate } from '../../frontend/components/editor-textarea/src/events'
import SearcherModal from '../../frontend/components/search-all-modal/searcher-modal'
import type { AppPageProps, SearcherProps } from '../../frontend/interfaces'
import { getDraftPageURL } from '../../frontend/utils'
import { LayoutChildrenPadding } from '../../frontend/components/ui/layout/layout-children-padding'

type Props = AppPageProps & {
  query: {
    symbol?: string
    extension?: boolean // Open this page by extension
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
  return (
    <LayoutChildrenPadding>
      <SearcherModal searcher={searcher} />
    </LayoutChildrenPadding>
  )
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { s, ext } = query,
    symbol = typeof s === 'string' ? s : undefined,
    extension = ext === '1'

  return {
    props: {
      query: { symbol, extension },
      protected: true,
      sidebarPinned: !extension,
    },
  }
}

export default DraftIndexPage
