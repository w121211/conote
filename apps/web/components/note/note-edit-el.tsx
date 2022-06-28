import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../apollo/query.graphql'
import { EditorEl } from '../block-editor/src/components/editor/editor-el'
import { editorOpenSymbolInMain } from '../block-editor/src/events'
import NoteDocVersionDropdown from './note-doc-version-dropdown'
import { useMeContext } from '../auth/use-me-context'
import { LayoutChildrenPadding } from '../ui-component/layout/layout-children-padding'
import { StatusDisplay } from '../ui-component/status-display'
import { preventSave } from '../block-editor/src/listeners'

/**
 * Loads the given draft or open a blank note in the editor
 */
const NoteEditEl = ({
  symbol,
  note,
  noteDraft,
}: {
  symbol: string
  note: NoteFragment | null
  noteDraft: NoteDraftFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const router = useRouter()
  const { me, loading } = useMeContext()
  // const handlerRef = useRef(handler)

  useEffect(() => {
    if (me) {
      // Call this method only when symbol changed
      editorOpenSymbolInMain(symbol, router)
    }
  }, [me, symbol])

  useEffect(() => {
    window.addEventListener('beforeunload', preventSave)
    return () => window.removeEventListener('beforeunload', preventSave)
  }, [])

  if (loading) {
    return null
  }
  if (me === null) {
    return (
      <StatusDisplay
        str="Login require"
        btn={
          <button className="btn-primary-lg font-medium text-lg">
            <Link
              href={{ pathname: '/login', query: { from: location.pathname } }}
            >
              <a>Login</a>
            </Link>
          </button>
        }
      />
    )
  }
  return (
    <LayoutChildrenPadding>
      <div className="pb-32">
        <div className="flex">
          <div className="flex-1">Editing</div>
          {note && (
            // <Link href={getNotePageURL('view', note.sym.symbol)}>
            //   <a>View</a>
            // </Link>
            <NoteDocVersionDropdown
              cur={noteDraft}
              note={note}
              noteDraft={noteDraft}
            />
          )}
        </div>
        <EditorEl />
      </div>
    </LayoutChildrenPadding>
  )
}

export default NoteEditEl
