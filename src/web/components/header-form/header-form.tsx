import React, { useEffect, useState } from 'react'
import { title } from 'process'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import classes from './header-form.module.scss'
import { useBoardQuery } from '../../apollo/query.graphql'
import { RadioInput } from '../board-form/board-form'
type FormInputs = {
  // title: string
  // authorChoice: string
  // authorLines: string
  authorName: string
  props: { title: string; value: string }[]
}

const HeaderForm = ({
  initialValue,
  boardId,
  authorName,
  pollId,
}: {
  initialValue: FormInputs
  boardId?: string
  authorName?: string
  pollId?: string
}): JSX.Element => {
  // const [authorName, setAuthorName] = useState('')
  const methods = useForm<FormInputs>({
    defaultValues: initialValue,
  })
  const { register, handleSubmit, setValue, watch, control } = methods
  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    // setValue('authorChoice', initialValue.authorChoice)
    // setValue('authorLines', initialValue.authorLines)
  }
  const { fields, append, remove } = useFieldArray({
    name: `props`,
    control,
  })
  // useEffect(() => {
  //   if (oauthorName && oauthorName !== '') {
  //     setAuthorName(oauthorName)
  //   }
  // }, [oauthorName])

  useEffect(() => {
    // setAuthorName(watch('authorName'))
  }, [watch('authorName')])
  // const { data: boardData } = useBoardQuery({ variables: { id: boardId } })
  // const [createAuthorComment] = useCreateOauthorCommentMutation()
  // const [createAuthorVote] = useCreateOauthorVoteMutation()

  const onSubmit = (d: FormInputs) => {
    // if (d.authorChoice) {
    //   // createAuthorVote({
    //   //   variables: {
    //   //     pollId,
    //   //     oauthorName: authorName,
    //   //     data: { choiceIdx: parseInt(d.authorChoice) },
    //   //   },
    //   // })
    // }
    // if (d.authorLines) {
    //   //   createAuthorComment({
    //   //     variables: {
    //   //       boardId,
    //   //       pollId,
    //   //       oauthorName: authorName,
    //   //       data: {
    //   //         content: `<${boardData?.board.poll?.choices[parseInt(d.authorChoice)] ?? ''}>${d.authorLines}`,
    //   //       },
    //   //     },
    //   //   })
    // }
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
              {authorName ? (
                <label>@{authorName.split(':', 1)}</label>
              ) : (
                <input {...register('authorName')} type="text" placeholder="來源作者" />
              )}
            </div>
          </div>
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <input
                  placeholder="標題"
                  {...register(`props.${index}.title` as const, {
                    required: true,
                  })}
                  defaultValue={field.title}
                />
                <input
                  placeholder="內容"
                  {...register(`props.${index}.value` as const, {
                    required: true,
                  })}
                  defaultValue={field.value}
                />
                <button type="button" onClick={() => remove(index)}>
                  刪除
                </button>
              </div>
            )
          })}
          <button type="button" onClick={() => append({ title: '', value: '' })}>
            + 新增項目
          </button>
          {/* <input type="text" {...register('authorLines')} placeholder="來源作者看法" /> */}
          {/* </div> */}
          <button>送出</button>
        </form>
      </div>
    </FormProvider>
  )
}

export default HeaderForm
