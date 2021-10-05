/* eslint-disable no-console */
import { ApolloClient, ApolloError, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { BoardStatus, CardType } from '@prisma/client'
import { Token } from 'prismjs'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { useCreateCardBodyMutation } from '../../apollo/query.graphql'

const TestPage = (): JSX.Element => {
  const [createCardBody, { error }] = useCreateCardBodyMutation({
    onError: err => {
      console.warn(err)
    },
  })
  // {
  // update(cache, { data }) {
  //   const res = cache.readQuery<CardQuery, CardQueryVariables>({
  //     query: CardDocument,
  //     variables: { symbol: card.symbol },
  //   })
  //   if (data?.createCardBody && res?.card) {
  //     cache.writeQuery<CardQuery, CardQueryVariables>({
  //       query: CardDocument,
  //       variables: { symbol: card.symbol },
  //       data: { card: { ...res.card, body: data.createCardBody } },
  //     })
  //   }
  // if (afterUpdate && data?.createCardBody) {
  //   afterUpdate(data.createCardBody)
  // }
  // },
  // }

  return (
    <div>
      <button
        onClick={e => {
          // createCardBody({ variables: { cardId: '1', data: {} } })
        }}
      >
        submit
      </button>
      {error && <p>Error...</p>}
    </div>
  )
}

export default TestPage
