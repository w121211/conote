import { ApolloError } from '@apollo/client'
import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { toast } from 'react-toastify'
import type {
  CommitFragment,
  NoteDraftEntryFragment,
} from '../../../apollo/query.graphql'
import { getCommitInputErrorItems } from '../../utils'
import Spinner from '../ui/Spinner'
import {
  editorChainCommit,
  editorChainItemRemove,
} from '../editor-textarea/src/events'
import { editorRepo } from '../editor-textarea/src/stores/editor.repository'
import {
  IndenterFormatError,
  IndenterFormatErrorCode,
} from '../editor-slate/src/indenter/normalizers'
import CommitInputErrorMsg from '../commit/CommitInputErrorMsg'

type Props = {
  item: NoteDraftEntryFragment
  onCommitCompleted?: (data: CommitFragment) => void
}

const SidebarItemPanel = ({ item, onCommitCompleted }: Props) => {
  const router = useRouter(),
    [isCommting, setIsCommiting] = useState(false),
    [isDeleting, setIsDeleting] = useState(false)

  async function commitChain() {
    const { chains } = editorRepo.getValue(),
      entries = editorRepo.getChainEntries(chains, item.id)

    try {
      setIsCommiting(true)

      const commit = await editorChainCommit(item.id)

      if (onCommitCompleted) onCommitCompleted(commit)

      router.push({
        pathname: '/user/commits/[userid]',
        query: { userid: commit.userId },
      })
    } catch (err) {
      if (err instanceof IndenterFormatError) {
        switch (err.code) {
          case IndenterFormatErrorCode.IndenterOverSize:
            toast.error(
              <p>
                Wrong indentation in , please fix Indentation before commit.
              </p>,
            )
            break
          default:
            throw err
        }
      } else if (err instanceof ApolloError) {
        const items = getCommitInputErrorItems(err)
        if (items) {
          toast.error(<CommitInputErrorMsg items={items} entries={entries} />)
        } else {
          throw err
        }
      } else {
        throw err
      }
    } finally {
      setIsCommiting(false)
    }
  }

  return (
    <div className="hidden group-hover:flex items-center z-10">
      {isNil(item.meta.chain?.prevId) &&
        (isCommting ? (
          // <Spinner svgClassName="w-5 h-5 mr-2 !text-white" />
          <Spinner />
        ) : (
          <button className="flex px-[2px]" onClick={() => commitChain()}>
            <span className="material-icons-outlined text-xl leading-none text-gray-400 hover:text-gray-500 mix-blend-multiply">
              cloud_upload
            </span>
          </button>
        ))}

      {isDeleting ? (
        // <Spinner svgClassName="w-5 h-5 mr-2 !text-white" />
        <Spinner />
      ) : (
        <button
          className="flex-1 flex px-[2px] !pointer-events-auto disabled:bg-transparent disabled:!cursor-not-allowed text-gray-400 disabled:text-gray-300 hover:text-gray-500 
        hover:disabled:text-gray-300"
          onClick={async e => {
            e.stopPropagation()
            e.preventDefault()
            setIsDeleting(true)
            await editorChainItemRemove(item)
            setIsDeleting(false)
          }}
        >
          <span className="material-icons-outlined text-xl leading-none mix-blend-multiply">
            delete_forever
          </span>
        </button>
      )}
    </div>
  )
}
export default SidebarItemPanel
