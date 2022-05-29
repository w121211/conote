import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import CreateDiscussForm from '../../components/discuss/create-discuss-form'
import Modal from '../../components/modal/modal'
import ModalProvider from '../../components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: CreateDiscussForm,
} as ComponentMeta<typeof CreateDiscussForm>

export const Template: ComponentStory<typeof CreateDiscussForm> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <Modal
        visible
        onClose={() => {
          //
        }}
      >
        <CreateDiscussForm {...args} />
      </Modal>
    </ModalProvider>
  </ApolloProvider>
)
