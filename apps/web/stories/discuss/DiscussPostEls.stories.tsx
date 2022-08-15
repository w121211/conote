import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussPostEls from '../../frontend/components/discuss-post/DiscussPostEls'

const apolloClient = getApolloClient()

export default {
  component: DiscussPostEls,
  decorators: [
    Story => (
      <div className="bg-gray-200" style={{ padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussPostEls>

const Template: ComponentStory<typeof DiscussPostEls> = args => (
  <ApolloProvider client={apolloClient}>
    <DiscussPostEls {...args} />
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: 'mock_discuss_0_active',
}
