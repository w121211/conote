import { useApolloClient } from '@apollo/client'
import React, { useEffect, useState } from 'react'
import { Controller, set, useForm } from 'react-hook-form'
import AsyncSelect from 'react-select/async'
import {
  AuthorQuery,
  AuthorQueryVariables,
  Shot,
  ShotChoice,
  ShotDocument,
  ShotInput,
  ShotQuery,
  useAuthorQuery,
  useCardLazyQuery,
  useCardQuery,
  useCreateShotMutation,
  useLinkLazyQuery,
  useLinkQuery,
} from '../../apollo/query.graphql'
import classes from './shot-form.module.scss'

export interface FormInput {
  author: string
  choice: ShotChoice | ''
  target: string
  link?: string
}

const CreateShotForm = ({
  initialInput,
  handleShotData,
}: {
  initialInput: FormInput
  handleShotData: (shot: Shot) => void
}): JSX.Element => {
  const [skipCardQuery, setSkipCardQuery] = useState(true)
  const { author, choice, target, link } = initialInput
  const [targetId, setTargetId] = useState<string | undefined>()
  const client = useApolloClient()
  //   const { data: authorData } = useAuthorQuery({ variables: { id: authorId ?? '' } })
  //   let targetId: string
  let linkId: string
  const { data: CardData } = useCardQuery({
    fetchPolicy: 'cache-first',
    variables: { symbol: target },
    // skip: skipCardQuery,
    onCompleted(data) {
      console.log('queryCard')
      if (data.card) {
        // targetId = data.card?.id
      }
    },
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
    if (CardData?.card) {
      setTargetId(CardData.card.id)
    }
  }, [CardData])

  const { register, handleSubmit, control } = useForm<FormInput>({
    defaultValues: { ...initialInput, choice: choice ? (choice.substr(1) as ShotChoice) : '' },
  })
  const [createShot, { data: shotData }] = useCreateShotMutation({
    update(cache, { data }) {
      const res = cache.readQuery<ShotQuery>({
        query: ShotDocument,
      })
      if (data?.createShot && res?.shot) {
        cache.writeQuery({
          query: ShotDocument,
          data: {
            targetId: data.createShot.targetId,
            choice: data.createShot.choice,
            authorId: data.createShot.authorId,
            linkId: data.createShot.linkId,
          },
        })
      }
    },
    onCompleted(data) {
      //   console.log(data.createShot.id)
      if (data.createShot) {
        handleShotData(data.createShot)
      }
    },
  })

  const promiseOptions = (inputValue: string) => {
    const { data: authorData } = useAuthorQuery({ fetchPolicy: 'cache-first', variables: {} })
    // new Promise(client.query<AuthorQuery, AuthorQueryVariables>({

    //     variables: { id: mirrorSymbol },
    //   }),)
  }

  const myHandleSubmit = (d: FormInput) => {
    if (d.target && d.choice !== '') {
      setSkipCardQuery(false)

      if (d.link) {
        queryLink({ variables: { url: d.link ?? '' } })
      }
      console.log(targetId)
      if (targetId) {
        createShot({
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
    <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>
      <label>
        <h5> 作者</h5>
        <Controller
          control={control}
          name="author"
          render={({ field: { value } }) => <AsyncSelect cacheOptions loadOptions={promiseOptions} />}
        />
        {/* <input {...register('author')} type="text" /> */}
      </label>
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
      <label>
        <h5>Ticker</h5>
        <input {...register('target')} type="text" />
      </label>
      <label>
        <h5> 來源網址</h5>
        <input {...register('link')} type="text" />
      </label>

      <button className="primary" type="submit">
        <h5> 送出</h5>
      </button>
    </form>
  )
}
export default CreateShotForm
