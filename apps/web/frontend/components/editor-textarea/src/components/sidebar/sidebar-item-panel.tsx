import { ApolloError } from '@apollo/client'
import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import { toast } from 'react-toastify'
import type { NoteDraftEntryFragment } from '../../../../../../apollo/query.graphql'
import { CommitInputErrorItem } from '../../../../../../lib/interfaces'
import {
  getCommitInputErrorItems,
  getCommitPageURL,
} from '../../../../../utils'
import { editorChainCommit, editorChainItemRemove } from '../../events'
import { editorRepo } from '../../stores/editor.repository'

const CommitInputErrorMsg = ({
  items,
  entries,
}: {
  items: CommitInputErrorItem[]
  entries: NoteDraftEntryFragment[]
}) => {
  const items_ = items.map(e => {
    const entry = entries.find(a => a.id === e.draftId)
    if (entry === undefined)
      throw new Error('Unexpected error: entry === undefined')
    return { ...e, ...entry }
  })
  return (
    <div>
      {items_.map(e => (
        <div key={e.draftId}>
          {e.symbol} - {e.msg}
        </div>
      ))}
    </div>
  )
}

const SidebarItemPanel = ({ item }: { item: NoteDraftEntryFragment }) => {
  const router = useRouter()

  async function commitChain() {
    const { chains } = editorRepo.getValue(),
      entries = editorRepo.getChainEntries(chains, item.id)

    try {
      const commit = await editorChainCommit(item.id)
      router.push(getCommitPageURL(commit.id))
    } catch (err) {
      if (err instanceof ApolloError) {
        const items = getCommitInputErrorItems(err)
        if (items) {
          toast.error(<CommitInputErrorMsg items={items} entries={entries} />)
          return
        }
      }
      throw err
    }
  }

  return (
    <div className=" hidden group-hover:flex items-center z-10">
      {isNil(item.meta.chain?.prevId) ? (
        <button className="flex px-[2px]" onClick={() => commitChain()}>
          <span className="material-icons-outlined text-xl leading-none text-gray-400 hover:text-gray-500 mix-blend-multiply">
            cloud_upload
          </span>
        </button>
      ) : null}
      <button
        className="flex-1 flex px-[2px] !pointer-events-auto disabled:bg-transparent disabled:!cursor-not-allowed text-gray-400 disabled:text-gray-300 hover:text-gray-500 
        hover:disabled:text-gray-300"
        onClick={async e => {
          e.stopPropagation()
          e.preventDefault()
          await editorChainItemRemove(item)
        }}
      >
        <span className="material-icons-outlined text-xl leading-none mix-blend-multiply">
          delete_forever
        </span>
      </button>
    </div>
  )
}
export default SidebarItemPanel
