import React from 'react'
import { Controller, useForm } from 'react-hook-form'
import { components, ControlProps } from 'react-select'
import CreatableSelect from 'react-select/creatable'
import { NoteDocFragment } from '../../apollo/query.graphql'

type Option = {
  label: string
  value: string
}

const Control = (props: ControlProps<Option[], true>) => {
  const { children, ...rest } = props
  return (
    <components.Control
      {...rest}
      className={`flex-grow min-h-[38px] rounded !bg-white !border-none text-gray-500 text-sm ${
        rest.isDisabled ? '' : ''
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

export const ContentHeadReadonlyForm = ({ doc }: { doc: NoteDocFragment }) => {
  const { symbol, contentHead } = doc

  const methods = useForm<FormValues>({
      defaultValues: {
        symbol: contentHead.symbol ?? symbol,
        // title: contentHead.title ?? '',
        keywords:
          contentHead.keywords?.map(e => ({ label: e, value: e })) ?? [],
      },
    }),
    { register, handleSubmit, control, formState } = methods

  return (
    <form
      className="grid grid-cols-1 auto-rows-auto sm:grid-cols-[max-content_auto] items-center sm:gap-4 "
      autoComplete="off"
    >
      <label className="mr-4 mt-2 first:mt-0 sm:m-0 sm:text-right text-gray-700 text-sm">
        Symbol
      </label>
      <input
        {...register('symbol', {
          required: true,
          pattern: /\[\[[^\]\n]+\]\]/u,
        })}
        className={`input flex-grow`}
        type="text"
        disabled
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
            isDisabled
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
            placeholder={''}
            onChange={onChange}
          />
        )}
      />
    </form>
  )
}
