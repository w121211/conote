import { ErrorMessage } from '@hookform/error-message'
import { title } from 'process'
import React, { useEffect, useState, useContext } from 'react'
import { useForm, useController, useFormContext, FormProvider, useWatch, Control, useFieldArray } from 'react-hook-form'
import {
  CardDocument,
  PollDocument,
  PollQuery,
  useCreatePollMutation,
  useMyVotesLazyQuery,
  usePollQuery,
  // CreateHashtagMutation,
  // useCreateHashtagMutation,
} from '../../apollo/query.graphql'
import classes from './poll-form.module.scss'
// import { SymbolContext } from '../card'

// export type RadioInputs = {
//   choice?: number | null
// }

export type PollFormInputs = {
  choices: { choice: string }[]
}

const CreatePollForm = ({
  choices,
  handlePollId,
}: {
  choices: string[]
  handlePollId: (pollId: string) => void
}): JSX.Element => {
  // const { field, fieldState } = useController({ name: 'choice' })
  const defaultData = choices.map(e => ({
    choice: e,
  }))
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    getValues,
    control,
    formState: { errors },
  } = useForm<PollFormInputs>({
    defaultValues: { choices: defaultData },
  })

  // const [queryMyVotes, { data, loading, error }] = useMyVotesLazyQuery() // 若已投票可展現投票結果
  const { fields, append, remove } = useFieldArray({ control, name: 'choices' })
  const [createPoll, { called: pollMutationCalled }] = useCreatePollMutation({
    variables: {
      data: { choices },
    },
    update(cache, { data }) {
      const res = cache.readQuery<PollQuery>({
        query: PollDocument,
      })
      if (data?.createPoll && res?.poll) {
        cache.writeQuery<PollQuery>({
          query: PollDocument,
          data: { choices: data.createPoll },
        })
      }
    },
    onCompleted(data) {
      handlePollId(data.createPoll.id)
    },
  })

  const myHandleSubmit = (d: PollFormInputs) => {
    if (d.choices.length > 0) {
      const dataArr: string[] = []
      d.choices.forEach(e => {
        if (e.choice !== '') {
          dataArr.push(e.choice)
        }
      })
      createPoll({ variables: { data: { choices: dataArr } } })
    }
  }

  return (
    <div className={classes.formContainer}>
      <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>
        <ul>
          {fields.map((choice, idx) => {
            return (
              <li key={choice.id}>
                <input
                  {...register(`choices.${idx}.choice`, { required: '請輸入選項!' })}
                  className={classes.fieldsInput}
                  type="text"
                  style={{ boxShadow: `0 0 0 2px ${errors.choices && errors.choices[idx] ? 'red' : 'transparent'}` }}
                  placeholder="新選項"
                />
                <button className="secondary" type="button" onClick={() => remove(idx)}>
                  刪除
                </button>
                <ErrorMessage
                  errors={errors}
                  name={`choices.${idx}.choice`}
                  render={({ message }) => <span className={classes.errorMsg}>{message}</span>}
                />
              </li>
            )
          })}
          <button className="secondary" type="button" onClick={() => append({ choice: '' })}>
            新增
          </button>
        </ul>

        <button className="primary" type="submit">
          送出
        </button>
      </form>
    </div>
  )
}
export default CreatePollForm
