import React, { useCallback, useEffect, useMemo, useState } from 'react'
// import {
//   NoteDraftEntryFragment,
//   useCreateCommitMutation,
//   useMyNoteDraftEntriesQuery,
// } from '../../../../../apollo/query.graphql'
// import { commitOnFinish } from '../../events'

// /**
//  *
//  */
// const CommitForm = ({
//   draftEntries,
// }: {
//   draftEntries: NoteDraftEntryFragment[]
// }) => {
//   const [createCommit, { data, loading, error }] = useCreateCommitMutation({
//     onCompleted: data => {
//       commitOnFinish(draftEntries, data.createCommit.noteDocs)

//       // TODO: Redirect to commit page
//     },
//   })

//   const { checkedDrafts, checkBoxForm } = makeSelectForm(draftEntries)

//   if (loading) {
//     return null
//   }
//   if (error) {
//     throw error
//   }
//   if (data === undefined) {
//     throw new Error('data === undefined')
//   }
//   return (
//     <>
//       {checkBoxForm}

//       {checkedDrafts}

//       <button
//         onClick={e => {
//           createCommit({
//             variables: { noteDraftIds: draftEntries.map(e => e.id) },
//           })
//         }}
//       >
//         Commit
//       </button>
//     </>
//   )
// }

// /**
//  *
//  */
// export const CommitPanel = (): JSX.Element | null => {
//   const { data, loading, error } = useMyNoteDraftEntriesQuery()

//   if (loading) {
//     return null
//   }
//   if (error) {
//     throw error
//   }
//   if (data === undefined) {
//     throw new Error('data === undefined')
//   }
//   return (
//     <div>
//       <CommitForm draftEntries={data.myNoteDraftEntries} />
//     </div>
//   )
// }
