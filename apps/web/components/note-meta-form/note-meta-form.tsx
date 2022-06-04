import React from 'react'
import {
  FormProvider,
  useFieldArray,
  useForm,
  Controller,
} from 'react-hook-form'
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
import { NoteMetaInput } from 'graphql-let/__generated__/__types__'
import { SymType } from '@prisma/client'
import { SymbolMetaForm } from './symbol-meta-form'
import { TopicMetaForm } from './topic-meta-form'
import { WebMetaForm } from './web-meta-topic'

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
      className={`flex-grow min-h-[38px] rounded hover:bg-gray-100 ${
        rest.isFocused ? 'bg-gray-100 ' : ''
      }  `}
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

export const toNoteMetaInput = (input: FormInputs): NoteMetaInput => {
  const {
    title,
    author,
    url,
    keywords,
    redirects,
    duplicates,
    date,
    description,
  } = input
  const stringOrUndefined = (str: string) => (str === '' ? undefined : str)
  const stringArrayOrUndefined = (str: string, splitter: string) =>
    str === '' ? undefined : duplicates.split(splitter)
  return {
    author: stringOrUndefined(author),
    // date: stringOrUndefined(date),
    // description: stringOrUndefined(description),
    duplicates: stringArrayOrUndefined(duplicates, ' '),
    keywords: keywords.map(e => e.value),
    // redirects: stringArrayOrUndefined(redirects, ' '),
    title: stringOrUndefined(title),
    // url: stringOrUndefined(url),
  }
}

const NoteMetaForm = ({
  metaInput,
  onSubmit,
  type,
}: {
  metaInput?: NoteMetaInput
  onSubmit: (input: NoteMetaInput) => void
  type: SymType | string
}): JSX.Element => {
  const methods = useForm<FormInputs>({
    defaultValues: {
      author: metaInput?.author ?? '',
      title: metaInput?.title ?? '',
      // url: metaInput?.url ?? '',
      keywords:
        metaInput?.keywords?.map(e => {
          return { label: e, value: e }
        }) ?? [],
      // redirects: metaInput?.redirects?.join(' ') ?? '',
      duplicates: metaInput?.duplicates?.join(' ') ?? '',
      // description: metaInput?.description ?? '',
      // date: metaInput?.date ?? '',
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

  if (type === 'TICKER' || type.startsWith('$')) {
    return <SymbolMetaForm metaInput={metaInput} onSubmit={onSubmit} />
  }
  if (type === 'TOPIC' || type.startsWith('[[')) {
    return <TopicMetaForm metaInput={metaInput} onSubmit={onSubmit} />
  }

  return <WebMetaForm metaInput={metaInput} onSubmit={onSubmit} />
}

export default NoteMetaForm
