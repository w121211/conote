import React, { useEffect, useRef, useState } from 'react'
import { ApolloProvider } from '@apollo/client'
import { ComponentMeta } from '@storybook/react'
import { mockDocs } from '../../frontend/components/editor-textarea/test/__mocks__/mock-doc'
import ModalProvider from '../../frontend/components/modal/modal-context'
import DocEl from '../../frontend/components/editor-slate/src/components/DocEl'
import { getApolloClient } from '../../apollo/apollo-client'
import { ToastContainer } from 'react-toastify'

const apolloClient = getApolloClient()

export default {
  component: DocEl,
} as ComponentMeta<typeof DocEl>

export const Base = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={false}
        hideProgressBar
        closeOnClick
        draggable={false}
      />
      <ModalProvider>
        <DocEl doc={mockDocs[0]} />
      </ModalProvider>
    </>
  )
}

// export const MultiEditor = () => {
//   return (
//     <ModalProvider>
//       <SlateDocEl doc={mockDocs[0]} />
//       <SlateDocEl doc={mockDocs[0]} />
//     </ModalProvider>
//   )
// }

export const PopoverLeaf = () => {
  return (
    <ApolloProvider client={apolloClient}>
      <ModalProvider>
        <DocEl doc={mockDocs[0]} />
      </ModalProvider>
    </ApolloProvider>
  )
}
