import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  NoteDocFragment,
  NoteDraftFragment,
  NoteFragment,
} from '../../apollo/query.graphql'
import { EditorEl } from '../block-editor/src/components/editor/editor-el'
import Layout from '../ui-component/layout'
import { editorOpenSymbolInMain } from '../block-editor/src/events'
import NoteDocVersionDropdown from './note-doc-version-dropdown'
import LoginModal from '../login-modal'
import { useMe } from '../auth/use-me'

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
  const { me, loading } = useMe()
  if (!loading && !me) {
    router.push('/login')
  }
  useEffect(() => {
    // Call this method only when symbol changed
    editorOpenSymbolInMain(symbol, router)
  }, [symbol])

  // const onUnload = (e: BeforeUnloadEvent) => {
  //   e.preventDefault()
  //   // if (mainDoc?.doc) {
  //   //   // workspace.save(mainDoc.doc)
  //   //   console.log('save')
  //   //   workspace.save(mainDoc.doc)
  //   //   // return 'save'
  //   // }
  //   // console.log(router)
  //   // if () {
  //   //   // return null
  //   // }
  //   e.returnValue = 'leave'
  //   return 'leave'
  //   // return null
  // }

  // useEffect(() => {
  //   window.addEventListener('beforeunload', onUnload)
  //   return () => window.removeEventListener('beforeunload', onUnload)
  // }, [])

  return (
    <>
      <Layout>
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
      </Layout>
    </>
  )
}

export default NoteEditEl
