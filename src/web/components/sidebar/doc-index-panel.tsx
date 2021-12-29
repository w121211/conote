import { useApolloClient } from '@apollo/client'
import React from 'react'
import { useObservable } from 'rxjs-hooks'
import { workspace } from '../workspace/workspace'
import { TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Doc } from '../workspace/doc'
import { DocIndex } from '../workspace/doc-index'

const DocIndexPanel = ({ node }: { node: TreeNode<DocIndex> }) => {
  const client = useApolloClient()
  const mainDoc = useObservable(() => workspace.mainDoc$)
  return (
    <div className="hidden group-hover:flex items-center gap-2 ">
      {TreeService.isRoot(node) && (
        <button
          className="btn-reset-style"
          onClick={async () => {
            await workspace.commit(node, client) // commit node-doc and all of its child-docs
          }}
        >
          <span className="material-icons-outlined text-xl text-gray-500">cloud_upload</span>
        </button>
      )}
      <button
        className="btn-reset-style"
        onClick={async () => {
          if (node.children.length > 0) {
            console.warn('will remove all sub docs')
          } else {
            await Doc.removeDoc(node.cid)
            await workspace.updateEditingDocIndicies()
          }
        }}
      >
        <span className="material-icons-outlined text-xl text-gray-500">delete_forever</span>
      </button>
    </div>
  )
}
export default DocIndexPanel
