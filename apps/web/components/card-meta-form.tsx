import React from 'react'
import { FormProvider, useFieldArray, useForm, Controller } from 'react-hook-form'
import {
  components,
  ControlProps,
  GroupBase,
  MultiValueGenericProps,
  MultiValueProps,
  OptionProps,
  StylesConfig,
} from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { CardMetaInput } from 'graphql-let/__generated__/__types__'
import { SymType } from '@prisma/client'
import SymbolMetaForm from './card-meta-form/symbol-meta-form'
import TopicMetaForm from './card-meta-form/topic-meta-form'
import WebMetaForm from './card-meta-form/web-meta-topic'

type Option = {
  label: string
  value: string
}

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

export const Control = (props: ControlProps<Option[], true>) => {
  const { children, ...rest } = props
  return (
    <components.Control
      {...rest}
      className={`flex-grow min-h-[38px] rounded hover:bg-gray-100 ${rest.isFocused ? 'bg-gray-100 ' : ''}  `}
    >
      {children}
    </components.Control>
  )
}

export const customComponents = {
  DropdownIndicator: undefined,
  ClearIndicator: undefined,
  Control,
}

const changeInputwidth = (name: string) => {
  switch (name) {
    case 'title':
    case 'author':
      return 'w-48'
    case 'url':
      return 'w-96'
    case 'redirects':
      return 'w-64'
  }
}

export const toCardMetaInput = (input: FormInputs): CardMetaInput => {
  const { title, author, url, keywords, redirects, duplicates, date, description } = input
  const stringOrUndefined = (str: string) => (str === '' ? undefined : str)
  const stringArrayOrUndefined = (str: string, splitter: string) =>
    str === '' ? undefined : duplicates.split(splitter)
  return {
    author: stringOrUndefined(author),
    date: stringOrUndefined(date),
    description: stringOrUndefined(description),
    duplicates: stringArrayOrUndefined(duplicates, ' '),
    keywords: keywords.map(e => e.value),
    redirects: stringArrayOrUndefined(redirects, ' '),
    title: stringOrUndefined(title),
    url: stringOrUndefined(url),
  }
}

const CardMetaForm = ({
  metaInput,
  onSubmit,
  type,
}: {
  metaInput?: CardMetaInput
  onSubmit: (input: CardMetaInput) => void
  type: SymType | string
}): JSX.Element => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      author: metaInput?.author ?? '',
      title: metaInput?.title ?? '',
      url: metaInput?.url ?? '',
      keywords:
        metaInput?.keywords?.map(e => {
          return { label: e, value: e }
        }) ?? [],
      redirects: metaInput?.redirects?.join(' ') ?? '',
      duplicates: metaInput?.duplicates?.join(' ') ?? '',
      description: metaInput?.description ?? '',
      date: metaInput?.date ?? '',
    },
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

  // const [updateCardMeta] = useUpdateCardMetaMutation({
  //   update(cache, { data }) {
  //     const res = cache.readQuery<CardQuery>({ query: CardDocument })
  //     if (data?.updateCardMeta && res?.card?.meta) {
  //       cache.writeQuery({
  //         query: CardDocument,
  //         data: {
  //           ...res.card.meta,
  //           title: data.updateCardMeta.title,
  //           author: data.updateCardMeta.author,
  //           keywords: data.updateCardMeta.keywords,
  //           duplicates: data.updateCardMeta.duplicates,
  //           redirects: data.updateCardMeta.redirects,
  //           url: data.updateCardMeta.url,
  //         },
  //       })
  //     }
  //   },
  //   onCompleted(data) {
  //     // console.log(data.updateCardMeta)
  //     if (data.updateCardMeta) {
  //       const newData = data.updateCardMeta
  //       // setValue('title', newData.title ?? '', { shouldDirty: false })
  //       // setValue('author', newData.author ?? '', { shouldDirty: false })
  //       // setValue('url', newData.url ?? '', { shouldDirty: false })
  //       // setValue('redirects', newData.redirects?.join(' ') ?? '', { shouldDirty: false })
  //       // setValue('keywords', newData.keywords?.join(' ') ?? '', { shouldDirty: false })
  //       // setValue('duplicates', newData.duplicates?.join(' ') ?? '', { shouldDirty: false })
  //       reset(
  //         {
  //           title: newData.title ?? '',
  //           author: newData.author ?? '',
  //           url: newData.url ?? '',
  //           redirects: newData.redirects?.join(' ') ?? '',
  //           keywords:
  //             newData.keywords?.map(e => {
  //               return { label: e, value: e }
  //             }) ?? [],
  //           duplicates: newData.duplicates?.join(' ') ?? '',
  //         },
  //         { keepIsSubmitted: true },
  //       )
  //       onSubmitted(data.updateCardMeta)
  //     }
  //   },
  //   // refetchQueries: [{ query: CardDocument, variables: { symbol } }],
  // })

  // const onSubmit = (d: FormInputs) => {
  //   if (d) {
  //     const keywordArr: string[] = []
  //     if (d.keywords) {
  //       d.keywords.forEach(e => {
  //         keywordArr.push(e.value)
  //       })
  //     }
  //     // updateCardMeta({
  //     //   variables: {
  //     //     cardId,
  //     //     data: {
  //     //       author: d.author,
  //     //       title: d.title,
  //     //       url: d.url,
  //     //       redirects: d.redirects.split(' '),
  //     //       duplicates: d.duplicates.split(' '),
  //     //       keywords: keywordArr,
  //     //     },
  //     //   },
  //     // })
  //   }
  // }

  if (type === 'TICKER' || type.startsWith('$')) {
    return <SymbolMetaForm metaInput={metaInput} onSubmit={onSubmit} />
  }
  if (type === 'TOPIC' || type.startsWith('[[')) {
    return <TopicMetaForm metaInput={metaInput} onSubmit={onSubmit} />
  }

  return <WebMetaForm metaInput={metaInput} onSubmit={onSubmit} />
}

export default CardMetaForm
