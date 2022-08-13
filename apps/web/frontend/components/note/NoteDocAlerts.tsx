import Link from 'next/link'
import React, { useState } from 'react'
import { NoteDocElProps } from '../../interfaces'
import { getNotePageURL } from '../../utils'
import { Alert } from '../ui/alert'

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
  const codes: AlertCode[] = [],
    isHeadDoc = doc.id === note.headDoc.id

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
      // const waitingDocs = noteDocsToMerge.filter(e => e.id !== cur.id)
      return (
        <Alert type="announce">
          <p>
            <span className="material-icons-outlined mr-1 text-base align-middle">
              merge
            </span>
            This doc is requesting to merge.{' '}
            <button
              className="link"
              onClick={() => setShowMergePollModal(true)}
            >
              See ongoing poll
            </button>
          </p>
        </Alert>
      )

    case AlertCode.DOCS_WAIT_MERGE: {
      // const waitingDocs = noteDocsToMerge.filter(e => e.id !== cur.id)
      return (
        <Alert type="announce">
          <p>
            <span className="material-icons-outlined mr-1 text-base align-middle">
              merge
            </span>
            {/* <span>Waititing to merge, see the </span> */}
            {noteDocsToMerge.map((e, i) => (
              <>
                <Link key={e.id} href={getNotePageURL(e.symbol, e.id)}>
                  <a className="link">{`${e.symbol}#${e.id.slice(-6)}`}</a>
                </Link>
                {i + 1 < noteDocsToMerge.length && ', '}
              </>
            ))}
            <span>
              {' '}
              {noteDocsToMerge.length > 1 ? 'are' : 'is'} requesting to merge.
            </span>
          </p>
        </Alert>
      )
    }

    // case AlertCode.FROM_DOC_NOT_HEAD:
    //   return (
    //     <Alert
    //       type="warnning"
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
const NoteDocAlerts = (
  props: NoteDocElProps & {
    setShowMergePollModal: React.Dispatch<React.SetStateAction<boolean>>
  },
) => {
  const codes = getAlertCodes(props)

  return (
    <>
      {codes.map((code, i) => (
        <div key={i}>{renderAlert({ code, ...props })}</div>
      ))}
    </>
  )
}

export default NoteDocAlerts
