import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import DiscussPostTiles from '../../frontend/components/discuss-post/discuss-post-tiles'

const apolloClient = getApolloClient()

export default {
  component: DiscussPostTiles,
  decorators: [
    Story => (
      <div className="bg-gray-200" style={{ padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussPostTiles>

const Template: ComponentStory<typeof DiscussPostTiles> = args => (
  <ApolloProvider client={apolloClient}>
    <DiscussPostTiles {...args} />
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: 'mock_discuss_0_active',
}
