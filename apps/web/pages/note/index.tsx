import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '../../layout/layout'
// import { useNoteLazyQuery } from '../../apollo/query.graphql'

export function NoteIndexPage(): JSX.Element {
  return (
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
      <h1>Start a new note!</h1>
    </Layout>
  )
}

export default NoteIndexPage
