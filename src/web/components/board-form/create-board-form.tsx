import { title } from 'process'
import { useEffect, useState, useContext } from 'react'
import { useForm, useController, useFormContext, FormProvider, useWatch, Control } from 'react-hook-form'
import {
  BoardDocument,
  BoardQuery,
  CreateBoardDocument,
  CreateBoardMutation,
  useCreateBoardMutation,
  CardDocument,
} from '../../apollo/query.graphql'
import classes from './board-form.module.scss'
import { SymbolContext } from '../../pages/lab/card'

export type RadioInputs = {
  choice?: number | null
}

export type BoardFormInputs = {
  hashtag: string

  description?: string
}

const CreateBoardForm = ({
  cardId,
  bulletId,
  handleboardId,
}: // initialValue

// pollChoices,
// refetch,
// filterComments,
{
  cardId: string
  bulletId: string
  handleboardId: (d: CreateBoardMutation) => void
  // initialValue: FormInputs

  // pollChoices?: string[]
  // refetch: () => void
  // filterComments: (i: number) => void
}) => {
  // const { field, fieldState } = useController({ name: 'choice' })
  const { register, handleSubmit, setValue, reset, getValues } = useForm<BoardFormInputs>()
  const context = useContext(SymbolContext)

  // const [choiceValue, setChoiceValue] = useState<number | null | undefined>()
  // const [check, setChecked] = useState<boolean[]>(Array(pollChoices?.length).fill(false))

  // if (initialValue) {
  //   // initialValue.title && setValue('title', initialValue.title)
  //   initialValue.title && setValue('choice', initialValue.choice)
  //   initialValue.title && setValue('lines', initialValue.lines)
  // }

  const [createBoard] = useCreateBoardMutation({
    update(cache, { data }) {
      const res = cache.readQuery<BoardQuery>({
        query: BoardDocument,
      })
      if (data?.createBoard && res?.board) {
        cache.writeQuery({
          query: BoardDocument,
          data: { board: data.createBoard },
        })
      }
      // handleboardId(data?.createBoard.id)

      // refetch()
    },
    onCompleted(data) {
      handleboardId(data)
    },
    refetchQueries: [{ query: CardDocument, variables: { symbol: context.symbol } }],
    // refetchQueries: [{ query: BoardDocument }],
  })

  const myHandleSubmit = (d: BoardFormInputs) => {
    if (d.hashtag) {
      createBoard({
        variables: {
          bulletId,
          cardId,
          data: { content: d.description ?? '', hashtag: d.hashtag, meta: '' },
        },
      })
      console.log(bulletId, cardId, d.hashtag)
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
      <form className={classes.form} onSubmit={handleSubmit(myHandleSubmit)}>
        {/* <div className={classes.section}> */}
        <label>
          <input type="text" {...register('hashtag')} placeholder="#建立hashtag" />{' '}
        </label>
        {/* </div> */}
        <div className={classes.section}>
          <input className={classes.comment} type="text" {...register('description')} placeholder="簡述..." />
        </div>
        <button>送出</button>
      </form>
    </div>
  )
}
export default CreateBoardForm