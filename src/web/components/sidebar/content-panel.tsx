import { useApolloClient } from '@apollo/client'
import React from 'react'
import { useObservable } from 'rxjs-hooks'
import { workspace } from '../workspace/workspace'

const ContentPanel = () => {
  const client = useApolloClient()
  const mainDoc = useObservable(() => workspace.mainDoc$)
  return (
    <div className="hidden group-hover:flex items-center gap-2 ">
      <button className="btn-reset-style">
        <span
          className="material-icons-outlined text-xl text-gray-500"
          onClick={async () => {
            if (mainDoc === null) {
              return
            }
            if (mainDoc.doc) {
              await workspace.commit(mainDoc.doc, client)
              // router.reload()
            }
          }}
        >
          cloud_upload
        </span>
      </button>
      <button className="btn-reset-style">
        <span
          className="material-icons-outlined text-xl text-gray-500"
          onClick={() => {
            workspace.drop()
          }}
        >
          delete_forever
        </span>
      </button>
    </div>
  )
}
export default ContentPanel
