import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussPostCreateForm from '../../frontend/components/discuss-post/DiscussPostCreateForm'
import Modal from '../../frontend/components/modal/modal'
import ModalProvider from '../../frontend/components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: DiscussPostCreateForm,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussPostCreateForm>

const Template: ComponentStory<typeof DiscussPostCreateForm> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <Modal
        visible
        onClose={() => {
          //
        }}
      >
        <DiscussPostCreateForm {...args} />
      </Modal>
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: '1233',
}
