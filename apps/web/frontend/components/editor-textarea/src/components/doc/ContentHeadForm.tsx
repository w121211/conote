import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { components, ControlProps } from 'react-select'
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
  doc: Doc
  onFinish: () => void
}

const ContentHeadForm = ({ doc, onFinish }: Props) => {
  const router = useRouter()
  const { contentHead, noteDraftCopy } = doc
  const symbol = contentHead.symbol ?? noteDraftCopy.symbol
  const isWebNote = !isNil(noteDraftCopy.linkId)

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

  async function onSubmit(input: FormValues) {
    const { symbol: symbolInput, title, keywords, duplicatedSymbols } = input
    const contentHead_: NoteDocContentHead = {
      ...contentHead,
      symbol: symbolInput === noteDraftCopy.symbol ? undefined : symbolInput,
      keywords: keywords.map(e => e.value),
    }

    await docContentHeadUpdate(doc, contentHead_, router)
    onFinish()
  }

  return (
    <form autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-3">
        <label
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          htmlFor="symbol"
        >
          Symbol
        </label>
        <input
          {...register('symbol', {
            required: true,
            validate: v => {
              if (v !== symbol) {
                try {
                  const s = parseSymbol(v)
                  if (s.type === 'URL') {
                    return 'URL is not allowed, only topics. For example, [[Hello world]], [[How to fly to the moon?]]'
                  } else if (s.type === 'TICKER') {
                    return 'Ticker is not allowed, only topics. For example, [[Hello world]], [[How to fly to the moon?]]'
                  }
                } catch (err) {
                  return 'Incorrect symbol format. For example, [[Hello world]], [[How to fly to the moon?]]'
                }
              }
            },
          })}
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
            {...register('title', {
              disabled: true,
            })}
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

      <button
        type="submit"
        className="btn-primary-md"
        disabled={!isDirty || isSubmitSuccessful}
      >
        Submit
      </button>
    </form>
  )
}

export default ContentHeadForm
