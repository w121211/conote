import React, { useEffect, useState } from 'react'
import {
  useForm,
  useController,
  useFormContext,
  FormProvider,
  useWatch,
  Control,
} from 'react-hook-form'
import {
  MyPollVotesDocument,
  MyPollVotesQuery,
  PollDocument,
  PollVoteFragment,
  useCreatePollVoteMutation,
  useMyPollVotesQuery,
  usePollQuery,
} from '../../apollo/query.graphql'
import BarChart from '../bar/bar'

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
  myVote?: PollVoteFragment

  // filterComments: (i: number) => void
  choiceValue?: (i: string) => void
  checked?: boolean
}): JSX.Element => {
  const methods = useFormContext()

  return (
    <label className="relative inline-flex items-center">
      <input
        {...methods.register('choice')}
        type="radio"
        value={value}
        checked={checked}
        onClick={e => {
          e.stopPropagation()
          // handleChange(e.target)
          // setChecked(prev => !prev)
          choiceValue && choiceValue(value)
        }}
      />
      <BarChart
        content={content}
        // value={parseInt(value)}
        total={total ?? 0}
        count={count ?? 0}
        voted={myVote?.choiceIdx.toString() === value}
        checked={checked}
      />
    </label>
  )
}

const PollForm = ({
  pollId,
  initialValue,
  clickedChoiceIdx,
}: {
  pollId: string
  // boardId: string
  initialValue: FormInputs
  clickedChoiceIdx?: number
  // pollChoices?: string[]
  // refetch: () => void
  // filterComments: (i: number) => void
}): JSX.Element | null => {
  const { data: myVotesData } = useMyPollVotesQuery({ variables: { pollId } }),
    { data: pollData } = usePollQuery({ variables: { id: pollId } }),
    [createVote] = useCreatePollVoteMutation({
      update(cache, { data }) {
        const res = cache.readQuery<MyPollVotesQuery>({
          query: MyPollVotesDocument,
        })
        if (data?.createPollVote && res?.myPollVotes) {
          cache.writeQuery({
            query: MyPollVotesDocument,
            data: { myVotes: res.myPollVotes.concat([data.createPollVote]) },
          })
        }
      },
      refetchQueries: [
        { query: PollDocument, variables: { id: pollId } },
        { query: MyPollVotesDocument, variables: { pollId } },
      ],
      // onCompleted(data) {
      //   setMyVote(data.createVote)
      // },
      // refetchQueries: [{ query: BoardDocument, variables: { id: boardId } }],
    })

  const methods = useForm<FormInputs>()
  const { register, handleSubmit, setValue, reset, getValues } = methods
  const [choiceValue, setChoiceValue] = useState<number | null | undefined>()

  const [check, setChecked] = useState<boolean[]>(Array(3).fill(false))
  const [myVote, setMyVote] = useState<PollVoteFragment>()
  // const [pollCount, setPollCount] = useState<number[] | undefined>(pollData?.poll.count.nVotes)

  useEffect(() => {
    if (myVotesData) {
      setMyVote(
        myVotesData.myPollVotes.find(e => e.pollId.toString() === pollId),
      )
    }
  }, [myVotesData, pollId, pollData])

  useEffect(() => {
    setChecked(prev => {
      const newCheck = [...prev]
      if (clickedChoiceIdx !== undefined) {
        newCheck[clickedChoiceIdx] = true
      }
      return newCheck
    })
    setValue('choice', clickedChoiceIdx?.toString())
  }, [clickedChoiceIdx])

  if (initialValue) {
    // initialValue.title && setValue('title', initialValue.title)
    initialValue.title && setValue('choice', initialValue.choice)
    initialValue.title && setValue('lines', initialValue.lines)
  }

  function onSubmit(d: FormInputs) {
    if (d.choice && pollId) {
      // setPollCount(prev => {
      //   if (prev) {
      //     const newArr = [...prev]
      //     d.choice && (newArr[parseInt(d.choice)] += 1)
      //     return newArr
      //   }
      //   return prev
      // })
      createVote({
        variables: {
          pollId: pollId,
          data: { choiceIdx: parseInt(d.choice) },
        },
      })
      setChecked(Array(3).fill(false))
      setChoiceValue(null)
      reset({ title: '', lines: '' })
    }
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
      return iToNum === prev ? null : iToNum
    })
  }

  // useEffect(() => {
  //   // filterComments(
  //   //   check.findIndex((e, i) => e),
  //   //   // check,
  //   // )
  // }, [choiceValue])

  if (pollData && pollData.poll) {
    return (
      <FormProvider {...methods}>
        <div>
          <form
            className="flex flex-col mt-4 mb-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4 last:mb-0">
              <div>
                <div className="flex flex-col">
                  {pollData.poll.choices.map((e, i) => (
                    <RadioInput
                      value={`${i}`}
                      content={e}
                      total={
                        pollData.poll && pollData.poll.count.nVotes.length > 0
                          ? pollData.poll.count.nVotes.reduce((a, b) => a + b)
                          : 0
                      }
                      count={pollData.poll ? pollData.poll.count.nVotes[i] : 0}
                      // filterComments={filterComments}
                      key={i}
                      choiceValue={handleChoiceValue}
                      checked={check[i]}
                      myVote={myVote}
                    />
                  ))}
                </div>
                <div className="text-right text-gray-400">
                  共
                  {pollData.poll.count.nVotes &&
                  pollData.poll.count.nVotes.length > 0
                    ? pollData?.poll.count.nVotes.reduce((a, b) => a + b)
                    : 0}
                  人參與投票
                </div>
              </div>
            </div>
            <button className="btn-primary" disabled={myVote !== undefined}>
              {myVote ? '已投票' : '送出'}
            </button>
          </form>
        </div>
      </FormProvider>
    )
  }
  return null
}

export default PollForm
