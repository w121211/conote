import { title } from 'process'
import React, { useEffect, useState, useContext } from 'react'
import {
  useForm,
  useController,
  useFormContext,
  FormProvider,
  useWatch,
  Control,
  useFieldArray,
} from 'react-hook-form'
import {
  PollDocument,
  PollQuery,
  useCreatePollMutation,
} from '../../../apollo/query.graphql'

export type PollFormInputs = {
  choices: { choice: string }[]
}

const PollCreateForm = ({
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
        cache.writeQuery({
          query: PollDocument,
          data: { choices: data.createPoll.choices },
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
    <div>
      <form
        className="flex flex-col mt-4 mb-8"
        onSubmit={handleSubmit(myHandleSubmit)}
      >
        <ul>
          {fields.map((choice, idx) => {
            return (
              <li className="mb-2" key={choice.id}>
                <input
                  {...register(`choices.${idx}.choice`, {
                    required: 'Enter option',
                  })}
                  type="text"
                  style={{
                    boxShadow: `0 0 0 2px ${
                      errors.choices && errors.choices[idx]
                        ? 'red'
                        : 'transparent'
                    }`,
                  }}
                  placeholder="New option"
                />
                <button
                  className="btn-secondary ml-2"
                  type="button"
                  onClick={() => remove(idx)}
                >
                  Delete
                </button>
                {/* <ErrorMessage
                  errors={errors}
                  name={`choices.${idx}.choice`}
                  render={({ message }) => (
                    <span className="inline text-red-700 before:content-['⚠ ']">
                      {message}
                    </span>
                  )}
                /> */}
              </li>
            )
          })}
          <button
            className="btn-secondary"
            type="button"
            onClick={() => append({ choice: '' })}
          >
            Add
          </button>
        </ul>

        <button className="btn-primary" type="submit">
          Submit
        </button>
      </form>
    </div>
  )
}
export default PollCreateForm
