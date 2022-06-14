import { NoteDraftEntryFragment } from '../../../../../apollo/query.graphql'
import { editorLeftSidebarItemRemove } from '../../events'

const DocIndexPanel = ({ item }: { item: NoteDraftEntryFragment }) => {
  // const commitButton =
  //   isTreeNode(item) && TreeService.isRoot(item) ? (
  //     <button
  //       className=" px-[2px]"
  //       onClick={async () => {
  //         await workspace.commit(item, client) // commit item-doc and all of its child-docs
  //       }}
  //     >
  //       <span className="material-icons-outlined  text-xl text-gray-400 hover:text-gray-500 mix-blend-multiply">
  //         cloud_upload
  //       </span>
  //     </button>
  //   ) : null

  return (
    <div className=" hidden group-hover:flex items-center z-10">
      {/* {commitButton} */}
      <button
        className="flex-1 flex px-[2px] !pointer-events-auto disabled:bg-transparent disabled:!cursor-not-allowed text-gray-400 disabled:text-gray-300 hover:text-gray-500 
        hover:disabled:text-gray-300"
        onClick={async e => {
          e.stopPropagation()
          e.preventDefault()
          editorLeftSidebarItemRemove(item)
        }}
      >
        <span className="material-icons-outlined text-xl leading-none mix-blend-multiply">
          delete_forever
        </span>
      </button>
    </div>
  )
}
export default DocIndexPanel
