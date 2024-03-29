import React, { useEffect } from 'react'
// import { FormProvider, useForm } from 'react-hook-form'
// import { useNoteLazyQuery } from '../../apollo/query.graphql'
// import { AsyncTickerConsumer } from './create-rate-form'

// interface Option {
//   value: string
//   label: string
// }

// interface FormInput {
//   target: string
//   description: string
// }

// const CreateSymbolForm = ({
//   defaultValues,
//   onSubmitted,
// }: {
//   defaultValues: FormInput
//   onSubmitted: (value: Option) => void
// }) => {
//   const { register, handleSubmit, watch } = useForm<FormInput>({ defaultValues })
//   const watchTarget = watch('target')
//   const [queryNote, { data }] = useNoteLazyQuery()

//   const onSubmit = (v: FormInput) => {
//     // queryNote({ variables: { symbol: '$' + v.target } })
//     onSubmitted({ label: v.target.trim(), value: v.target.trim() })
//   }

//   return (
//     <div>
//       <h2 className="mb-6 text-2xl font-bold text-gray-800">新增標的</h2>
//       <form className="flex flex-col gap-4 w-[40vw]" onSubmit={handleSubmit(onSubmit)}>
//         <label className="flex-shrink-0 flex items-center">
//           <h5 className="w-20 text-gray-700 font-normal ">標的</h5>
//           <div className="flex-grow relative ">
//             <input
//               {...register('target')}
//               className={`input w-full ${watchTarget.startsWith('$') ? 'uppercase' : 'normal-case'}`}
//               type="text"
//               // placeholder="例如:https://www.youtube.com/xxx..."
//             />
//           </div>
//         </label>
//         <label className="flex-shrink-0 flex items-center">
//           <h5 className="w-20 text-gray-700 font-normal ">公司全稱</h5>
//           <input
//             {...register('description')}
//             className="input flex-grow"
//             type="text"
//             //   placeholder="例如:https://www.youtube.com/xxx..."
//           />
//         </label>
//         <div className="text-center">
//           <button className="btn-primary h-10 w-24 mt-4" type="submit">
//             新增
//           </button>
//         </div>
//       </form>
//     </div>
//   )
// }

// export default CreateSymbolForm
