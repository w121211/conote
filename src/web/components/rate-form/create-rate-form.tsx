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
  choice: RateChoice | ''
  target: string
  link?: string
}

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
    defaultValues: { ...initialInput, choice: choice ? (choice.substring(1) as RateChoice) : '' },
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
      console.log(data.createRate, targetCardData)
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
    if (d.target && d.choice !== '') {
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
      <form className="flex flex-col " onSubmit={handleSubmit(myHandleSubmit)}>
        <label>
          <h5 className="inlin-block"> 作者</h5>
          {
            // initialInput.author ? <button type="button">{initialInput.author}</button> : null
            // <Controller
            //   control={control}
            //   name="author"
            //   render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
            // />
            <input {...register('author')} className="input inline w-fit" type="text" />
          }
        </label>
        <div className="inline-flex gap-4 mb-4 select-none">
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer tracking-wider ${
              watchChoice === 'LONG' ? 'bg-blue-700 border-transparent' : 'bg-white border-gray-200'
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
            <h5 className={`font-normal ${watchChoice === 'LONG' ? 'text-white' : 'text-gray-600'}`}> 看多</h5>
          </label>
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer tracking-wider ${
              watchChoice === 'SHORT' ? 'bg-blue-700 border-transparent' : 'bg-white border-gray-200'
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
            <h5 className={`font-normal ${watchChoice === 'SHORT' ? 'text-white' : 'text-gray-600'}`}>看空</h5>
          </label>
          <label
            className={`inline-flex items-center gap-2 px-3 py-2 border rounded cursor-pointer tracking-wider ${
              watchChoice === 'HOLD' ? 'bg-blue-700 border-transparent' : 'bg-white border-gray-200'
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
            <h5 className={`font-normal ${watchChoice === 'HOLD' ? 'text-white' : 'text-gray-600'}`}> 觀望</h5>
          </label>
        </div>
        <label>
          <h5>標的</h5>
          <input {...register('target')} className="input" type="text" />
        </label>
        <label>
          <h5> 來源網址</h5>
          <input {...register('link')} className="input" type="text" />
        </label>

        <button className="btn-primary" type="submit">
          送出
        </button>
      </form>
    </div>
  )
}
export default CreateRateForm
