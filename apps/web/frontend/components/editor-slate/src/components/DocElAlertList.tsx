import React from 'react'
import { DocElProps } from '../../../../interfaces'

enum AlertCode {
  // DOC_THIS_WAIT_MERGE,
  // DOCS_WAIT_MERGE,
  FROM_DOC_NOT_HEAD,
  // RETURN_TO_TEMPLATE,
}

function getAlertCodes({ doc }: DocElProps): AlertCode[] {
  const { noteDraftCopy, noteCopy } = doc
  const codes: AlertCode[] = []

  if (noteCopy && noteDraftCopy.fromDocId !== noteCopy.headDoc.id) {
    codes.push(AlertCode.FROM_DOC_NOT_HEAD)
  }
  // if (doc.meta.mergeState === 'wait_to_merge-by_poll') {
  //   codes.push(AlertCode.DOC_THIS_WAIT_MERGE)
  // }
  // if (isHeadDoc && noteDocsToMerge.length > 0) {
  //   codes.push(AlertCode.DOCS_WAIT_MERGE)
  // }

  return codes
}

function renderAlert({
  code,
}: DocElProps & {
  code: AlertCode
}) {
  switch (code) {
    // case AlertCode.DOC_THIS_WAIT_MERGE:
    //   // const waitingDocs = noteDocsToMerge.filter(e => e.id !== cur.id)
    //   return (
    //     <Alert type="announce">
    //       <p>
    //         <span className="material-icons-outlined mr-1 text-base align-middle">
    //           merge
    //         </span>
    //         This doc is requesting to merge.{' '}
    //         <button
    //           className="link"
    //           onClick={() => setShowMergePollModal(true)}
    //         >
    //           See ongoing poll
    //         </button>
    //       </p>
    //     </Alert>
    //   )

    // case AlertCode.DOCS_WAIT_MERGE: {
    //   // const waitingDocs = noteDocsToMerge.filter(e => e.id !== cur.id)
    //   return (
    //     <Alert type="announce">
    //       <p>
    //         <span className="material-icons-outlined mr-1 text-base align-middle">
    //           merge
    //         </span>
    //         {/* <span>Waititing to merge, see the </span> */}
    //         {noteDocsToMerge.map((e, i) => (
    //           <>
    //             <Link key={e.id} href={getNotePageURL(e.symbol, e.id)}>
    //               <a className="link">{`${e.symbol}#${e.id.slice(-6)}`}</a>
    //             </Link>
    //             {i + 1 < noteDocsToMerge.length && ', '}
    //           </>
    //         ))}
    //         <span>
    //           {' '}
    //           {noteDocsToMerge.length > 1 ? 'are' : 'is'} requesting to merge.
    //         </span>
    //       </p>
    //     </Alert>
    //   )
    // }

    case AlertCode.FROM_DOC_NOT_HEAD:
      return (
        <div className="bg-gray-100 border rounded p-3" role="alert">
          <div className="flex">
            <div className="flex-1 md:flex md:justify-between ml-2">
              <p className="text-sm text-gray-700">
                <span className="font-bold">Warning!</span> Current draft is
                behind the head.
              </p>
              {/* <p className="text-sm text-gray-700 md:mt-0 md:ml-6">
                <a
                  className="hover:underline font-bold whitespace-nowrap"
                  href="#"
                >
                  How to fix?
                </a>
              </p> */}
            </div>
          </div>
        </div>
      )
    // case AlertCode.RETURN_TO_TEMPLATE:
    //   return (
    //     <div className="bg-gray-100 border rounded p-3" role="alert">
    //       <div className="flex">
    //         <div className="flex-1 md:flex md:justify-between ml-2">
    //           <p className="text-sm text-gray-700">
    //             <span className="font-bold">[Info]</span>&nbsp;&nbsp;Go back to{' '}
    //             <button className="link">template</button>.
    //           </p>
    //           <p className="text-sm text-gray-700 md:mt-0 md:ml-6">
    //             <button className="hover:underline whitespace-nowrap">
    //               Close
    //             </button>
    //           </p>
    //         </div>
    //       </div>
    //     </div>
    //   )
  }
}

/**
 * TODO
 * - [] Remember user's action?
 */
const DocElAlertList = (props: DocElProps) => {
  const codes = getAlertCodes(props)
  // const codes = [AlertCode.FROM_DOC_NOT_HEAD, AlertCode.RETURN_TO_TEMPLATE]

  return (
    <div className="flex flex-col gap-3">
      {codes.map((code, i) => (
        <div key={i}>{renderAlert({ code, ...props })}</div>
      ))}
    </div>
  )
}

export default DocElAlertList
