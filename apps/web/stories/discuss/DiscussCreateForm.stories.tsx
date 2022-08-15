import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussCreateForm from '../../frontend/components/discuss/DiscussCreateForm'
import Modal from '../../frontend/components/modal/modal'
import ModalProvider from '../../frontend/components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: DiscussCreateForm,
} as ComponentMeta<typeof DiscussCreateForm>

export const Template: ComponentStory<typeof DiscussCreateForm> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <Modal
        visible
        onClose={() => {
          //
        }}
      >
        <DiscussCreateForm {...args} />
      </Modal>
    </ModalProvider>
  </ApolloProvider>
)
