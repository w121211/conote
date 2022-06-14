import React from 'react'
import { useRouter } from 'next/router'
import { Controller, FormProvider, useForm } from 'react-hook-form'
import { components, ControlProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import type { NoteDocContentHeadInput } from 'graphql-let/__generated__/__types__'
import { docContentHeadUpdate } from '../../events'
import { Doc } from '../../interfaces'

type Option = {
  label: string
  value: string
}

const Control = (props: ControlProps<Option[], true>) => {
  const { children, ...rest } = props
  return (
    <components.Control
      {...rest}
      className={`flex-grow min-h-[38px] rounded text-sm hover:cursor-text hover:bg-gray-50 ${
        rest.isFocused
          ? '!shadow-[0_0_0_2px] !shadow-blue-400 !border-transparent'
          : '!border-gray-300'
      }  `}
    >
      {children}
    </components.Control>
  )
}

const customComponents = {
  DropdownIndicator: undefined,
  ClearIndicator: undefined,
  Control,
}

type FormValues = {
  symbol: string
  title: string
  keywords: { label: string; value: string }[]
  duplicatedSymbols: string
}

// function toContentHeadInput({
//   symbol,
//   title,
//   keywords,
//   duplicatedSymbols,
// }: FormValues): NoteDocContentHeadInput {
//   // const stringOrUndefined = (str: string) => (str === '' ? undefined : str)
//   // const stringArrayOrUndefined = (str: string, splitter: string) =>
//   //   str === '' ? undefined : duplicates.split(splitter)
//   return {
//     author: stringOrUndefined(author),
//     // date: stringOrUndefined(date),
//     // description: stringOrUndefined(description),
//     duplicates: stringArrayOrUndefined(duplicates, ' '),
//     keywords: keywords.map(e => e.value),
//     // redirects: stringArrayOrUndefined(redirects, ' '),
//     title: stringOrUndefined(title),
//     // url: stringOrUndefined(url),
//   }
// }

export const ContentHeadForm = ({
  doc,
  onFinish,
}: {
  doc: Doc
  onFinish: () => void
}) => {
  const { symbol, contentHead } = doc,
    router = useRouter()

  const methods = useForm<FormValues>({
      defaultValues: {
        symbol: contentHead.symbol ?? symbol,
        // title: contentHead.title ?? '',
        keywords:
          contentHead.keywords?.map(e => ({ label: e, value: e })) ?? [],
        // duplicatedSymbols: contentHead.duplicatedSymbols?.join(' ') ?? '',
        // redirects: metaInput?.redirects?.join(' ') ?? '',
        // duplicates: metaInput?.duplicates?.join(' ') ?? '',
        // description: metaInput?.description ?? '',
        // date: metaInput?.date ?? '',
        // redirectTo: defaultValues?.redirectTo ?? '',
        // description: '',
        // date: '',
        //   author: metaInput?.author ?? '',
        //   url: metaInput?.url ?? '',
      },
    }),
    { register, handleSubmit, control, formState } = methods,
    { isDirty, isSubmitSuccessful, isSubmitted } = formState

  async function onSubmit(input: FormValues) {
    const { symbol: symbol_, title, keywords, duplicatedSymbols } = input,
      contentHead_: NoteDocContentHeadInput = {
        ...contentHead,
        symbol: symbol_ === symbol ? undefined : symbol_,
        keywords: keywords.map(e => e.value),
      }
    await docContentHeadUpdate(doc, contentHead_, router)
    onFinish()
  }

  return (
    <form
      className="grid grid-cols-1 auto-rows-auto sm:grid-cols-[max-content_auto] items-center sm:gap-4 "
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <label className="mr-4 mt-2 first:mt-0 sm:m-0 sm:text-right text-gray-700 text-sm">
        {/* <span className="flex-shrink-0 min-w-fit  mr-4 sm:w-20"><h5 className=" text-right text-gray-700 font-normal"> */}
        Symbol
        {/* </h5></span> */}
      </label>
      <input
        {...register('symbol', {
          required: true,
          pattern: /\[\[[^\]\n]+\]\]/u,
        })}
        className={`input flex-grow`}
        type="text"
      />

      {/* <label className="mr-4 mt-2 first:mt-0 sm:m-0 sm:text-right text-gray-700 text-sm">
          <span className="flex-shrink-0 min-w-fit  mr-4 sm:w-20"><h5 className=" text-right text-gray-700 font-normal">
          Title
          </h5></span>
        </label>
        <input
          {...register('title')}
          className={`input flex-grow`}
          type="text"
        /> */}

      <label className="mr-4 mt-2 first:mt-0 sm:m-0 sm:text-right text-gray-700 text-sm">
        {/* <span className="flex-shrink-0 min-w-fit  mr-4 sm:w-20"><h5 className=" text-right text-gray-700 font-normal"> */}
        Keywords
        {/* </h5></span> */}
      </label>
      <Controller
        control={control}
        name="keywords"
        render={({ field: { onChange, value, ref } }) => (
          <CreatableSelect
            instanceId="1"
            isMulti
            styles={{
              container: () => ({
                position: 'relative',
                width: '100%',
                cursor: 'text',
              }),
            }}
            value={value}
            components={customComponents}
            noOptionsMessage={() => null}
            placeholder={'placeholder'}
            onChange={onChange}
          />
        )}
      />

      <div className=" text-right sm:col-span-2">
        <button
          className="btn-primary-md "
          type="submit"
          disabled={!isDirty || isSubmitSuccessful || isSubmitted}
        >
          {isSubmitted ? (isDirty ? 'Submit' : 'Submitted') : 'Submit'}
        </button>
      </div>
    </form>
  )
}
