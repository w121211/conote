import React, { useCallback, useEffect, useMemo, useState } from 'react'
import {
  MyNoteDraftEntriesQuery,
  useCommitNoteDraftsMutation,
  useMyNoteDraftEntriesQuery,
} from '../../apollo/query.graphql'

/**
 *
 */
export const CommitPanel = (): JSX.Element | null => {
  const { data, loading, error } = useMyNoteDraftEntriesQuery(),
    [
      commitNoteDrafts,
      {
        data: commitNoteDraftsData,
        loading: commitNoteDraftsLoading,
        error: commitNoteDraftsError,
      },
    ] = useCommitNoteDraftsMutation()

  const { checkedDrafts, checkBoxForm } = reactSelectForm()

  if (loading) {
    return null
  }
  if (error) {
    console.error(error)
    return <div>Error</div>
  }
  if (data === undefined) {
    return <div>Error</div>
  }

  return (
    <div>
      {checkBoxForm}

      {checkedDrafts}

      <button
        onClick={e => {
          commitNoteDrafts({ variables: { draftIds: checkedDrafts } })
        }}
      >
        Commit
      </button>
    </div>
  )
}
