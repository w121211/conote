import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import {
  DiscussPostFragment,
  useDiscussPostsQuery,
} from '../../apollo/query.graphql'
import DiscussPostEmojis from '../../components/discuss/post/post-emojis'
import PostOptionsMenu from '../../components/discuss/post/post-options-menu'
import { PostTile } from '../../components/discuss/layout-components/post-tile'
import { getApolloClient } from '../../apollo/apollo-client'
import { ApolloProvider } from '@apollo/client'

const apolloClient = getApolloClient()

export default {
  // title: 'layout/Post Tile',
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
  const { data } = useDiscussPostsQuery({ variables: { discussId: '' } })
  return (
    <ApolloProvider client={apolloClient}>
      <PostTile {...args} />
    </ApolloProvider>
  )
}

export const Origin = Template.bind({})
Origin.args = {
  userId: 'testuser0',
}
