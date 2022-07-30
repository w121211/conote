import React, { useState } from 'react'
import SearcherModal from '../../../../search-all-modal/searcher-modal'
import { editorChainItemInsert } from '../../events'
import { SearcherProps } from '../../../../../interfaces'

const ChainItemInsertButton = ({
  afterThisDraftId,
}: {
  afterThisDraftId: string
}): JSX.Element => {
  const [loading, setLoading] = useState(false)

  async function insert(symbol: string) {
    setLoading(true)
    await editorChainItemInsert(symbol, afterThisDraftId)
    setLoading(false)
  }

  const searcher: SearcherProps['searcher'] = {
    searchRange: 'symbol',
    onClickSymbolCreate: symbol => insert(symbol),
    onClickHit: hit => insert(hit.str),
  }

  if (loading) {
    return <div>Loading</div>
  }
  return (
    <div className="mt-4">
      <SearcherModal searcher={searcher} />
    </div>
  )
}

export default ChainItemInsertButton
