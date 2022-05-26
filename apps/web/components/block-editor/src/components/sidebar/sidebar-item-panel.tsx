import { useApolloClient } from '@apollo/client'
import { isTreeNode, TreeNode } from '@conote/docdiff'
import { useRouter } from 'next/router'
import { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'

const DocIndexPanel = ({ item }: { item: NoteDraftEntryFragment }) => {
  const router = useRouter()
  const client = useApolloClient()
  const commitButton =
    isTreeNode(item) && TreeService.isRoot(item) ? (
      <button
        className=" px-[2px]"
        onClick={async () => {
          await workspace.commit(item, client) // commit item-doc and all of its child-docs
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
      {/* {TreeService.isRoot(item) && (
        <button
          className=""
          onClick={async () => {
            await workspace.commit(item, client) // commit item-doc and all of its child-docs
          }}
        >
          <span className="material-icons-outlined text-xl text-gray-500">cloud_upload</span>
        </button>
      )} */}
      <button
        className=" px-[2px] !pointer-events-auto disabled:bg-transparent disabled:!cursor-not-allowed text-gray-400 disabled:text-gray-300 hover:text-gray-500 
        hover:disabled:text-gray-300"
        onClick={async e => {
          // if (item.data?.symbol === router.query.symbol) {
          //   e.preventDefault()
          //   return
          // }
          await Doc.removeDoc(item.cid)
          await workspace.updateEditingDocIndicies()
        }}
        disabled={item.data?.symbol === router.query.symbol}
      >
        <span className="material-icons-outlined text-xl  mix-blend-multiply">
          delete_forever
        </span>
      </button>
    </div>
  )
}
export default DocIndexPanel
