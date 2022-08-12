import React, { useMemo, useCallback, useEffect, useState } from 'react'
import { useObservable } from '@ngneat/react-rxjs'
import { parseGQLBlocks } from '../../../../../share/utils'
import { Doc } from '../../../editor-textarea/src/interfaces'
import { docTemplateGenerate, slateDocSave } from '../events'
import { docEditorValueRepo } from '../stores/doc-editor-value.repository'
import { blocksToIndenters, indentersToBlocks } from '../indenter/serializers'
import { toast } from 'react-toastify'
import { interval, skip } from 'rxjs'
import EditorEl from './EditorEl'
import Link from 'next/link'
import DocHead from '../../../editor-textarea/src/components/doc/doc-head'
import { docRepo } from '../../../editor-textarea/src/stores/doc.repository'
import BlocksViewer from '../../../editor-textarea/src/components/block/blocks-viewer'
import { getNotePageURL } from '../../../../utils'

/**
 * A local save doc function, include error handling
 */
async function saveDoc(docUid: string) {
  try {
    await slateDocSave(docUid)
  } catch (err) {
    if (err instanceof Error && err.message === 'indent_oversize') {
      toast.error(
        <div>
          The draft cannot be saved. Please fix the indentation error(s).
        </div>,
      )
    } else {
      throw err
    }
  }
}

const DocEl = (props: { doc: Doc }) => {
  const { doc } = props
  const [showPreview, setShowPreview] = useState(false)
  const { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
    { blocks } = parseGQLBlocks(gqlBlocks),
    [rootIndenter, ...bodyIndenters] = blocksToIndenters(blocks)

  // console.log(bodyIndenters)

  useEffect(() => {
    const interval$ = interval(30000),
      sub = interval$.pipe(skip(1)).subscribe(() => saveDoc(doc.uid))

    return () => {
      sub.unsubscribe()

      // When the doc is committed or deleted, it will trigger the component unmount and thus throws 'doc not found' error
      saveDoc(doc.uid).catch(err => console.debug(err))
    }
  }, [])

  // useEffect(() => {
  //   if (docValue !== undefined) {
  //     editorChainItemSetRendered(doc.uid)
  //   }
  // }, [docValue])

  // if (docValue === undefined) return null

  // return (
  //   <div>
  //     <EditorEl
  //       docUid={doc.uid}
  //       draftId={doc.noteDraftCopy.id}
  //       initialValue={bodyIndenters}
  //     />
  //     {/* <button onClick={() => saveDoc(doc.uid)}>Save</button> */}
  //   </div>
  // )
  return (
    <div
      id={doc.uid}
      // className="bg-gray-100 rounded-lg p-5"
    >
      <div className="py-3">
        {!showPreview ? (
          <button
            className="px-2 py-1 inline-flex justify-center items-center gap-1 rounded-md text-sm text-gray-500 font-normal align-middle hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            onClick={() => setShowPreview(!showPreview)}
          >
            <span className="material-symbols-outlined text-sm">adjust</span>
            Preview
          </button>
        ) : (
          <button
            className="px-3 py-1 inline-flex justify-center items-center gap-1 rounded-md text-gray-500 text-sm font-normal align-middle hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800"
            onClick={() => setShowPreview(!showPreview)}
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit
          </button>
        )}

        {doc.noteCopy && (
          <Link href={getNotePageURL(doc.noteCopy.sym.symbol)}>
            <a className="px-2 py-1 inline-flex justify-center items-center gap-1 rounded-md text-sm text-gray-500 font-normal align-middle hover:bg-gray-100 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-blue-600 dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white dark:focus:ring-offset-gray-800">
              <span className="material-symbols-outlined text-sm">
                north_east
              </span>
              Head
            </a>
          </Link>
        )}
      </div>
      {/* <button onClick={() => saveDoc(doc.uid)}>Save</button> */}
      <DocHead doc={doc} />
      {/* {showPreview ? (
        <DocBodyPreview docUid={doc.uid} />
      ) : (
        <EditorEl
          docUid={doc.uid}
          draftId={doc.noteDraftCopy.id}
          initialValue={bodyIndenters}
          preview={showPreview}
        />
      )} */}
      <EditorEl
        docUid={doc.uid}
        draftId={doc.noteDraftCopy.id}
        initialValue={bodyIndenters}
        preview={showPreview}
      />
    </div>
  )
}

export default DocEl
