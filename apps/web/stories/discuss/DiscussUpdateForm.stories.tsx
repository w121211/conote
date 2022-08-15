import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { DiscussFragment } from '../../apollo/query.graphql'
import DiscussUpdateForm from '../../frontend/components/discuss/DiscussUpdateForm'
import Modal from '../../frontend/components/modal/modal'
import ModalProvider from '../../frontend/components/modal/modal-context'
import { mockDiscusses } from '../../test/__mocks__/discuss.mock'

const apolloClient = getApolloClient()
const mockDiscuss: DiscussFragment = {
  // ...mockDiscusses('draft-id')[0],
  id: 'string;',
  userId: 'string;',
  status: 'ACTIVE',
  title: 'string;',
  content: null,
  createdAt: '123',
  updatedAt: '234',
  count: {
    id: 'count-id',
    nPosts: 10,
  },
  noteEntries: [],
}

export default {
  component: DiscussUpdateForm,
} as ComponentMeta<typeof DiscussUpdateForm>

const Template: ComponentStory<typeof DiscussUpdateForm> = args => (
  <ApolloProvider client={apolloClient}>
    <DiscussUpdateForm {...args} />
  </ApolloProvider>
)

export const Base = Template.bind({})
Base.args = {
  discuss: mockDiscuss,
}
