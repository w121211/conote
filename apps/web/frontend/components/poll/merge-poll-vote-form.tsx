import { isNil } from 'lodash'
import { useRouter } from 'next/router'
import React from 'react'
import { useForm, FormProvider } from 'react-hook-form'
import {
  MyPollVotesDocument,
  MyPollVotesQuery,
  PollFragment,
  PollVoteFragment,
  useCreatePollVoteMutation,
  useMyPollVotesQuery,
} from '../../../apollo/query.graphql'
import { MERGE_POLL_V1_0 } from '../../../share/constants'
import BarChart from '../bar/bar'
import { FormSubmitBtn } from '../ui-component/form/form-submit-btn'

const MergePollResult = ({
  poll,
  myVote,
}: {
  poll: PollFragment
  myVote: PollVoteFragment
}) => {
  const { choices, count } = poll,
    acceptIdx = 0,
    nAccepts = count.nVotes[acceptIdx],
    nRejects = count.nVotes.reduce(
      (acc, cur, i) => (i === acceptIdx ? acc : acc + cur),
      0,
    ),
    nTotal = nAccepts + nRejects,
    myChoice = choices[myVote.choiceIdx],
    isAccept = myChoice === 'accept'
  // myRejectReason = isAccept
  //   ? null
  //   : MERGE_POLL_V1_0.codes.find(([code]) => code === myChoice)

  // if (myRejectReason === undefined) {
  //   console.debug('Reject code not found: ' + myChoice)
  // }

  return (
    <div>
      <label className="relative inline-flex items-center">
        {/* <input className="absolute opacity-0" type="radio" checked={isAccept} /> */}
        <BarChart
          content={'Agree'}
          total={nTotal}
          count={nAccepts}
          voted={isAccept}
          checked={isAccept}
        />
      </label>
      <label className="relative inline-flex items-center">
        {/* <input
          className="absolute opacity-0"
          type="radio"
          checked={!isAccept}
        /> */}
        <BarChart
          content={'Disagree'}
          total={nTotal}
          count={1}
          voted={!isAccept}
          checked={!isAccept}
        />
      </label>
      {/* {myRejectReason && (
        <div>You vote disagree because {myRejectReason[1]}</div>
      )} */}
    </div>
  )
}

type FormInputs = {
  choice: string
  rejectCode?: string
}

const agreeCode = MERGE_POLL_V1_0.codes[0],
  rejectCodes = MERGE_POLL_V1_0.codes.slice(1)

const MergePollVoteForm = ({ poll }: { poll: PollFragment }) => {
  const pollId = poll.id,
    router = useRouter(),
    qMyPollVotes = useMyPollVotesQuery({ variables: { pollId } }),
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
    }),
    methods = useForm<FormInputs>({ mode: 'onChange' }),
    {
      register,
      handleSubmit,
      formState: { isSubmitting, isValid },
      watch,
    } = methods,
    watchChoice = watch('choice'),
    watchRejectCode = watch('rejectCode')

  async function onSubmit(d: FormInputs) {
    let choice: string | undefined

    // console.debug(d)
    if (d.choice === 'agree') {
      choice = agreeCode[0]
    }
    if (d.choice === 'disagree') {
      const found = rejectCodes.find(([code]) => code === d.rejectCode)
      if (found) {
        choice = found[0]
      }
    }
    if (choice === undefined) throw new Error('choice === undefined')

    await createVote({
      variables: {
        pollId,
        data: { choiceIdx: poll.choices.findIndex(e => e === choice) },
      },
    })

    router.reload()
  }

  let myVote: PollVoteFragment | undefined

  if (qMyPollVotes.loading) return null
  if (qMyPollVotes.data?.myPollVotes) {
    myVote = qMyPollVotes.data.myPollVotes.find(e => e.pollId === pollId)
  }
  if (myVote) {
    return <MergePollResult poll={poll} myVote={myVote} />
  }
  return (
    <div>
      <FormProvider {...methods}>
        <div>
          <form
            className="flex flex-col mt-4 mb-8"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-4 last:mb-0">
              <div>
                <div className="flex flex-col">
                  <label>
                    <input
                      {...register('choice', { required: true })}
                      type="radio"
                      name="choice"
                      value="agree"
                    />
                    Agree
                  </label>

                  <label>
                    <input
                      {...register('choice')}
                      type="radio"
                      name="choice"
                      value="disagree"
                    />
                    Disagree
                  </label>

                  {watchChoice === 'disagree' && (
                    <div>
                      {rejectCodes.map(([code, desc]) => (
                        <div key={code}>
                          <label>
                            <input
                              {...register('rejectCode')}
                              type="radio"
                              name="rejectCode"
                              value={code}
                            />
                            {desc}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* <div className="text-right text-gray-400">
                {totalVotes} votes in total.
              </div> */}
              </div>
            </div>
            <FormSubmitBtn
              isDisable={
                myVote !== undefined ||
                !isNil(qMyPollVotes.error) ||
                isSubmitting ||
                !isValid ||
                (watchChoice === 'disagree' && isNil(watchRejectCode))
              }
            >
              Submit
            </FormSubmitBtn>
          </form>
        </div>
      </FormProvider>
    </div>
  )
}

export default MergePollVoteForm
