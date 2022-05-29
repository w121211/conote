import React from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import Modal from '../../../../modal/modal'
import { editorRouteUpdate } from '../../events'
import { editorRepo } from '../../stores/editor.repository'
import { DocEl } from '../doc/doc-el'
import { useRouter } from 'next/router'

/**
 * Open a modal-doc is triggered by 'editorRouteUpdate' event,
 * while open a main-doc should be triggered outside this editor.
 *
 * Assign mainDoc/modalDoc as null initially
 * - if doc === 'null' -> is loading,
 * - if doc === 'undefined' -> loading finished and doc is not found,
 *   this is happened when current main doc is dropped
 */
export const EditorEl = (): JSX.Element | null => {
  const router = useRouter(),
    [alert] = useObservable(editorRepo.alter$),
    [mainDoc] = useObservable(editorRepo.mainDoc$, { initialValue: null }),
    [modalDoc] = useObservable(editorRepo.modalDoc$, { initialValue: null })

  // useEffect(() => {
  //   console.log('mainDoc', mainDoc)
  //   console.log('modalDoc', modalDoc)
  // }, [mainDoc, modalDoc])

  if (mainDoc === undefined) {
    return (
      <h1>
        Editor-el without doc (happened when doc is dropped), search-panel goes
        here
      </h1>
    )
  }

  return (
    <>
      {alert && <div>{alert.message}</div>}

      {mainDoc && <DocEl doc={mainDoc} />}

      <Modal
        // topLeftBtn={
        //   <Link
        //     href={{
        //       pathname: '/note/[symbol]',
        //       query: { symbol: modalSymbol },
        //     }}
        //   >
        //     <a className="flex items-center p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
        //       <span className="material-icons text-lg leading-none">
        //         open_in_full
        //       </span>
        //     </a>
        //   </Link>
        // }
        // topRightBtn={
        //   <div className="flex ">
        //     {modalDoc?.doc && <NoteMetaModal doc={modalDoc.doc} modal />}
        //     {/* <button className=" text-gray-500 hover:text-gray-700">
        //       <span className="material-icons text-lg leading-none ">edit_note</span>
        //     </button> */}
        //     <button className=" p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
        //       <span className="material-icons-outlined text-lg leading-none ">
        //         category
        //       </span>
        //     </button>
        //     <button className=" p-1 rounded text-gray-500 hover:text-gray-700 hover:bg-gray-100">
        //       <span className="material-icons-outlined text-lg leading-none ">
        //         more_horiz
        //       </span>
        //     </button>
        //   </div>
        // }

        visible={modalDoc !== undefined && modalDoc !== null}
        onClose={() => editorRouteUpdate({ modalSymbol: null, router })}

        // visible={modalSymbol !== null}
        // onClose={async () => {
        //   if (mainDoc?.doc && modalDoc?.doc) {
        //     if (modalDoc.doc.getChanges().length > 0) {
        //       // console.log(modalDoc.doc.getChanges())
        //       // TODO: strictly check if doc is truly updated
        //       if ((await Doc.find({ cid: mainDoc.doc.cid })) === null) {
        //         await workspace.save(mainDoc.doc) // ensure main-doc also save
        //       }
        //       await workspace.save(modalDoc.doc)
        //       workspace.closeDoc({ isModal: true }) // close doc to prevent component rerender
        //     }
        //   }
        //   router.push({
        //     pathname: router.pathname,
        //     query: { symbol: router.query.symbol },
        //   })
        // }}
      >
        {modalDoc && <DocEl doc={modalDoc} />}
      </Modal>
    </>
  )
}
