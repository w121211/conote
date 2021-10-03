import React, { useEffect, useState } from 'react'

import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import classes from './header-form.module.scss'
import { CardDocument, CardMeta, CardQuery, useBoardQuery, useUpdateCardMetaMutation } from '../../apollo/query.graphql'
import { RadioInput } from '../board-form/board-form'
type FormInputs = CardMeta
// type FormInputs = {
//   // title: string
//   // authorChoice: string
//   // authorLines: string
//   authorName: string
//   props: { title: string; value: string }[]
// }

const HeaderForm = ({ initialValue, symbol }: { initialValue: FormInputs; symbol: string }): JSX.Element => {
  // const [authorName, setAuthorName] = useState('')
  const methods = useForm<FormInputs>({
    defaultValues: initialValue,
  })
  const { register, handleSubmit, setValue, watch, control } = methods
  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    // setValue('authorChoice', initialValue.authorChoice)
    // setValue('authorLines', initialValue.authorLines)
  }
  // const { fields, append, remove } = useFieldArray({
  //   name: `props`,
  //   control,
  // })

  const [updateCardMeta] = useUpdateCardMetaMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CardQuery>({ query: CardDocument })
      if (data?.updateCardMeta && res?.card) {
        cache.writeQuery({
          query: CardDocument,
          data: {
            card: data.updateCardMeta,
          },
        })
      }
    },
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
            redirects: d.redirects,
            duplicates: d.duplicates,
            keywords: d.keywords,
          },
        },
      })
      console.log(d)
    }
  }

  return (
    <FormProvider {...methods}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
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
            <h5>關鍵詞</h5>
            <input {...register('keywords')} type="text" placeholder="關鍵詞" />
          </label>
          <label>
            <h5>重新導向</h5>
            <input {...register('redirects')} type="text" placeholder="重新導向" />
          </label>
          <label>
            <h5>副本</h5>
            <input {...register('duplicates')} type="text" placeholder="副本" />
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
            <button className="primary">送出</button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
