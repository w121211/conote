import React, { useEffect, useRef, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ComponentMeta } from '@storybook/react'
import { mockDocs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-doc'
import ModalProvider from '../../frontend/components/modal/modal-context'
import EditorEl from '../../frontend/components/editor-slate/src/components/EditorEl'
import { getApolloClient } from '../../apollo/apollo-client'
import { ToastContainer } from 'react-toastify'
import { parseGQLBlocks } from '../../share/utils'
import { blocksToIndenters } from '../../frontend/components/editor-slate/src/indenter/serializers'

const apolloClient = getApolloClient()

export default {
  component: EditorEl,
} as ComponentMeta<typeof EditorEl>

export const Base = () => {
  const doc = mockDocs[0]
  const { blocks: gqlBlocks } = doc.noteDraftCopy.contentBody,
    { blocks } = parseGQLBlocks(gqlBlocks),
    [rootIndenter, ...bodyIndenters] = blocksToIndenters(blocks)

  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        closeOnClick
        draggable={false}
      />
      <ApolloProvider client={apolloClient}>
        <ModalProvider>
          <EditorEl
            docUid={doc.uid}
            draftId={doc.noteDraftCopy.id}
            initialValue={bodyIndenters}
          />
        </ModalProvider>
      </ApolloProvider>
    </>
  )
}
