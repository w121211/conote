import React from 'react'
// import { NoteMetaInput } from 'graphql-let/__generated__/__types__'
// import { customComponents, toNoteMetaInput } from './note-meta-form'
// import { Controller, FormProvider, useForm } from 'react-hook-form'
// import CreatableSelect from 'react-select/creatable'

// type FormInputs = {
//   title: string
//   author: string
//   url: string
//   keywords: { label: string; value: string }[]
//   redirects: string
//   duplicates: string
//   date: string
//   description: string
// }

// export const TopicMetaForm = ({
//   metaInput,
//   onSubmit,
// }: {
//   metaInput?: NoteMetaInput
//   onSubmit: (input: NoteMetaInput) => void
// }) => {
//   const methods = useForm<FormInputs>({
//     defaultValues: {
//       //   author: metaInput?.author ?? '',
//       title: metaInput?.title ?? '',
//       // url: metaInput?.url ?? '',
//       keywords:
//         metaInput?.keywords?.map(e => {
//           return { label: e, value: e }
//         }) ?? [],
//       // redirects: metaInput?.redirects?.join(' ') ?? '',
//       duplicates: metaInput?.duplicates?.join(' ') ?? '',
//       // description: metaInput?.description ?? '',
//       // date: metaInput?.date ?? '',
//     },
//   })
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     watch,
//     control,
//     formState: { isDirty, isSubmitSuccessful, isSubmitted },
//   } = methods

//   return (
//     <FormProvider {...methods}>
//       <form
//         className="grid grid-cols-1 auto-rows-auto sm:grid-cols-[max-content_auto] items-center sm:gap-4
//              "
//         onSubmit={handleSubmit(input => {
//           onSubmit(toNoteMetaInput(input))
//         })}
//         autoComplete="off"
//       >
//         {[
//           ['title', '標題', ''],
//           //   ['author', '來源作者', '例如:@巴菲特'],
//           // ['url', '來源網址', '例如:http://www.youtube.com/xxx...'],
//           ['keywords', '關鍵字', ''],
//           // ['redirects', '重新導向', '請使用 "空格" 分隔'],
//         ].map(([name, title, placeholder], i) => {
//           return (
//             <React.Fragment key={name}>
//               <label className="mr-4 mt-2 first:mt-0 sm:m-0 sm:text-right text-gray-700 text-sm">
//                 {/* <span className="flex-shrink-0 min-w-fit  mr-4 sm:w-20">
//                       <h5 className=" text-right text-gray-700 font-normal"> */}
//                 {title}
//                 {/* </h5>
//                     </span> */}
//               </label>
//               {name === 'keywords' ? (
//                 <Controller
//                   control={control}
//                   name="keywords"
//                   render={({ field: { onChange, value, ref } }) => (
//                     <CreatableSelect
//                       instanceId="1"
//                       isMulti
//                       styles={{
//                         control: () => ({}),
//                         container: () => ({
//                           position: 'relative',
//                           width: '100%',
//                           cursor: 'text',
//                         }),
//                       }}
//                       value={value}
//                       components={customComponents}
//                       noOptionsMessage={() => null}
//                       placeholder={placeholder}
//                       onChange={onChange}
//                     />
//                   )}
//                 />
//               ) : (
//                 <input
//                   {...register(name as keyof FormInputs)}
//                   type="text"
//                   className={`input flex-grow`}
//                   placeholder={placeholder}
//                 />
//               )}
//             </React.Fragment>
//           )
//         })}
//         <div className=" text-right sm:col-span-2">
//           <button
//             className="btn-primary mt-6 sm:mt-4"
//             type="submit"
//             disabled={!isDirty || isSubmitSuccessful || isSubmitted}
//           >
//             {isSubmitted ? (isDirty ? 'Submit' : 'Submitted') : 'Submit'}
//           </button>
//         </div>
//       </form>
//     </FormProvider>
//   )
// }
