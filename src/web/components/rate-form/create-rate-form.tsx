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
  //   const { data: authorData
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

  const { register, handleSubmit, control } = useForm<FormInput>({
    defaultValues: { ...initialInput, choice: choice ? (choice.substring(1) as RateChoice) : '' },
  })
  const [createShot, { data: rateData }] = useCreateRateMutation({
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
  const filterAuthor = (inputValue: string) => {
    return [inputValue]
  }
  const promiseOptions = (inputValue: string, callback: (authors: string[]) => void) =>
    new Promise(resolve => {
      client.query<AuthorQuery, AuthorQueryVariables>({
        query: AuthorDocument,
        variables: { name: inputValue },
      })
      resolve(filterAuthor)
    })

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
    <>
      <form className="flex flex-col mt-4 mb-8" onSubmit={handleSubmit(myHandleSubmit)}>
        <label>
          <h5> 作者</h5>
          {
            initialInput.author ? <button type="button">{initialInput.author}</button> : null
            // <Controller
            //   control={control}
            //   name="author"
            //   render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
            // />
            // <input {...register('author')} type="text" />
          }
        </label>
        <div className="flex">
          <label>
            <input {...register('choice')} type="radio" value="LONG" />
            <h5> 看多</h5>
          </label>
          <label>
            <input {...register('choice')} type="radio" value="SHORT" />
            <h5> 看空</h5>
          </label>
          <label>
            <input {...register('choice')} type="radio" value="HOLD" />
            <h5> 觀望</h5>
          </label>
        </div>
        <label>
          <h5>Ticker</h5>
          <input {...register('target')} type="text" />
        </label>
        <label>
          <h5> 來源網址</h5>
          <input {...register('link')} type="text" />
        </label>

        <button className="btn-primary" type="submit">
          <h5> 送出</h5>
        </button>
      </form>
      {/* <Popup
        visible={showPopup}
        hideBoard={() => setShowPopup(false)}
        buttons={
          <>
            <button
              className="btn-secondary"
              onClick={() => {
                router.push(`/author/${initialInput.author}`)
              }}
            >
              確定
            </button>
            <button className="btn-primary" onClick={() => setShowPopup(false)}>
              取消
            </button>
          </>
        }
      >
        尚未儲存的內容將丟失，確立離開本頁嗎？
      </Popup> */}
    </>
  )
}
export default CreateRateForm
