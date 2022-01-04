import { useApolloClient } from '@apollo/client'
import { isTreeNode, NodeBody, TreeNode, TreeService } from '../../../packages/docdiff/src'
import { Doc } from '../workspace/doc'
import { DocIndex } from '../workspace/doc-index'
import { workspace } from '../workspace/workspace'

const DocIndexPanel = ({ node }: { node: TreeNode<DocIndex> | NodeBody<DocIndex> }) => {
  const client = useApolloClient()
  const commitButton =
    isTreeNode(node) && TreeService.isRoot(node) ? (
      <button
        className="btn-reset-style"
        onClick={async () => {
          await workspace.commit(node, client) // commit node-doc and all of its child-docs
        }}
      >
        <span className="material-icons-outlined text-xl text-gray-400 hover:text-gray-500">cloud_upload</span>
      </button>
    ) : null

  return (
    <div className="hidden group-hover:flex items-center gap-2 ">
      {/* <div className="group-hover:flex items-center gap-2 "> */}
      {commitButton}
      {/* {TreeService.isRoot(node) && (
        <button
          className="btn-reset-style"
          onClick={async () => {
            await workspace.commit(node, client) // commit node-doc and all of its child-docs
          }}
        >
          <span className="material-icons-outlined text-xl text-gray-500">cloud_upload</span>
        </button>
      )} */}
      <button
        className="btn-reset-style"
        onClick={async () => {
          await Doc.removeDoc(node.cid)
          await workspace.updateEditingDocIndicies()
        }}
      >
        <span className="material-icons-outlined text-xl text-gray-400 hover:text-gray-500">delete_forever</span>
      </button>
    </div>
  )
}
export default DocIndexPanel
