import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Modal from '../../components/modal/modal'

import { Doc } from '../../components/workspace/doc'
import { workspace } from '../../components/workspace/workspace'
import LoginModal from '../../components/login-modal'
import NoteMetaModal from '../../components/note-meta-modal'
import AuthItem from '../../components/sidebar/_auth-Item'
import { NoteTemplate } from '../../components/note-template'
import { EditorEl } from '../../components/block-editor/src/components/editor/editor-el'
import { editorRouteUpdate } from '../../components/block-editor/src/events'
import { Layout } from '../../components/ui-component/layout'

const NoteSymbolPage = (): JSX.Element | null => {
  const router = useRouter(),
    { symbol } = router.query

  useEffect(() => {
    if (typeof symbol === 'string' && router) {
      editorRouteUpdate({ mainSymbol: symbol, router })
    }
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
        <EditorEl />
      </Layout>
      {/* <DiscussModal /> */}
    </>
  )
}

export default NoteSymbolPage
