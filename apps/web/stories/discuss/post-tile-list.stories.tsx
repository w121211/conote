import { ApolloProvider } from '@apollo/client'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { getApolloClient } from '../../apollo/apollo-client'
import { DiscussPostFragment } from '../../apollo/query.graphql'
import { PostList } from '../../components/discuss/post/post-list'

const apolloClient = getApolloClient()

export default {
  component: PostList,
  decorators: [
    Story => (
      <div className="bg-gray-200" style={{ padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof PostList>

const Template: ComponentStory<typeof PostList> = args => (
  <ApolloProvider client={apolloClient}>
    <PostList {...args} />
  </ApolloProvider>
)

export const Default = Template.bind({})
Default.args = {
  discussId: 'mock_discuss_0_active',
}
