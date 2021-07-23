/* eslint-disable no-console */
import { ApolloClient, ApolloError, useApolloClient } from '@apollo/client'
import { useUser } from '@auth0/nextjs-auth0'
import { BoardStatus, CardType } from '@prisma/client'
import { Token } from 'prismjs'
import { FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { editorValue } from '../../apollo/cache'
import {
  Board,
  BoardQuery,
  Card,
  CardDocument,
  CardQuery,
  CardQueryVariables,
  Comment,
  CommentsDocument,
  CommentsQuery,
  CommentsQueryVariables,
  CreateSymbolCardDocument,
  CreateSymbolCardMutation,
  CreateSymbolCardMutationVariables,
  useBoardQuery,
  useCardQuery,
  useCommentsQuery,
  useCreateCardBodyMutation,
  useCreateOauthorCommentMutation,
  useMeQuery,
} from '../../apollo/query.graphql'
import { BulletEditor } from '../../components/editor/editor'
import { Serializer } from '../../components/editor/serializer'
import { LiElement, UlElement } from '../../components/editor/slate-custom-types'
import { Node as BulletNode } from '../../lib/bullet/node'
import { tokenize } from '../../lib/bullet/tokenizer'
import { Bullet, BulletDraft, RootBullet, RootBulletDraft } from '../../lib/bullet/types'
import { CardBodyContent, CardHeadContent, CardHeadContentValueInjected, PinBoard } from '../../lib/models/card'
import { injectCardHeadValue } from '../../lib/models/card-helpers'

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
          createCardBody({ variables: { cardId: '1', data: {} } })
        }}
      >
        submit
      </button>
      {error && <p>Error...</p>}
    </div>
  )
}

export default TestPage
