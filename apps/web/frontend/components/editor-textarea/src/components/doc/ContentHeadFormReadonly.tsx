import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { components, ControlProps } from 'react-select'
import { NoteDocFragment } from '../../../../../../apollo/query.graphql'
import type { NoteDocContentHead } from '../../../../../../lib/interfaces'
import { parseSymbol } from '../../../../../../share/symbol.common'
import { docContentHeadUpdate } from '../../events'
import type { Doc } from '../../interfaces'

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

interface Props {
  noteDoc: NoteDocFragment
}

const ContentHeadFormReadonly = ({ noteDoc }: Props) => {
  const { symbol, contentHead } = noteDoc
  const symbolParsed = parseSymbol(symbol)
  const isWebNote = symbolParsed.type === 'URL'

  const methods = useForm<FormValues>({
    defaultValues: {
      symbol,
      // symbol: contentHead.symbol ?? noteDraftCopy.symbol,
      title: contentHead.title ?? '',
      keywords: contentHead.keywords?.map(e => ({ label: e, value: e })) ?? [],
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
  })
  const { register, handleSubmit, control, formState } = methods
  const { errors, isDirty, isSubmitSuccessful, isSubmitted } = formState

  return (
    <form>
      <div className="mb-3">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          htmlFor="symbol"
        >
          Symbol
        </label>
        <input
          {...register('symbol', { disabled: true })}
          className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          type="text"
          id="symbol"
          name="symbol"
          disabled={isWebNote}
        />
        {errors['symbol'] && (
          <p className="text-xs text-red-600 mt-2" id="symbol-error">
            {errors['symbol'].message}
          </p>
        )}
      </div>

      {isWebNote && (
        <div className="mb-3">
          <label
            htmlFor="title"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Title
          </label>
          <input
            {...register('title', { disabled: true })}
            className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
            type="text"
            id="title"
            name="title"
          />
        </div>
      )}

      {/* <div className="mb-3">
        <label
          htmlFor="keywords"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
        >
          Keywords
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
      </div> */}
    </form>
  )
}

export default ContentHeadFormReadonly
