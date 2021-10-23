import React, { useEffect, useState } from 'react'

import { FormProvider, useFieldArray, useForm, Controller } from 'react-hook-form'

import CreatableSelect from 'react-select/creatable'
import classes from './header-form.module.scss'
import {
  CardDocument,
  CardMeta,
  CardMetaDocument,
  CardMetaQuery,
  CardQuery,
  useUpdateCardMetaMutation,
} from '../../apollo/query.graphql'
import { RadioInput } from '../board-form/board-form'
import router from 'next/router'
import { GroupTypeBase, Styles } from 'react-select'
type FormInputs = {
  title: string
  author: string
  url: string
  keywords: { label: string; value: string }[]
  redirects: string
  duplicates: string
  date: string
  description: string
}
const components = {
  DropdownIndicator: null,
  ClearIndicator: null,
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

  const [updateCardMeta] = useUpdateCardMetaMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CardMetaQuery>({ query: CardMetaDocument })
      if (data?.updateCardMeta && res?.cardMeta) {
        cache.writeQuery({
          query: CardMetaDocument,
          data: {
            ...res.cardMeta,
            title: data.updateCardMeta.title,
            author: data.updateCardMeta.author,
            keywords: data.updateCardMeta.keywords,
            duplicates: data.updateCardMeta.duplicates,
            redirects: data.updateCardMeta.redirects,
            url: data.updateCardMeta.url,
          },
        })
      }
    },
    onCompleted(data) {
      console.log(data.updateCardMeta)
      if (data.updateCardMeta) {
        const newData = data.updateCardMeta
        // setValue('title', newData.title ?? '', { shouldDirty: false })
        // setValue('author', newData.author ?? '', { shouldDirty: false })
        // setValue('url', newData.url ?? '', { shouldDirty: false })
        // setValue('redirects', newData.redirects?.join(' ') ?? '', { shouldDirty: false })
        // setValue('keywords', newData.keywords?.join(' ') ?? '', { shouldDirty: false })
        // setValue('duplicates', newData.duplicates?.join(' ') ?? '', { shouldDirty: false })
        reset(
          {
            title: newData.title ?? '',
            author: newData.author ?? '',
            url: newData.url ?? '',
            redirects: newData.redirects?.join(' ') ?? '',
            keywords:
              newData.keywords?.map(e => {
                return { label: e, value: e }
              }) ?? [],
            duplicates: newData.duplicates?.join(' ') ?? '',
          },
          { keepIsSubmitted: true },
        )
        handleSubmitted(isSubmitted)
      }
    },
    // refetchQueries: [{ query: CardDocument, variables: { symbol } }],
  })

  const onSubmit = (d: FormInputs) => {
    if (d) {
      const keywordArr: string[] = []
      if (d.keywords) {
        d.keywords.forEach(e => {
          keywordArr.push(e.value)
        })
      }

      updateCardMeta({
        variables: {
          symbol,
          data: {
            author: d.author,
            title: d.title,
            url: d.url,
            redirects: d.redirects.split(' '),
            duplicates: d.duplicates.split(' '),
            keywords: keywordArr,
          },
        },
      })
    }
  }

  const customStyles: Partial<
    Styles<{ label: string; value: string }, true, GroupTypeBase<{ label: string; value: string }>>
  > = {
    valueContainer: (provided, state) => ({
      ...provided,
      height: '100%',
      padding: '0',
    }),
    control: (provided, { isFocused }) => ({
      ...provided,
      height: '44px',
      // height: '100%',
      padding: '0 8px',
      border: 'none',
      borderRadius: '6px',
      background: '#f6f7fb',
      ':hover': {
        background: '#eef1fd',
      },
      boxShadow: isFocused ? 'none' : 'none',
    }),
    placeholder: (provided, state) => ({
      ...provided,
      fontSize: '14px',
    }),
    container: (provided: any, state: any) => ({
      ...provided,
      margin: '0.5em 0 1em',
    }),
    input: (provided, state) => ({
      ...provided,
      // height: '100%',
    }),
    multiValue: (provided, state) => ({
      ...provided,
      // height: '100%',
      padding: '0',
      color: '#5c6cda',
      backgroundColor: '#d6daff',
      // mixBlendMode: 'multiply',
    }),
    multiValueLabel: (provided, state) => ({
      ...provided,
      // height: '100%',
      paddingTop: '0',
      paddingBottom: '0',
      color: '#5c6cda',

      // mixBlendMode: 'multiply',
    }),
    multiValueRemove: (provided, state) => ({
      ...provided,
      // height: '100%',
      // padding: '0',
      color: '#5c6cda',
      backgroundColor: 'none',
      // mixBlendMode: 'multiply',
      ':hover': {
        color: 'white',

        backgroundColor: '#5c6cda',
      },
    }),
    option: provided => ({
      ...provided,
      height: '30px',
      padding: '0 8px',
    }),
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
            {/* <input {...register('keywords')} type="text" placeholder="請使用 '空格' 分隔" /> */}
            <Controller
              control={control}
              name="keywords"
              render={({ field: { onChange, value, ref } }) => (
                <CreatableSelect
                  styles={customStyles}
                  isMulti
                  onChange={e => {
                    onChange(e)
                    // console.log(e)
                  }}
                  value={value}
                  components={components}
                  noOptionsMessage={() => null}
                  placeholder="新增keyword"
                />
              )}
            ></Controller>
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
            </button>
          </div>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
