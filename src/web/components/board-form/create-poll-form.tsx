import { title } from 'process'
import React, { useEffect, useState, useContext } from 'react'
import { useForm, useController, useFormContext, FormProvider, useWatch, Control } from 'react-hook-form'
import {
  BoardDocument,
  BoardQuery,
  CardDocument,
  PollDocument,
  PollQuery,
  useCreatePollMutation,
  useMyVotesLazyQuery,
  usePollQuery,
  // CreateHashtagMutation,
  // useCreateHashtagMutation,
} from '../../apollo/query.graphql'
import classes from './board-form.module.scss'
// import { SymbolContext } from '../card'

export type RadioInputs = {
  choice?: number | null
}

export type BoardFormInputs = {
  hashtag: string

  description?: string
}

const CreatePollForm = ({
  // cardId,
  bulletId,
  choices,
}: {
  bulletId: string
  choices: string[]
}): JSX.Element => {
  // const { field, fieldState } = useController({ name: 'choice' })
  const { register, handleSubmit, setValue, reset, getValues } = useForm<BoardFormInputs>()
  const [queryMyVotes, { data, loading, error }] = useMyVotesLazyQuery() // 若已投票可展現投票結果
  // const {data:pollData}=usePollQuery({})
  const [createPoll, { called: pollMutationCalled }] = useCreatePollMutation({
    variables: {
      bulletId: parseInt(bulletId),
      data: { choices },
    },
    update(cache, { data }) {
      const res = cache.readQuery<PollQuery>({
        query: PollDocument,
      })
      if (data?.createPoll && res?.poll) {
        cache.writeQuery({
          query: BoardDocument,
          data: { board: data.createPoll },
        })
      }
    },
    onCompleted(data) {
      //
    },
  })
  if (!pollMutationCalled) {
    createPoll()
  }
  const myHandleSubmit = (d: BoardFormInputs) => {
    if (d.hashtag) {
      // createHashtag({
      //   variables: {
      //     bulletId,
      //     cardId,
      //     data: { content: d.description ?? '', hashtag: d.hashtag, meta: '' },
      //   },
      // })
      // console.log(bulletId, cardId, d.hashtag)
    }

    reset({ hashtag: '', description: '' })
  }

  // const handleChoiceValue = (i: number) => {
  //   // console.log()
  //   setChecked(prevArr => {
  //     const newArr = [...prevArr]
  //     const oldIndex = newArr.findIndex(e => e === true)
  //     if (oldIndex === i) {
  //       newArr[i] = false
  //     } else {
  //       newArr[i] = !newArr[i]
  //       newArr[oldIndex] = !newArr[oldIndex]
  //     }

  //     return newArr
  //   })
  //   setChoiceValue(prev => {
  //     // console.log(prev, i, prev === i)

  //     return i === prev ? null : i
  //   })
  // }

  return (
    <div className={classes.formContainer}>
      {/* <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>

        <label>
          <input type="text" {...register('hashtag')} placeholder="#建立hashtag" />{' '}
        </label>
  
        <div className={classes.section}>
          <input className={classes.comment} type="text" {...register('description')} placeholder="簡述..." />
        </div>
        <button>送出</button>
      </form> */}
    </div>
  )
}
export default CreatePollForm
