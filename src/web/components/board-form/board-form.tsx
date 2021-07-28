import { title } from 'process'
import { useEffect, useState } from 'react'
import { useForm, useController, useFormContext, FormProvider, useWatch, Control } from 'react-hook-form'
import {
  useCreateCommentMutation,
  CommentsDocument,
  CommentsQuery,
  useBoardQuery,
  Board,
  useCreateVoteMutation,
  MyVotesDocument,
  MyVotesQuery,
  BoardDocument,
} from '../../apollo/query.graphql'
import classes from './board-form.module.scss'

export type RadioInputs = {
  choice?: string
}

export type FormInputs = {
  title?: string
  choice?: string
  lines: string
}

const RadioInput = ({
  value,
  content,
  // filterComments,
  choiceValue,
  checked,
}: {
  value: string
  content: string
  // filterComments: (i: number) => void
  choiceValue: (i: string) => void
  checked: boolean
}) => {
  // const {field}=useController({value,content})
  const methods = useFormContext()

  // const [checkedTarget, setCheckedTarget] = useState<any>(null)

  return (
    <label className={classes.radioLabel}>
      <input
        {...methods.register('choice')}
        type="radio"
        value={value}
        checked={checked}
        onClick={e => {
          // handleChange(e.target)
          // setChecked(prev => !prev)
          choiceValue(value)
        }}
      />
      <svg width="32" height="32" viewBox="-4 -4 39 39" aria-hidden="true" focusable="false">
        {/* <!-- The background --> */}
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
        {/* <!-- The checkmark--> */}
        <polyline
          className={classes.checkMark}
          points="4,14 12,23 28,5"
          stroke="transparent"
          strokeWidth="4"
          fill="none"
        ></polyline>
      </svg>
      <span>{content}</span>
    </label>
  )
}

const BoardForm = ({
  pollId,
  boardId,
  initialValue,

  pollChoices,
  refetch,
  filterComments,
}: {
  pollId?: string
  boardId: string
  initialValue: FormInputs

  pollChoices?: string[]
  refetch: () => void
  filterComments: (i: number) => void
}) => {
  // const { field, fieldState } = useController({ name: 'choice' })
  const methods = useForm<FormInputs>()
  const { register, handleSubmit, setValue, reset, getValues } = methods
  const [choiceValue, setChoiceValue] = useState<number | null | undefined>()
  const [check, setChecked] = useState<boolean[]>(Array(pollChoices?.length).fill(false))

  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    initialValue.title && setValue('choice', initialValue.choice)
    initialValue.title && setValue('lines', initialValue.lines)
  }

  const [createComment] = useCreateCommentMutation({
    update(cache, { data }) {
      const res = cache.readQuery<CommentsQuery>({
        query: CommentsDocument,
      })
      if (data?.createComment && res?.comments) {
        cache.writeQuery({
          query: CommentsDocument,
          data: { comments: res.comments.concat([data.createComment]) },
        })
      }
      // refetch()
    },
    refetchQueries: [{ query: CommentsDocument, variables: { boardId: boardId } }],
  })

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
      // refetch()
    },
    refetchQueries: [{ query: BoardDocument, variables: { id: boardId } }],
  })

  const myHandleSubmit = (d: FormInputs) => {
    if (d.lines) {
      createComment({
        variables: {
          boardId,
          pollId,
          data: { content: `${pollChoices && d.choice ? '<' + pollChoices[parseInt(d.choice)] + '>' : ''} ${d.lines}` },
        },
      })
    }
    if (d.choice && pollId) {
      createVote({
        variables: {
          pollId,
          data: { choiceIdx: parseInt(d.choice) },
        },
      })
      console.log(typeof d.choice, pollId)
    }
    setChecked(Array(pollChoices?.length).fill(false))
    setChoiceValue(null)
    reset({ title: '', choice: undefined, lines: '' })
  }

  const handleChoiceValue = (i: string) => {
    // console.log()
    const iToNum = parseInt(i)
    setChecked(prevArr => {
      const newArr = [...prevArr]
      const oldIndex = newArr.findIndex(e => e === true)
      if (oldIndex === iToNum) {
        newArr[iToNum] = false
      } else {
        newArr[iToNum] = !newArr[iToNum]
        newArr[oldIndex] = !newArr[oldIndex]
      }

      return newArr
    })
    setChoiceValue(prev => {
      // console.log(prev, i, prev === i)

      return iToNum === prev ? null : iToNum
    })
  }
  // useEffect(()=>{

  // },[choiceValue])

  useEffect(() => {
    filterComments(
      check.findIndex((e, i) => e),
      // check,
    )
  }, [choiceValue])
  // console.log(pollChoices)

  return (
    <FormProvider {...methods}>
      <div className={classes.formContainer}>
        <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>
          {/* <div className={classes.section}> */}
          {/* <label>Symbol/Topic</label> */}
          {/* <input type="text" {...register('title')} placeholder="Symbol 或 Topic" /> */}
          {/* </div> */}
          <div className={classes.section}>
            {pollChoices && pollId && (
              <div className={classes.choiceWrapper}>
                {/* <label>@作者</label> */}
                <div className={classes.radioWrapper}>
                  {pollChoices.map((e, i) => (
                    <RadioInput
                      value={`${i}`}
                      content={e}
                      // filterComments={filterComments}
                      key={i}
                      choiceValue={handleChoiceValue}
                      checked={check[i]}
                    />
                  ))}
                </div>
              </div>
            )}
            <input className={classes.comment} type="text" {...register('lines')} placeholder="留言..." />
          </div>
          <button>送出</button>
        </form>
      </div>
    </FormProvider>
  )
}
export default BoardForm
