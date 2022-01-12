import { title } from 'process'
import React, { useEffect, useState } from 'react'
import { useForm, useController, useFormContext, FormProvider, useWatch, Control } from 'react-hook-form'
import {
  useCreateVoteMutation,
  MyVotesDocument,
  MyVotesQuery,
  useMyVotesQuery,
  VoteFragment,
} from '../apollo/query.graphql'
import BarChart from '../components/bar/bar'
import classes from './board-form.module.scss'

export type RadioInputs = {
  choice?: string
}

export type FormInputs = {
  title?: string
  choice?: string
  lines: string
}

export const RadioInput = ({
  value,
  content,
  count,
  total,
  myVote,
  // filterComments,
  choiceValue,
  checked,
}: {
  value: string
  content: string
  count?: number
  total?: number
  myVote?: VoteFragment

  // filterComments: (i: number) => void
  choiceValue?: (i: string) => void
  checked?: boolean
}): JSX.Element => {
  // const {field}=useController({value,content})
  const methods = useFormContext()

  // const [checkedTarget, setCheckedTarget] = useState<any>(null)

  return (
    <label className="inline-flex items-center">
      <input
        {...methods.register('choice')}
        type="radio"
        value={value}
        checked={checked}
        onClick={e => {
          // handleChange(e.target)
          // setChecked(prev => !prev)
          choiceValue && choiceValue(value)
        }}
      />
      <BarChart
        content={content}
        value={parseInt(value)}
        total={total ?? 0}
        count={count ?? 0}
        voted={myVote?.choiceIdx.toString() === value}
        checked={checked}
      />
      {/* <svg width="32" height="32" viewBox="-4 -4 39 39" aria-hidden="true" focusable="false">
        
        <rect
          className={classes.checkBg}
          width="35"
          height="35"
          x="-2"
          y="-2"
          stroke="currentColor"
          fill="none"
          strokeWidth="3"
          rx="6"
          ry="6"
        ></rect>
        
        <polyline
          className={classes.checkMark}
          points="4,14 12,23 28,5"
          stroke="transparent"
          strokeWidth="4"
          fill="none"
        ></polyline>
      </svg> */}
      {/* <span>{content}</span> */}
    </label>
  )
}

const BoardForm = ({
  pollId,
  boardId,
  initialValue,
  clickedChoiceIdx,
  // pollChoices,
  refetch,
  filterComments,
}: {
  pollId: string
  boardId: string
  initialValue: FormInputs
  clickedChoiceIdx?: number
  // pollChoices?: string[]
  refetch: () => void
  filterComments: (i: number) => void
}): JSX.Element => {
  const { data: myVotesData } = useMyVotesQuery({ variables: { pollId: pollId } })
  const methods = useForm<FormInputs>()
  const [myVote, setMyVote] = useState<VoteFragment>()

  useEffect(() => {
    if (myVotesData) {
      setMyVote(myVotesData?.myVotes.find(e => e.pollId.toString() === pollId))
    }
  }, [myVotesData])

  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    initialValue.title && setValue('choice', initialValue.choice)
    initialValue.title && setValue('lines', initialValue.lines)
  }

  const [createVote] = useCreateVoteMutation({
    update(cache, { data }) {
      const res = cache.readQuery<MyVotesQuery>({
        query: MyVotesDocument,
      })
      if (data?.createVote && res?.myVotes) {
        cache.writeQuery({
          query: MyVotesDocument,
          data: { myVotes: res.myVotes.concat([data.createVote]) },
        })
      }
    },
  })

  const myHandleSubmit = (d: FormInputs) => {
    if (d.choice && pollId) {
      createVote({
        variables: {
          pollId,
          data: { choiceIdx: parseInt(d.choice) },
        },
      })
    }
    setChoiceValue(null)
    reset({ title: '', lines: '' })
  }

  return (
    <FormProvider {...methods}>
      <div>
        <form className="flex flex-col mt-4 mb-8" onSubmit={handleSubmit(myHandleSubmit)}>
          <div className="mb-3 last:mb-0">
            <input className={classes.comment} type="text" {...register('lines')} placeholder="留言..." />
          </div>
          <button>送出</button>
        </form>
      </div>
    </FormProvider>
  )
}
export default BoardForm
