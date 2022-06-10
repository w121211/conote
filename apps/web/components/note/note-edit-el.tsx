import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isNil } from 'lodash'
import { NoteDocFragment, NoteFragment } from '../../apollo/query.graphql'
import { EditorEl } from '../block-editor/src/components/editor/editor-el'
import Layout from '../ui-component/layout'
import { docSave, editorOpenSymbolInMain } from '../block-editor/src/events'
import NoteHead from './note-head'
import { getNotePageURL } from './note-helpers'

/**
 * Loads the given draft or open a blank note in the editor
 */
const NoteEditEl = ({
  symbol,
  note,
  noteDocsToMerge,
}: {
  symbol: string
  note: NoteFragment | null
  noteDocsToMerge: NoteDocFragment[] | null
}) => {
  const router = useRouter()

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
      <Layout
        buttonRight={
          <>
            {/* {mainDoc?.doc && <NoteMetaModal doc={mainDoc.doc} />}
            {mainDoc?.doc?.noteCopy && (
              <div className="inline-block z-20">
                <HeaderNoteEmojis noteId={mainDoc.doc.noteCopy.id} />
              </div>
            )} */}

            {/* <button
              className=" p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-gray-700"
              onClick={() => {
                if (mainDoc?.doc) {
                  workspace.save(mainDoc.doc)
                }
              }}
            >
              <span className="material-icons-outlined text-xl leading-none ">
                save
              </span>
            </button>
            
            <button className=" p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
              <span className="material-icons-outlined text-xl leading-none ">
                more_horiz
              </span>
            </button> */}

            {/* <AuthItem /> */}
          </>
        }
      >
        {note && (
          <Link href={getNotePageURL('view', note.sym.symbol)}>
            <a>View</a>
          </Link>
        )}
        <EditorEl />
      </Layout>
    </>
  )
}

export default NoteEditEl
