import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../../apollo/query.graphql'
import { EditorEl } from '../editor-textarea/src/components/editor/editor-el'
import { editorOpenSymbolInMain } from '../editor-textarea/src/events'
import NoteDocVersionDropdown from './note-doc-version-dropdown'
import { useMeContext } from '../auth/use-me-context'
import { LayoutChildrenPadding } from '../ui-component/layout/layout-children-padding'
import { StatusDisplay } from '../ui-component/status-display'
import { preventExitWithoutSave } from '../editor-textarea/src/listeners'
import { getLoginPageURL } from '../../utils'
import NoteAlerts from './note-alerts'

/**
 * Loads the given draft or open a blank note in the editor
 */
const NoteEditEl = ({
  symbol,
  note,
  noteDraft,
  noteDocsToMerge,
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
    window.addEventListener('beforeunload', preventExitWithoutSave)
    return () =>
      window.removeEventListener('beforeunload', preventExitWithoutSave)
  }, [])

  if (loading) {
    return null
  }
  if (me === null) {
    return (
      // <div>
      //   Start editing {symbol}
      //   <div className="w-[200px] py-8 text-center">Login require</div>
      //   <button className="btn-primary">
      //     <Link
      //       href={{ pathname: '/login', query: { from: location.pathname } }}
      //     >
      //       <a>Login</a>
      //     </Link>
      //   </button>
      // </div>
      <StatusDisplay
        str="Login require"
        btn={
          <Link href={getLoginPageURL()}>
            <a className="btn-primary-lg font-medium text-lg">Login</a>
          </Link>
        }
      />

      // <div>
      //   Start editing {symbol}
      //   <div className="w-[200px] py-8 text-center">Login require</div>
      //   <button className="btn-primary">
      //     <Link href="/login">
      //       <a>Login</a>
      //     </Link>
      //   </button>
      // </div>
    )
  }
  return (
    <LayoutChildrenPadding>
      <div className="pb-32">
        {noteDraft && noteDocsToMerge && (
          <NoteAlerts
            cur={noteDraft}
            note={note}
            noteDocsToMerge={noteDocsToMerge}
          />
        )}
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
