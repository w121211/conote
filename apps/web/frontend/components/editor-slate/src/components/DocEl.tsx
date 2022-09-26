import React, { useEffect, useState } from 'react'
import { parseGQLBlocks } from '../../../../../share/utils'
import { slateDocSave } from '../events'
import { blocksToIndenters } from '../indenter/serializers'
import { toast } from 'react-toastify'
import { interval, skip } from 'rxjs'
import EditorEl from './EditorEl'
import Link from 'next/link'
import { getNotePageURL } from '../../../../utils'
import { DocElProps } from '../../../../interfaces'
import DocElHead from './DocElHead'
import DocElAlertList from './DocElAlertList'
import { IndenterFormatError } from '../indenter/normalizers'

/**
 * A local save doc function, include error handling
 */
async function saveDoc(docUid: string, docSymbol: string) {
  try {
    await slateDocSave(docUid)
  } catch (err) {
    if (err instanceof IndenterFormatError) {
      toast.error(
        <div>
          Draft {docSymbol} cannot be saved. Please fix the indentation error.
        </div>,
      )
    } else {
      throw err
    }
  }
}

const DocEl = (props: DocElProps) => {
  const { doc } = props
  const [showPreview, setShowPreview] = useState(false)
  const { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
    { blocks } = parseGQLBlocks(gqlBlocks),
    [rootIndenter, ...bodyIndenters] = blocksToIndenters(blocks)

  // console.log(bodyIndenters)

  useEffect(() => {
    const interval$ = interval(30000),
      sub = interval$
        .pipe(skip(1))
        .subscribe(() => saveDoc(doc.uid, doc.noteDraftCopy.symbol))

    return () => {
      sub.unsubscribe()

      // When the doc is committed or deleted, it will trigger the component unmount and thus throws 'doc not found' error
      saveDoc(doc.uid, doc.noteDraftCopy.symbol).catch(err =>
        console.debug(err),
      )
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
      className="border border-gray-200 rounded px-12 pt-8 pb-24"
    >
      <div className="mb-4">
        <DocElAlertList {...props} />
      </div>

      <div className="pb-4">
        <button
          className={
            showPreview
              ? 'px-2 py-1 inline-flex justify-center items-center gap-1 rounded-md text-sm text-white border border-transparent bg-blue-500 hover:bg-blue-600'
              : 'px-2 py-1 inline-flex justify-center items-center gap-1 rounded-md text-sm text-gray-500 border border-transparent hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white'
          }
          onClick={() => setShowPreview(!showPreview)}
        >
          <span className="material-icons-outlined text-sm">adjust</span>
          Preview
        </button>

        {doc.noteCopy && (
          <Link href={getNotePageURL(doc.noteCopy.sym.symbol)}>
            <a className="px-2 py-1 inline-flex justify-center items-center gap-1 rounded-md text-sm text-gray-500 border border-transparent hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:hover:bg-slate-800 dark:border-gray-700 dark:text-gray-400 dark:hover:text-white">
              <span className="material-icons-outlined text-sm">
                north_east
              </span>
              Head
            </a>
          </Link>
        )}
      </div>
      {/* <button onClick={() => saveDoc(doc.uid)}>Save</button> */}

      <DocElHead doc={doc} />
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
