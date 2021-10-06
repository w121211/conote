import React, { useEffect, useState } from 'react'

import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import classes from './header-form.module.scss'
import { CardDocument, CardMeta, CardQuery, useBoardQuery, useUpdateCardMetaMutation } from '../../apollo/query.graphql'
import { RadioInput } from '../board-form/board-form'
import router from 'next/router'
type FormInputs = {
  title: string
  author: string
  url: string
  keywords: string
  redirects: string
  duplicates: string
}
// type FormInputs = {
//   // title: string
//   // authorChoice: string
//   // authorLines: string
//   authorName: string
//   props: { title: string; value: string }[]
// }

const HeaderForm = ({
  initialValue,
  symbol,
  handleSubmitted,
}: {
  initialValue: FormInputs
  symbol: string
  handleSubmitted: (isSubmitted: boolean) => void
}): JSX.Element => {
  const methods = useForm<FormInputs>({
    defaultValues: initialValue,
  })
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { isDirty, isSubmitSuccessful, isSubmitted },
  } = methods

  // useEffect(() => {
  //   setSubmitDisable(false)
  //   setSubmitFinished(false)
  // }, [watch()])
  // const { fields, append, remove } = useFieldArray({
  //   name: `props`,
  //   control,
  // })

  const [updateCardMeta, { data }] = useUpdateCardMetaMutation({
    // update(cache, { data }) {
    //   const res = cache.readQuery<CardQuery>({ query: CardDocument })
    //   if (data?.updateCardMeta && res?.card) {
    //     cache.writeQuery({
    //       query: CardDocument,
    //       data: {
    //         card: data.updateCardMeta,
    //       },
    //     })
    //   }
    // },
    onCompleted(data) {
      // if (data.updateCardMeta.meta) {
      //   const newData = data.updateCardMeta.meta
      //   // setValue('title', newData.title ?? '', { shouldDirty: false })
      //   // setValue('author', newData.author ?? '', { shouldDirty: false })
      //   // setValue('url', newData.url ?? '', { shouldDirty: false })
      //   // setValue('redirects', newData.redirects?.join(' ') ?? '', { shouldDirty: false })
      //   // setValue('keywords', newData.keywords?.join(' ') ?? '', { shouldDirty: false })
      //   // setValue('duplicates', newData.duplicates?.join(' ') ?? '', { shouldDirty: false })
      //   reset(
      //     {
      //       title: newData.title ?? '',
      //       author: newData.author ?? '',
      //       url: newData.url ?? '',
      //       redirects: newData.redirects?.join(' ') ?? '',
      //       keywords: newData.keywords?.join(' ') ?? '',
      //       duplicates: newData.duplicates?.join(' ') ?? '',
      //     },
      //     { keepIsSubmitted: true },
      //   )
      //   handleSubmitted(isSubmitted)
      // }
    },
    // refetchQueries: [{ query: CardDocument, variables: { symbol } }],
  })

  const onSubmit = (d: FormInputs) => {
    if (d) {
      updateCardMeta({
        variables: {
          symbol,
          data: {
            author: d.author,
            title: d.title,
            url: d.url,
            redirects: d.redirects.split(' '),
            duplicates: d.duplicates.split(' '),
            keywords: d.keywords.split(' '),
          },
        },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className={classes.formContainer}>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          // onChange={() => {
          //   setSubmitDisable(false)
          //   setSubmitFinished(false)
          // }}
        >
          {/* <div className={classes.section}> */}
          {/* <label>Symbol/Topic</label> */}
          {/* <input type="text" {...register('title')} placeholder="Symbol 或 Topic" /> */}
          {/* </div> */}
          {/* <div className={classes.section}> */}
          <label>
            <h5>標題</h5>
            <input {...register('title')} type="text" placeholder="標題" />
          </label>
          <label>
            <h5>作者</h5>
            <input {...register('author')} type="text" placeholder="來源作者" />
          </label>
          <label>
            <h5>網址</h5>
            <input {...register('url')} type="text" placeholder="來源網址" />
          </label>
          <label>
            <h5>Keywords</h5>
            <input {...register('keywords')} type="text" placeholder="請使用 '空格' 分隔" />
          </label>
          <label>
            <h5>Redirects</h5>
            <input {...register('redirects')} type="text" placeholder="請使用 '空格' 分隔" />
          </label>
          <label>
            <h5>Duplicates</h5>
            <input {...register('duplicates')} type="text" placeholder="請使用 '空格' 分隔" />
          </label>
          {/* <div className={classes.choiceWrapper}>
            <div>
              {authorName ? (
                <label>@{authorName.split(':', 1)}</label>
              ) : (
                <input {...register('author')} type="text" placeholder="來源作者" />
                )}
                </div>
              </div> */}

          {/* <input type="text" {...register('authorLines')} placeholder="來源作者看法" /> */}
          {/* </div> */}
          <div className={classes.submitBtn}>
            <button className="primary" type="submit" disabled={!isDirty}>
              {isSubmitted ? (isDirty ? '提交' : '已提交') : '提交'}
              {/* {console.log(isDirty, isSubmitSuccessful, isSubmitted)} */}
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
