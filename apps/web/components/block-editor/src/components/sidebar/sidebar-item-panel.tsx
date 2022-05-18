import { useApolloClient } from '@apollo/client'
import { isTreeNode, TreeNode } from '@conote/docdiff'
import { useRouter } from 'next/router'

const DocIndexPanel = ({
  node,
}: {
  node: TreeNode<DocIndex> | NodeBody<DocIndex>
}) => {
  const router = useRouter()
  const client = useApolloClient()
  const commitButton =
    isTreeNode(node) && TreeService.isRoot(node) ? (
      <button
        className=" px-[2px]"
        onClick={async () => {
          await workspace.commit(node, client) // commit node-doc and all of its child-docs
        }}
      >
        <span className="material-icons-outlined  text-xl text-gray-400 hover:text-gray-500 mix-blend-multiply">
          cloud_upload
        </span>
      </button>
    ) : null

  return (
    <div className="hidden group-hover:flex items-center ">
      {/* <div className="group-hover:flex items-center gap-2 "> */}
      {commitButton}
      {/* {TreeService.isRoot(node) && (
        <button
          className=""
          onClick={async () => {
            await workspace.commit(node, client) // commit node-doc and all of its child-docs
          }}
        >
          <span className="material-icons-outlined text-xl text-gray-500">cloud_upload</span>
        </button>
      )} */}
      <button
        className=" px-[2px] !pointer-events-auto disabled:bg-transparent disabled:!cursor-not-allowed text-gray-400 disabled:text-gray-300 hover:text-gray-500 
        hover:disabled:text-gray-300"
        onClick={async e => {
          // if (node.data?.symbol === router.query.symbol) {
          //   e.preventDefault()
          //   return
          // }
          await Doc.removeDoc(node.cid)
          await workspace.updateEditingDocIndicies()
        }}
        disabled={node.data?.symbol === router.query.symbol}
      >
        <span className="material-icons-outlined text-xl  mix-blend-multiply">
          delete_forever
        </span>
      </button>
    </div>
  )
}
export default DocIndexPanel
