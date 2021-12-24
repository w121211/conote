import { useApolloClient } from '@apollo/client'
// import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import { RateChoice } from 'graphql-let/__generated__/__types__'
import {
  AuthorDocument,
  AuthorQuery,
  AuthorQueryVariables,
  RateDocument,
  RateFragment,
  RateQuery,
  useCardQuery,
  useCreateRateMutation,
  useLinkLazyQuery,
} from '../../apollo/query.graphql'

export interface FormInput {
  author: string
  choice: RateChoice
  target: string
  link?: string
}

// const AsyncAuthor = () => {
//   const
//   return <AsyncSelect cacheOptions defaultOptions loadOptions={} />
// }

const CreateRateForm = ({
  initialInput,
  onRateCreated,
}: {
  initialInput: FormInput
  onRateCreated: (rate: RateFragment, targetSymbol: string) => void
}): JSX.Element => {
  // const router = useRouter()
  const [showPopup, setShowPopup] = useState(false)
  const [skipCardQuery, setSkipCardQuery] = useState(true)
  const { author, choice, target, link } = initialInput
  const [targetId, setTargetId] = useState<string | undefined>()
  const client = useApolloClient()
  const { register, handleSubmit, control, watch } = useForm<FormInput>({
    defaultValues: { ...initialInput },
  })

  let linkId: string
  const { data: targetCardData } = useCardQuery({
    fetchPolicy: 'cache-first',
    variables: { symbol: target },
    // skip: skipCardQuery,
  })
  const [queryLink] = useLinkLazyQuery({
    variables: { url: link },
    onCompleted(data) {
      if (data.link) {
        linkId = data.link.id
      }
    },
  })
  useEffect(() => {
    if (targetCardData?.card) {
      setTargetId(targetCardData.card.id)
    }
  }, [targetCardData])

  const watchChoice = watch('choice')
  const watchAuthor = watch('author')
  console.log(watchChoice)

  const [createRate, { data: rateData }] = useCreateRateMutation({
    update(cache, { data }) {
      const res = cache.readQuery<RateQuery>({
        query: RateDocument,
      })
      if (data?.createRate && res?.rate) {
        cache.writeQuery({
          query: RateDocument,
          data: {
            targetId: data.createRate.symId,
            choice: data.createRate.choice,
            authorId: data.createRate.authorId,
            linkId: data.createRate.linkId,
          },
        })
      }
    },
    onCompleted(data) {
      // console.log(data.createRate, targetCardData)
      if (data.createRate && targetCardData && targetCardData.card) {
        onRateCreated(data.createRate, targetCardData.card.sym.symbol)
      } else {
        throw 'Create shot error'
      }
    },
  })
  // const filterAuthor = (inputValue: string) => {
  //   return [inputValue]
  // }
  // const promiseOptions = (inputValue: string, callback: (authors: string[]) => void) =>
  //   new Promise(resolve => {
  //     client.query<AuthorQuery, AuthorQueryVariables>({
  //       query: AuthorDocument,
  //       variables: { name: inputValue },
  //     })
  //     resolve(filterAuthor)
  //   })

  const myHandleSubmit = (d: FormInput) => {
    if (d.target) {
      if (d.link) {
        queryLink({ variables: { url: d.link ?? '' } })
      }
      // console.log(targetId)
      if (targetId) {
        createRate({
          variables: {
            data: {
              targetId: targetId,
              linkId: linkId ?? undefined,
              choice: d.choice,
              // authorId:
            },
          },
        })
      }
    }
  }
  return (
    <div className="">
      <h2 className="mb-6 text-2xl font-bold text-gray-800">新增預測</h2>
      <form className="flex flex-col " onSubmit={handleSubmit(myHandleSubmit)}>
        <label className="group flex items-center relative w-fit mb-4">
          {
            // initialInput.author ? <button type="button">{initialInput.author}</button> : null
            // <Controller
            //   control={control}
            //   name="author"
            //   render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
            // />
          }
          <h5
            // className={`absolute top-0 left-2 leading-none font-normal text-gray-500
            // transition-all transform origin-top-left
            //   group-focus-within:translate-y-2 group-focus-within:scale-[0.8] group-focus-within:text-blue-600
            //   ${watchAuthor === '' ? 'translate-y-4 scale-100' : 'translate-y-2 scale-[0.8]'}`}
            className="w-20 text-gray-500"
          >
            名字
          </h5>
          <input
            {...register('author')}
            className="input w-40  border border-gray-300 focus:outline-blue-800"
            // className="input inline w-fit h-12 pt-6 border border-gray-300 focus:outline-blue-600"
            type="text"
          />
        </label>
        <div className="flex items-center mb-4 select-none">
          <h5 className="w-20 text-gray-500 ">預測</h5>
          <div className="flex gap-3">
            <label
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer tracking-wider transition-all ${
                watchChoice === 'LONG'
                  ? 'bg-blue-800 border-transparent '
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
            >
              {/* <span
              className={`material-icons-outlined text-lg ${
                watchChoice === 'LONG' ? 'text-blue-700' : 'text-gray-300'
              }`}
            >
              {watchChoice === 'LONG' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span> */}

              <input {...register('choice')} className="absolute opacity-0" type="radio" value="LONG" />
              <h5 className={`font-normal ${watchChoice === 'LONG' ? 'text-white' : 'text-gray-900'}`}> 看多</h5>
            </label>
            <label
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer tracking-wider transition-all ${
                watchChoice === 'SHORT'
                  ? 'bg-blue-800 border-transparent '
                  : 'bg-white hover:bg-gray-100 border-gray-200'
              }`}
            >
              {/* <span
              className={`material-icons-outlined text-lg ${
                watchChoice === 'SHORT' ? 'text-blue-700' : 'text-gray-300'
              }`}
            >
              {watchChoice === 'SHORT' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span> */}
              <input {...register('choice')} className="absolute opacity-0" type="radio" value="SHORT" />
              <h5 className={`font-normal ${watchChoice === 'SHORT' ? 'text-white' : 'text-gray-900'}`}>看空</h5>
            </label>
            <label
              className={`inline-flex items-center gap-2 px-4 py-2 border rounded cursor-pointer tracking-wider transition-all ${
                watchChoice === 'HOLD'
                  ? 'bg-blue-800 border-transparent '
                  : 'bg-white border-gray-200 hover:bg-gray-100'
              }`}
            >
              {/* <span
              className={`material-icons-outlined text-lg ${
                watchChoice === 'HOLD' ? 'text-blue-700' : 'text-gray-300 '
              }`}
            >
              {watchChoice === 'HOLD' ? 'radio_button_checked' : 'radio_button_unchecked'}
            </span> */}
              <input {...register('choice')} className="absolute opacity-0" type="radio" value="HOLD" />
              <h5 className={`font-normal ${watchChoice === 'HOLD' ? 'text-white' : 'text-gray-900'}`}> 觀望</h5>
            </label>
          </div>
        </div>
        <label className="flex items-center w-fit mb-4">
          <h5 className="w-20 text-gray-500 ">標的</h5>
          <input
            {...register('target')}
            className="input w-32  border border-gray-300 focus:outline-blue-800"
            type="text"
            placeholder="例如:$GOOG"
          />
        </label>
        <label className="flex items-center w-fit mb-4">
          <h5 className="w-20 text-gray-500 "> 來源網址</h5>
          <input
            {...register('link')}
            className="input w-96 border border-gray-300 focus:outline-blue-800"
            type="text"
            placeholder="例如:https://www.youtube.com/xxx..."
          />
        </label>
        <div className="text-center">
          <button className="btn-primary h-10 w-24 mt-8" type="submit">
            送出
          </button>
        </div>
      </form>
    </div>
  )
}
export default CreateRateForm
