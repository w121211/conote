import React, { forwardRef, useEffect, useRef, useState } from 'react'
import useMeasure from 'react-use-measure'
import { usePollQuery } from '../../apollo/query.graphql'
import PollForm, { FormInputs } from '../../components/poll-form/poll-form'
// import LineChart from '../../__deprecated__/lineChart'
import BarChart from '../../components/bar/bar'
import AuthorPollForm from '../../components/poll-form/_author-poll-form'

const AuthorPollPage = ({
  pollId,
  // description,
  clickedChoiceIdx,
  author,
  title,
}: {
  // boardId: string
  author: string
  pollId: string
  clickedChoiceIdx?: number
  //  description?:string

  title?: string
}): JSX.Element => {
  const { data, loading, error } = usePollQuery({
    variables: { id: pollId },
  })

  if (loading) {
    return <p>loading...</p>
  }
  if (error) {
    console.error(error)
    return <p>API error</p>
  }

  if (data && data?.poll !== null && data?.poll !== undefined) {
    return (
      <>
        <div>
          <div>{data.poll.choices}</div>
          <AuthorPollForm
            author={author}
            pollId={pollId}
            initialValue={{ title: '', choice: undefined, lines: '' }}
            clickedChoiceIdx={clickedChoiceIdx}
          />
        </div>
      </>
    )
  }
  return <h4>好像出錯了...</h4>
}

// Discuss.displayName = 'Discuss'
export default AuthorPollPage
