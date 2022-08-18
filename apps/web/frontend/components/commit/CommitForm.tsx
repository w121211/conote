import { ApolloError } from '@apollo/client'
// import React, { useEffect, useState } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import {
//   CreateCommitMutation,
//   NoteDraftEntryFragment,
//   useCreateCommitMutation,
// } from '../../../apollo/query.graphql'
// import type { CommitInputErrorItem } from '../../../lib/interfaces'
// import {
//   commitSuccessClean,
//   editorChainsRefresh,
// } from '../editor-textarea/src/events'
// import { styleSymbol } from '../ui/style-fc/style-symbol'
// import { getCommitInputErrorItems } from '../../utils'
// import { useObservable } from '@ngneat/react-rxjs'
// import { editorRepo } from '../editor-textarea/src/stores/editor.repository'

// type FormValue = {
//   // Selected draft ids
//   draftIds: string[]
//   // checkboxMirror: string[]
// }

// const CommitForm = ({
//   chains,
//   onMutationCompleted,
// }: {
//   chains: NoteDraftEntryFragment[][]
//   onMutationCompleted: (data: CreateCommitMutation) => void
// }) => {
//   const [createCommit] = useCreateCommitMutation({
//     onCompleted: data => {
//       commitSuccessClean(data.createCommit.noteDocs)
//       return onMutationCompleted(data)
//     },
//   })
//   const methods = useForm<FormValue>(),
//     {
//       register,
//       handleSubmit,
//       formState: { isSubmitting },
//     } = methods
//   const [errorItems, setErrorItems] = useState<
//     (CommitInputErrorItem & NoteDraftEntryFragment)[] | null
//   >(null)
//   const chains_ = chains.map(e => {
//     if (e.length === 0) throw new Error('Chain length is 0')
//     return { first: e[0], rest: e.slice(1) }
//   })

//   useEffect(() => {
//     editorChainsRefresh()
//   }, [])

//   async function onSubmit(value: FormValue, entries: NoteDraftEntryFragment[]) {
//     // console.log('checkbox', value.draftIds)
//     try {
//       await createCommit({
//         variables: { noteDraftIds: value.draftIds },
//       })
//     } catch (err) {
//       if (err instanceof ApolloError) {
//         const items = getCommitInputErrorItems(err)
//         if (items) {
//           const items_ = items.map(e => {
//             const entry = entries.find(a => a.id === e.draftId)
//             if (entry === undefined)
//               throw new Error('Unexpected error: entry === undefined')
//             return { ...e, ...entry }
//           })
//           setErrorItems(items_)
//           return
//         }
//       }
//       throw err
//     }
//   }

//   if (errorItems && errorItems.length > 0) {
//     return (
//       <div>
//         <div>Not able to commit</div>
//         <div>
//           {errorItems.map(e => (
//             <div key={e.draftId}>
//               {e.symbol} {e.code}
//             </div>
//           ))}
//         </div>
//       </div>
//     )
//   }

//   return (
//     <FormProvider {...methods}>
//       <div className="flex flex-col h-full py-6  ">
//         <div className="flex items-center mx-10 mb-3">
//           <h2 className={`my-0 text-gray-900`}>Commit</h2>
//           {/* <h2
//                 className={`text-3xl text-gray-900 transition-[transform,opacity] delay-150 ${
//                   isSubmitSuccessful
//                     ? 'translate-x-0 opacity-100 visible '
//                     : 'translate-x-10 opacity-0 w-0 h-0 overflow-hidden invisible '
//                 }`}
//               >
//                 Commit Success! #id
//               </h2> */}
//           {/* <DomainSelect /> */}
//         </div>

//         <form
//           className="overflow-auto grid text-gray-700"
//           // onSubmit={handleSubmit(onSubmit)}
//         >
//           {/* {entries.map(({ id, symbol, title }) => {
//             return (
//               <label
//                 key={id}
//                 className={`relative flex items-center px-10 py-2 transition-opacity `}
//               >
//                 <input
//                   {...register('draftIds')}
//                   className="mr-2"
//                   type="checkbox"
//                   value={id}
//                   disabled={isSubmitting}
//                 />
//                 {styleSymbol(symbol)}
//               </label>
//             )
//           })} */}
//           {chains_.map(({ first, rest }) => {
//             return (
//               <label
//                 key={id}
//                 className={`relative flex items-center px-10 py-2 transition-opacity `}
//               >
//                 <input
//                   {...register('draftIds')}
//                   className="mr-2"
//                   type="checkbox"
//                   value={id}
//                   disabled={isSubmitting}
//                 />
//                 {styleSymbol(symbol)}
//               </label>
//             )
//           })}
//         </form>

//         <div className="flex justify-end w-full bottom-0 rounded-b ">
//           <button
//             className={`btn-primary w-fit mr-10`}
//             type="submit"
//             disabled={isSubmitting}
//             // onClick={() => handleSubmit(data => onSubmit(data, entries))()}
//           >
//             Commit
//           </button>
//         </div>
//       </div>
//     </FormProvider>
//   )
// }

// export default CommitForm
