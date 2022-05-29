import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'
import {
  MyNoteDraftEntriesQuery,
  useCreateNoteDraftMutation,
  useMyNoteDraftEntriesQuery,
} from '../../apollo/query.graphql'
import DomainSelect from '../domain/domain-select'
import Modal from '../modal/modal'
import { styleSymbol } from '../ui-component/style-fc/style-symbol'
import { LoadingSvg } from './loading-circle'

/**
 *
 */

const mockData = [
  { symbol: '[[Apple]]', title: '[[Apple]]', type: 'symbol' },
  {
    symbol: 'http://www.ckdwe.com/sdfa',
    title: '5天就能記住1萬個單詞的方法,老師為什麽不教?',
    type: 'web',
  },
  { symbol: '[[Tailwind]]', title: '[[Tailwind]]', type: 'symbol' },
  { symbol: '[[Tailw]]', title: '[[Tailwind]]', type: 'symbol' },
  { symbol: '[[Taiwind]]', title: '[[Tailwind]]', type: 'symbol' },
  { symbol: '[[Tailwin]]', title: '[[Tailwind]]', type: 'symbol' },
]

type FormValue = {
  checkbox: string[]
  // checkboxMirror: string[]
}

export const CommitPanel = (): JSX.Element | null => {
  const { data, loading, error } = useMyNoteDraftEntriesQuery(),
    [
      commitNoteDrafts,
      {
        data: commitNoteDraftsData,
        loading: commitNoteDraftsLoading,
        error: commitNoteDraftsError,
      },
    ] = useCreateNoteDraftMutation()

  // const { checkedDrafts, checkBoxForm } = reactSelectForm()

  const [showModal, setShowModal] = useState(true)
  const [checkedIdx, setCheckedIdx] = useState<boolean[]>(
    Array(mockData.length).fill(false),
  )
  const methods = useForm<FormValue>()
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { isSubmitting, isSubmitSuccessful },
  } = methods

  const watchValue = watch('checkbox')
  // const watchMirrorValue = watch('checkboxMirror')

  const onSubmit = (value: FormValue) => {
    console.log('checkbox', value.checkbox)
  }

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Error</div>
  }
  if (data === undefined) {
    return <div>Error</div>
  }

  return (
    <div>
      {/* {checkBoxForm}

      {checkedDrafts} */}

      <button
        className="btn-primary text-sm"
        onClick={e => {
          setShowModal(true)
          // commitNoteDrafts({ variables: { draftIds: checkedDrafts } })
        }}
      >
        Commit
      </button>
      <FormProvider {...methods}>
        <Modal
          sectionClassName="!w-1/2"
          visible={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className=" mt-5 ">
            <div className="flex items-center mx-10 mb-3">
              <h2
                className={`text-3xl text-gray-900 transition-all ${
                  isSubmitSuccessful
                    ? '-translate-x-10 opacity-0 h-0 w-0 overflow-hidden invisible '
                    : 'translate-x-0 opacity-100 visible mr-4'
                }`}
              >
                Commit to
              </h2>
              <h2
                className={`text-3xl text-gray-900 transition-[transform,opacity] delay-150 ${
                  isSubmitSuccessful
                    ? 'translate-x-0 opacity-100 visible '
                    : 'translate-x-10 opacity-0 w-0 h-0 overflow-hidden invisible '
                }`}
              >
                Commit Success! #id
              </h2>
              {isSubmitSuccessful || <DomainSelect />}
            </div>
            <form
              className="grid text-sm text-gray-700"
              onSubmit={handleSubmit(onSubmit)}
            >
              {mockData.map(({ symbol, title, type }, i) => {
                return (
                  <label
                    key={symbol}
                    className={`relative flex items-center  transition-opacity ${
                      (isSubmitting || isSubmitSuccessful) && !checkedIdx[i]
                        ? 'h-0 opacity-0 invisible overflow-hidden '
                        : 'opacity-100 visible px-10 py-2'
                    }`}
                  >
                    <input
                      {...register('checkbox')}
                      className="absolute opacity-0"
                      type="checkbox"
                      value={symbol}
                      onChange={e => {
                        const newValue = [...checkedIdx]
                        if (e.target.checked) {
                          newValue[i] = true
                          setCheckedIdx(newValue)
                        } else {
                          newValue[i] = false
                          setCheckedIdx(newValue)
                        }
                        register('checkbox').onChange(e)
                      }}
                      disabled={
                        (isSubmitting || isSubmitSuccessful) && checkedIdx[i]
                      }
                    />
                    {isSubmitting ? (
                      <LoadingSvg />
                    ) : isSubmitSuccessful ? (
                      <span className="material-icons mr-2 text-lg leading-none text-green-600">
                        check_circle_outline
                      </span>
                    ) : (
                      <span
                        className={`material-icons-outlined mr-2 text-lg leading-none ${
                          checkedIdx[i] ? 'text-gray-700' : 'text-gray-400'
                        }`}
                      >
                        {checkedIdx[i]
                          ? 'check_box'
                          : 'check_box_outline_blank'}
                      </span>
                    )}

                    {type === 'web' ? title : styleSymbol(symbol)}
                  </label>
                )
              })}
              {/* --- Checked --- */}
              <div className="sticky  bottom-0 mt-3 px-10 pb-5 rounded-b text-sm bg-gray-200">
                {/* <h5 className="my-2 text-gray-500">CHECKED</h5> */}
                <div className="grid gap-4 my-5 overscroll-contain overflow-auto max-h-28">
                  {isSubmitting || isSubmitSuccessful ? (
                    <div>
                      <p className="flex items-center gap-1 text-gray-500">
                        Contribution ups
                        <span className="material-icons text-lg leading-none">
                          moving
                        </span>
                      </p>
                      <h1>
                        ~141
                        <span className="font-normal text-gray-400">(+2)</span>
                      </h1>
                    </div>
                  ) : (
                    watchValue &&
                    watchValue.length > 0 &&
                    mockData.map(({ symbol, title, type }, i) => {
                      const valueIdx = getValues('checkbox').findIndex(
                        e => e === symbol,
                      )
                      if (valueIdx > -1) {
                        const newValues = [...getValues('checkbox')]
                        newValues.splice(valueIdx, 1)
                        const newValue = [...checkedIdx]

                        return (
                          <label
                            key={symbol}
                            className="relative flex items-center "
                          >
                            <input
                              className="absolute opacity-0"
                              type="checkbox"
                              value={symbol}
                              checked={checkedIdx[i]}
                              onChange={() => {
                                newValue[i] = false
                                setValue('checkbox', newValues)
                                setCheckedIdx(newValue)
                              }}
                            />
                            <span
                              className={`material-icons-outlined mr-2 text-lg leading-none ${
                                checkedIdx[i]
                                  ? 'text-gray-700'
                                  : 'text-gray-400'
                              }`}
                            >
                              {checkedIdx[i]
                                ? 'check_box'
                                : 'check_box_outline_blank'}
                            </span>
                            {type === 'web' ? title : styleSymbol(symbol)}
                          </label>
                        )
                      }
                      return null
                    })
                  )}
                </div>
                <button
                  className={`btn-primary relative ml-auto ${
                    isSubmitSuccessful ? 'hidden' : 'block'
                  }`}
                  type="submit"
                  disabled={isSubmitting}
                  // onClick={() => handleSubmit(onSubmit)}
                >
                  Commit
                </button>
              </div>
            </form>
          </div>
        </Modal>
      </FormProvider>
    </div>
  )
}
