//
// Page props
//
//
//
//
//
//

import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../apollo/query.graphql'

export interface AppPageProps {
  initialApolloState?: any
  protected?: true
  sidebarPinned?: boolean
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

  // If enabled, searcher will create the draft when click the hit
  createMode?: true
}

export interface NoteDocElProps {
  // The opening doc
  doc: NoteDocFragment

  note: NoteFragment

  noteDocsToMerge: NoteDocFragment[]
}
