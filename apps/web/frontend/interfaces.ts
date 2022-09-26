import { NoteDocFragment, NoteFragment } from '../apollo/query.graphql'
import { Doc } from './components/editor-textarea/src/interfaces'

//
// Page props (for sharing)
// Used to avoid cyclic import
//
//
//
//
//

export interface AppPageProps {
  initialApolloState?: any
  protected?: true
  sidebarPinned?: boolean
}

//
// Component props (for sharing components)
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

export interface DocElProps {
  doc: Doc
}

export interface NoteDocElProps {
  // The opening doc
  doc: NoteDocFragment

  note: NoteFragment

  noteDocsToMerge: NoteDocFragment[]
}
