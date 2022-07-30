import { useApolloClient } from '@apollo/client'
// import { RateChoice } from '@prisma/client'
// // import { useRouter } from 'next/router'
// import React, { useEffect, useState } from 'react'
// import { Controller, FormProvider, set, useForm } from 'react-hook-form'
// import AsyncSelect from 'react-select/async'
// import {
//   RateDocument,
//   RateFragment,
//   RateQuery,
//   useLinkLazyQuery,
//   useUpdateRateMutation,
// } from '../../apollo/query.graphql'
// import { AsyncTickerConsumer } from './create-rate-form'

// interface Option {
//   value: string
//   label: string
// }
// export interface FormInput {
//   author: string
//   choice: RateChoice
//   target: Option
//   link?: string
// }

// // const AsyncAuthor = () => {
// //   const
// //   return <AsyncSelect cacheOptions defaultOptions loadOptions={} />
// // }

// const UpdateRateForm = ({
//   rateId,
//   initialInput,
//   onRateCreated,
// }: {
//   rateId: string
//   initialInput: FormInput
//   onRateCreated: (rate: RateFragment, targetSymbol: string) => void
// }): JSX.Element => {
//   // const router = useRouter()
//   const [showPopup, setShowPopup] = useState(false)
//   const [skipNoteQuery, setSkipNoteQuery] = useState(true)
//   const { author, choice, target, link } = initialInput
//   const [targetId, setTargetId] = useState<string | undefined>()
//   const client = useApolloClient()
//   const method = useForm<FormInput>({
//     defaultValues: { ...initialInput },
//   })
//   const { register, handleSubmit, watch } = method

//   let linkId: string
//   // const { data: targetNoteData } = useNoteQuery({
//   //   fetchPolicy: 'cache-first',
//   //   variables: { symbol: target },
//   //   // skip: skipNoteQuery,
//   // })
//   const [queryLink] = useLinkLazyQuery({
//     variables: { url: link },
//     onCompleted(data) {
//       if (data.link) {
//         linkId = data.link.id
//       }
//     },
//   })
//   // useEffect(() => {
//   //   if (targetNoteData?.note) {
//   //     setTargetId(targetNoteData.note.id)
//   //   }
//   // }, [targetNoteData])

//   const watchChoice = watch('choice')
//   const watchAuthor = watch('author')

//   const [updateRate, { data: rateData }] = useUpdateRateMutation({
//     update(cache, { data }) {
//       const res = cache.readQuery<RateQuery>({
//         query: RateDocument,
//       })
//       if (data?.updateRate && res?.rate) {
//         cache.writeQuery({
//           query: RateDocument,
//           data: {
//             targetId: data.updateRate.symId,
//             choice: data.updateRate.choice,
//             authorId: data.updateRate.authorId,
//             linkId: data.updateRate.linkId,
//           },
//         })
//       }
//     },
//     onCompleted(data) {
//       // console.log(data.createRate, targetNoteData)
//       if (data.updateRate) {
//         onRateCreated(data.updateRate, data.updateRate.symId)
//       } else {
//         throw 'Create shot error'
//       }
//     },
//   })
//   // const filterAuthor = (inputValue: string) => {
//   //   return [inputValue]
//   // }
//   // const promiseOptions = (inputValue: string, callback: (authors: string[]) => void) =>
//   //   new Promise(resolve => {
//   //     client.query<AuthorQuery, AuthorQueryVariables>({
//   //       query: AuthorDocument,
//   //       variables: { name: inputValue },
//   //     })
//   //     resolve(filterAuthor)
//   //   })

//   const myHandleSubmit = (d: FormInput) => {
//     if (d.target) {
//       if (d.link) {
//         queryLink({ variables: { url: d.link ?? '' } })
//       }
//       // console.log(targetId)
//       // if (targetId) {
//       console.log(d.target)
//       // updateRate({
//       //   variables: {
//       //     id: rateId,
//       //     data: {
//       //       targetId: d.target.value,
//       //       linkId: linkId ?? undefined,
//       //       choice: d.choice,
//       //       // authorId:
//       //     },
//       //   },
//       // })
//       // }
//     }
//   }
//   return (
//     <div className="w-[40vw]">
//       <h2 className="mb-6 text-2xl font-bold text-gray-800">編輯預測</h2>
//       <FormProvider {...method}>
//         <form className="flex flex-col gap-4" onSubmit={handleSubmit(myHandleSubmit)} autoComplete="off">
//           <label className="group flex items-center relative">
//             {
//               // initialInput.author ? <button type="button">{initialInput.author}</button> : null
//               // <Controller
//               //   control={control}
//               //   name="author"
//               //   render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
//               // />
//             }
//             <h5
//               // className={`absolute top-0 left-2 leading-none font-normal text-gray-700 font-normal
//               // transition-all transform origin-top-left
//               //   group-focus-within:translate-y-2 group-focus-within:scale-[0.8] group-focus-within:text-blue-600
//               //   ${watchAuthor === '' ? 'translate-y-4 scale-100' : 'translate-y-2 scale-[0.8]'}`}
//               className="w-20 text-gray-700 font-normal"
//             >
//               名字
//             </h5>
//             <input
//               {...register('author')}
//               className="input flex-grow text-gray-500 bg-transparent hover:bg-transparent"
//               // className="input inline h-12 pt-6"
//               type="text"
//               disabled={true}
//             />
//           </label>
//           <div className="flex items-center select-none">
//             <h5 className="w-20 text-gray-700 font-normal ">預測</h5>
//             <div className="flex gap-3">
//               {[
//                 ['LONG', '看多'],
//                 ['SHORT', '看空'],
//                 ['HOLD', '觀望'],
//               ].map(([value, label]) => {
//                 return (
//                   <label
//                     key={value}
//                     className={`inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer tracking-wider transition-all ${
//                       watchChoice === value
//                         ? 'bg-blue-600 border-transparent '
//                         : 'bg-white border-gray-200 hover:bg-gray-100'
//                     }`}
//                   >
//                     <input {...register('choice')} className="absolute opacity-0" type="radio" value={value} />
//                     <h5 className={`font-normal ${watchChoice === value ? 'text-white' : 'text-gray-900'}`}>{label}</h5>
//                   </label>
//                 )
//               })}
//             </div>
//           </div>
//           <label className="flex items-center">
//             <h5 className="flex-shrink-0 w-20 text-gray-700 font-normal ">標的</h5>

//             <AsyncTickerConsumer name="target" />
//           </label>
//           <label className="flex items-center">
//             <h5 className="w-20 text-gray-700 font-normal ">來源網址</h5>
//             <input
//               {...register('link')}
//               className="input flex-grow"
//               type="text"
//               placeholder="例如:https://www.youtube.com/xxx..."
//             />
//           </label>
//           <div className="text-center">
//             <button className="btn-primary h-10 w-24 mt-4" type="submit">
//               送出
//             </button>
//           </div>
//         </form>
//       </FormProvider>
//     </div>
//   )
// }
// export default UpdateRateForm
