import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { CreatePostForm } from '../../components/discuss/post/create-post-form'
import Modal from '../../components/modal/modal'
import ModalProvider from '../../components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: CreatePostForm,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof CreatePostForm>

const Template: ComponentStory<typeof CreatePostForm> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <Modal
        visible
        onClose={() => {
          //
        }}
      >
        <CreatePostForm {...args} />
      </Modal>
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: '1233',
}
