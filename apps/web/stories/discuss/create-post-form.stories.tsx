import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import CreateDiscussPostForm from '../../components/discuss-post/discuss-post-form'
import Modal from '../../components/modal/modal'
import ModalProvider from '../../components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: CreateDiscussPostForm,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CreateDiscussPostForm>

const Template: ComponentStory<typeof CreateDiscussPostForm> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <Modal
        visible
        onClose={() => {
          //
        }}
      >
        <CreateDiscussPostForm {...args} />
      </Modal>
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: '1233',
}
