import React, { useEffect, useState } from 'react'
import { editorChainsRefresh } from '../editor-textarea/src/events'
import Modal from '../modal/modal'
import { editorRepo } from '../editor-textarea/src/stores/editor.repository'
import { useObservable } from '@ngneat/react-rxjs'
import SidebarItemChain from '../sidebar/sidebar-item-chain'

// const CommitFormModal = () => {
//   const router = useRouter()
//   const [showModal, setShowModal] = useState(false)
//   const qMyDrafts = useMyNoteDraftEntriesQuery()

//   if (qMyDrafts.loading) return null
//   if (qMyDrafts.data === undefined)
//     throw new Error('qMyDrafts.data === undefined')

//   const editingEntries = qMyDrafts.data.myNoteDraftEntries.filter(
//     e => e.status === 'EDIT',
//   )

//   function onMutationCompleted(data: CreateCommitMutation) {
//     setShowModal(false)
//     router.push(`/commit/${data.createCommit.id}`)
//   }

//   return (
//     <div>
//       <button className="btn-primary text-sm" onClick={e => setShowModal(true)}>
//         Commit
//       </button>

//       <Modal
//         sectionClassName=""
//         visible={showModal}
//         onClose={() => setShowModal(false)}
//       >
//         {editingEntries.length === 0 ? (
//           <div>No drafts to commit</div>
//         ) : (
//           <CommitForm
//             entries={editingEntries}
//             onMutationCompleted={onMutationCompleted}
//           />
//         )}
//       </Modal>
//     </div>
//   )
// }

const CommitSubmitModal = () => {
  const [showModal, setShowModal] = useState(false)
  const [chains] = useObservable(editorRepo.chains$, {
    initialValue: null,
  })

  useEffect(() => {
    editorChainsRefresh()
  }, [])

  if (chains === null) return null

  const chains_ = chains.map(e => {
    if (e.length === 0) throw new Error('Chain length is 0')
    return {
      first: e[0],
      rest: e.slice(1),
    }
  })

  return (
    <>
      <Modal
        // sectionClassName=""
        visible={showModal}
        onClose={() => setShowModal(false)}
      >
        <div className="mt-5 mb-10 mx-10">
          <h2 className="mb-2 text-2xl font-bold text-gray-600">Commit</h2>
          {chains_.map(({ first, rest }) => (
            <SidebarItemChain
              key={first.id}
              itemFirst={first}
              itemsRest={rest}
              onCommitCompleted={() => setShowModal(false)}
            />
          ))}
        </div>
      </Modal>

      <button className="btn-primary text-sm" onClick={e => setShowModal(true)}>
        Commit
      </button>
    </>
  )
}

export default CommitSubmitModal
