import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { PostTile } from '../../components/discuss/post/post-tile'
import { getApolloClient } from '../../apollo/apollo-client'
import { ApolloProvider } from '@apollo/client'
import { mockDiscussPosts } from '../../test/__mocks__/mock-discuss'

const apolloClient = getApolloClient()
const post = mockDiscussPosts

export default {
  component: PostTile,

  argTypes: {
    className: { table: { disable: true } },
  },
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof PostTile>

const Template: ComponentStory<typeof PostTile> = args => {
  return (
    <ApolloProvider client={apolloClient}>
      {post.map((e, i) => {
        return <PostTile {...args} key={i} post={e} />
      })}
    </ApolloProvider>
  )
}

export const Default = Template.bind({})
Default.args = {
  userId: 'testuser0',
}
