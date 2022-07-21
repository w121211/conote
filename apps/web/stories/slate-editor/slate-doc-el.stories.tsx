import React, { useEffect, useRef, useState } from 'react'
import { ComponentMeta } from '@storybook/react'
import { mockDocs } from '../../frontend/components/block-editor/test/__mocks__/mock-doc'
import ModalProvider from '../../frontend/components/modal/modal-context'
import SlateDocEl from '../../frontend/components/slate-editor/src/components/slate-doc-el'
import { ApolloProvider } from '@apollo/client'
import { getApolloClient } from '../../apollo/apollo-client'

const apolloClient = getApolloClient()

export default {
  title: 'SlateEditor/SlateDocEl',
  component: SlateDocEl,
} as ComponentMeta<typeof SlateDocEl>

export const List = () => {
  return (
    <ModalProvider>
      <SlateDocEl doc={mockDocs[0]} />
    </ModalProvider>
  )
}

export const MultiEditor = () => {
  return (
    <ModalProvider>
      <SlateDocEl doc={mockDocs[0]} />
      <SlateDocEl doc={mockDocs[0]} />
    </ModalProvider>
  )
}

export const PopoverLeaf = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <SlateDocEl doc={mockDocs[0]} />
      </ModalProvider>
    </ApolloProvider>
  )
}
