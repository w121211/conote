import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussModal from '../../frontend/components/discuss/_modal-page/_discuss-modal'
import ModalProvider from '../../frontend/components/modal/modal-context'

const apolloClient = getApolloClient()

export default {
  component: DiscussModal,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussModal>

const Template: ComponentStory<typeof DiscussModal> = args => (
  <ApolloProvider client={apolloClient}>
    <ModalProvider>
      <DiscussModal />
    </ModalProvider>
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.story = {
  parameters: {
    nextRouter: {
      query: {
        discuss: 'mock_discuss_0_active',
      },
    },
  },
}
