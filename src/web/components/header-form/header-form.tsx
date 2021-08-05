import React, { useEffect, useState } from 'react'
import { title } from 'process'
import { FormProvider, useForm } from 'react-hook-form'
import classes from './header-form.module.scss'
import {
  useBoardQuery,
  useCreateOauthorCommentMutation,
  useCreateOauthorVoteMutation,
} from '../../apollo/query.graphql'
import { RadioInput } from '../board-form/board-form'
type FormInputs = {
  // title: string
  authorChoice: string
  authorLines: string
  authorName: string
}

const HeaderForm = ({
  initialValue,
  boardId,
  oauthorName,
  pollId,
}: {
  initialValue: FormInputs
  boardId: string
  oauthorName: string
  pollId: string
}) => {
  const [authorName, setAuthorName] = useState('')
  const methods = useForm<FormInputs>()
  const { register, handleSubmit, setValue, watch } = methods
  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    setValue('authorChoice', initialValue.authorChoice)
    setValue('authorLines', initialValue.authorLines)
  }

  useEffect(() => {
    if (oauthorName && oauthorName !== '') {
      setAuthorName(oauthorName)
    }
  }, [oauthorName])

  useEffect(() => {
    setAuthorName(watch('authorName'))
  }, [watch('authorName')])
  const { data: boardData } = useBoardQuery({ variables: { id: boardId } })
  const [createAuthorComment] = useCreateOauthorCommentMutation()
  const [createAuthorVote] = useCreateOauthorVoteMutation()

  const onSubmit = (d: FormInputs) => {
    if (d.authorChoice) {
      createAuthorVote({
        variables: {
          pollId,
          oauthorName: authorName,
          data: { choiceIdx: parseInt(d.authorChoice) },
        },
      })
    }
    if (d.authorLines) {
      createAuthorComment({
        variables: {
          boardId,
          pollId,
          oauthorName: authorName,
          data: {
            content: `<${boardData?.board.poll?.choices[parseInt(d.authorChoice)] ?? ''}>${d.authorLines}`,
          },
        },
      })
    }
  }

  return (
    <FormProvider {...methods}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          {/* <div className={classes.section}> */}
          {/* <label>Symbol/Topic</label> */}
          {/* <input type="text" {...register('title')} placeholder="Symbol 或 Topic" /> */}
          {/* </div> */}
          {/* <div className={classes.section}> */}
          <div className={classes.choiceWrapper}>
            <div>
              {oauthorName !== '' ? (
                <label>@{oauthorName.split(':', 1)}</label>
              ) : (
                <input {...register('authorName')} type="text" placeholder="來源作者" />
              )}
            </div>

            <div className={classes.radioWrapper}>
              {boardData?.board.poll?.choices &&
                boardData.board.poll.choices.map((e, i) => <RadioInput value={`${i}`} content={e} key={i} />)}
            </div>
          </div>
          <input type="text" {...register('authorLines')} placeholder="來源作者看法" />
          {/* </div> */}
          <button>送出</button>
        </form>
      </div>
    </FormProvider>
  )
}
export default HeaderForm
