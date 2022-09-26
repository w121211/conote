import React from 'react'
import Link from 'next/link'
import type { NoteDocElProps } from '../../interfaces'
import { getNotePageURL } from '../../utils'

enum AlertCode {
  DOC_THIS_WAIT_MERGE,
  DOCS_WAIT_MERGE,
  FROM_DOC_NOT_HEAD,
}

function getAlertCodes({
  doc,
  note,
  noteDocsToMerge,
}: NoteDocElProps): AlertCode[] {
  const codes: AlertCode[] = []
  const isHeadDoc = doc.id === note.headDoc.id

  if (doc.fromDocId !== note.id) {
    codes.push(AlertCode.FROM_DOC_NOT_HEAD)
  }
  if (doc.meta.mergeState === 'wait_to_merge-by_poll') {
    codes.push(AlertCode.DOC_THIS_WAIT_MERGE)
  }
  if (isHeadDoc && noteDocsToMerge.length > 0) {
    codes.push(AlertCode.DOCS_WAIT_MERGE)
  }

  return codes
}

function renderAlert({
  code,
  noteDocsToMerge,
  setShowMergePollModal,
}: NoteDocElProps & {
  code: AlertCode
  setShowMergePollModal: React.Dispatch<React.SetStateAction<boolean>>
}) {
  switch (code) {
    case AlertCode.DOC_THIS_WAIT_MERGE:
      return (
        <div className="border rounded-md p-3" role="alert">
          <div className="flex">
            <div className="flex-1 md:flex md:justify-between ml-2">
              <p className="text-sm text-gray-700">
                <span className="font-bold">[Merge]</span>
                &nbsp;&nbsp;This doc is requesting to merge.
              </p>
              <p className="text-sm text-gray-700 md:mt-0 md:ml-6">
                <button
                  className="hover:underline font-bold whitespace-nowrap"
                  onClick={() => setShowMergePollModal(true)}
                >
                  See poll
                </button>
              </p>
            </div>
          </div>
        </div>
      )
    case AlertCode.DOCS_WAIT_MERGE: {
      return (
        <div className="border rounded-md p-3" role="alert">
          <div className="flex">
            <div className="flex-1 md:flex md:justify-between ml-2">
              <p className="text-sm text-gray-700">
                <span className="font-bold">[Merge]</span>
                &nbsp;&nbsp;
                {noteDocsToMerge.map((e, i) => (
                  <span key={e.id}>
                    <Link key={e.id} href={getNotePageURL(e.symbol, e.id)}>
                      <a className="link">{`${e.symbol}#${e.id.slice(-6)}`}</a>
                    </Link>
                    {i + 1 < noteDocsToMerge.length && ', '}
                  </span>
                ))}{' '}
                {noteDocsToMerge.length > 1 ? 'are' : 'is'} requesting to merge.
              </p>
              <p className="text-sm text-gray-700 md:mt-0 md:ml-6">
                {/* <a
                  className="hover:underline font-bold whitespace-nowrap"
                  href="#"
                >
                  Details
                </a> */}
              </p>
            </div>
          </div>
        </div>
      )
    }

    // case AlertCode.FROM_DOC_NOT_HEAD:
    //   return (
    //     <Alert
    //       type="warning"
    //     >
    //       The current viewing doc is not the head.
    //     </Alert>
    //   )
  }
}

/**
 * TODO
 * - [] Remember user's action?
 */
const NoteDocElAlerts = (
  props: NoteDocElProps & {
    setShowMergePollModal: React.Dispatch<React.SetStateAction<boolean>>
  },
) => {
  const codes = getAlertCodes(props)

  return (
    <div className="flex flex-col gap-2">
      {codes.map((code, i) => (
        <div key={i}>{renderAlert({ code, ...props })}</div>
      ))}
    </div>
  )
}

export default NoteDocElAlerts
