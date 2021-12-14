export const blank = () => {
  //
}
// import { useApolloClient } from '@apollo/client'
// import { useRouter } from 'next/router'
// import React, { useEffect, useState } from 'react'
// import { Controller, set, useForm } from 'react-hook-form'
// import AsyncSelect from 'react-select/async'
// import {
//   AuthorDocument,
//   AuthorQuery,
//   AuthorQueryVariables,
//   Shot,
//   ShotChoice,
//   ShotDocument,
//   ShotInput,
//   ShotQuery,
//   useAuthorQuery,
//   useCardLazyQuery,
//   useCardQuery,
//   useLinkLazyQuery,
//   useLinkQuery,
//   useShotQuery,
// } from '../../apollo/query.graphql'
// import Popup from '../popup/popup'
// import { FormInput } from './create-shot-form'
// import classes from './shot-form.module.scss'

// const UpdateShotForm = ({
//   shotId,
// }: // handleShotData,
// {
//   shotId: string
//   // handleShotData: (shot: Shot) => void
// }): JSX.Element => {
//   const router = useRouter()
//   const [showPopup, setShowPopup] = useState(false)
//   const [skipCardQuery, setSkipCardQuery] = useState(true)
//   // const { author, choice, target, link } = initialInput
//   const [targetId, setTargetId] = useState<string | undefined>()
//   const client = useApolloClient()
//   const { data: shotData } = useShotQuery({ fetchPolicy: 'cache-first', variables: { id: shotId } })
//   const { data: authorData } = useAuthorQuery({ variables: { id: shotData?.shot?.authorId ?? '' } })
//   const { data: CardData } = useCardQuery({
//     fetchPolicy: 'cache-first',
//     variables: { id: shotData?.shot?.targetId ?? '' },
//   })
//   const { data: linkData } = useLinkQuery({ variables: { id: shotData?.shot?.linkId ?? '' } })
//   //   let targetId: string

//   let linkId: string
//   const [queryLink] = useLinkLazyQuery({
//     variables: { url: link },
//     onCompleted(data) {
//       if (data.link) {
//         linkId = data.link.id
//       }
//     },
//   })
//   useEffect(() => {
//     if (CardData?.card) {
//       setTargetId(CardData.card.id)
//     }
//   }, [CardData])

//   const { register, handleSubmit, control } = useForm<FormInput>({
//     defaultValues: { ...initialInput, choice: choice ? (choice.substr(1) as ShotChoice) : '' },
//   })
//   // const [updateShot] = useUpdateShotMutation({
//   //   update(cache, { data }) {
//   //     const res = cache.readQuery<ShotQuery>({
//   //       query: ShotDocument,
//   //     })
//   //     if (data?.createShot && res?.shot) {
//   //       cache.writeQuery({
//   //         query: ShotDocument,
//   //         data: {
//   //           targetId: data.createShot.targetId,
//   //           choice: data.createShot.choice,
//   //           authorId: data.createShot.authorId,
//   //           linkId: data.createShot.linkId,
//   //         },
//   //       })
//   //     }
//   //   },
//   //   onCompleted(data) {
//   //     //   console.log(data.createShot.id)
//   //     if (data.createShot) {
//   //     }
//   //   },
//   // })
//   const filterAuthor = (inputValue: string) => {
//     return [inputValue]
//   }
//   const promiseOptions = (inputValue: string, callback: (authors: string[]) => void) =>
//     new Promise(resolve => {
//       client.query<AuthorQuery, AuthorQueryVariables>({
//         query: AuthorDocument,
//         variables: { name: inputValue },
//       })
//       resolve(filterAuthor)
//     })

//   const myHandleSubmit = (d: FormInput) => {
//     if (d.target && d.choice !== '') {
//       setSkipCardQuery(false)

//       if (d.link) {
//         queryLink({ variables: { url: d.link ?? '' } })
//       }
//       console.log(targetId)
//       if (targetId) {
//         createShot({
//           variables: {
//             data: {
//               targetId: targetId,
//               linkId: linkId ?? undefined,
//               choice: d.choice,
//               // authorId:
//             },
//           },
//         })
//       }
//     }
//   }
//   return (
//     <>
//       <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>
//         <label>
//           <h5> 作者</h5>
//           {
//             initialInput.author ? (
//               <button type="button" onClick={() => setShowPopup(true)}>
//                 {initialInput.author}
//               </button>
//             ) : null
//             // <Controller
//             //   control={control}
//             //   name="author"
//             //   render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
//             // />
//             // <input {...register('author')} type="text" />
//           }
//         </label>
//         <label>
//           <input {...register('choice')} type="radio" value="LONG" />
//           <h5> 看多</h5>
//         </label>
//         <label>
//           <input {...register('choice')} type="radio" value="SHORT" />
//           <h5> 看空</h5>
//         </label>
//         <label>
//           <input {...register('choice')} type="radio" value="HOLD" />
//           <h5> 觀望</h5>
//         </label>
//         <label>
//           <h5>Ticker</h5>
//           <input {...register('target')} type="text" />
//         </label>
//         <label>
//           <h5> 來源網址</h5>
//           <input {...register('link')} type="text" />
//         </label>

//         <button className="primary" type="submit">
//           <h5> 送出</h5>
//         </button>
//       </form>
//       <Popup
//         visible={showPopup}
//         hideBoard={() => setShowPopup(false)}
//         buttons={
//           <>
//             <button
//               className="secondary"
//               onClick={() => {
//                 router.push(`/author/${initialInput.author}`)
//               }}
//             >
//               確定
//             </button>
//             <button className="primary" onClick={() => setShowPopup(false)}>
//               取消
//             </button>
//           </>
//         }
//       >
//         尚未儲存的內容將丟失，確立離開本頁嗎？
//       </Popup>
//     </>
//   )
// }
// export default UpdateShotForm
