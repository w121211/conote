import React, { useState } from 'react'
import { useMyNoteDraftsExportLazyQuery } from '../../../apollo/query.graphql'

/**
 * When click button, server side will prepare user's own note drafts and respond the exported file url.
 * Then a download link show up.
 * Button for export user's own note docs.
 */
const MyNoteDraftsExportEl = () => {
  const [myNoteDraftsExport, { data, error, loading }] =
    useMyNoteDraftsExportLazyQuery()
  const [isClickExport, setIsClickExport] = useState(false)

  if (error) {
    throw error
  }
  // if (data) {
  //   toast.info(
  //     <p>
  //       Export success.{' '}
  //       <a className="link" href="/">
  //         Download file
  //       </a>
  //     </p>,
  //     { autoClose: 6000, hideProgressBar: false },
  //   )
  // }
  return (
    <>
      <button
        className="btn-normal"
        onClick={() => {
          setIsClickExport(true)
          myNoteDraftsExport()
        }}
        disabled={isClickExport}
      >
        Export
      </button>

      {loading && (
        <span className="px-4">
          Preparing the export file. It takes a while...
        </span>
      )}

      {data && (
        <p>
          Export success.{' '}
          <a className="link" href={data.myNoteDraftsExport} download>
            Download file
          </a>
        </p>
      )}
    </>
  )
}

export default MyNoteDraftsExportEl
