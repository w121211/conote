import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { docGetOrCreate } from '../../frontend/components/block-editor/src/events'
import SearcherModalButton from '../../frontend/components/search-all-modal/searcher-modal-button'
import { SearcherProps } from '../../frontend/stores/searcher.repository'
import { getDraftPageURL } from '../../frontend/utils'

interface Props {
  query: {
    symbol?: string
  }
  protected: boolean
}

const DraftIndexPage = ({ query }: Props): JSX.Element | null => {
  const router = useRouter(),
    [loading, setLoading] = useState(true)
  // const [createLink, mCreateLink] = useCreateLinkMutation()

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
    <div>
      <SearcherModalButton searcher={searcher} />
    </div>
  )
}

export async function getServerSideProps({
  query,
}: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> {
  const { s } = query,
    query_ = typeof s === 'string' ? { symbol: s } : {}

  return {
    props: {
      query: query_,
      protected: true,
    },
  }
}

export default DraftIndexPage
