//
// Page props
//
//
//
//
//
//

export type AppPageProps = {
  protected?: true
}

//
// Component props (in sharing)
//
//
//
//
//
//

export interface SearcherProps {
  searcher: {
    // TODO: Not support 'all' yet
    searchRange: 'all' | 'symbol'

    // If provide, the hit will be a button instead of a link
    onClickHit?: (hit: { str: string; id: string }) => void

    // If provide, the symbol-create will be a button instead of a link
    onClickSymbolCreate?: (symbol: string) => void
  }
}
