import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussPostFragment } from '../apollo/query.graphql'
import DiscussPostEmojis from '../components/discuss/post/post-emojis'
import PostOptionsMenu from '../components/discuss/post/post-options-menu'
import { PostTile } from '../layout/post-tile'

const date = new Date()

const mockPost: DiscussPostFragment = {
  __typename: 'DiscussPost',
  id: '1',
  userId: 'ajsdlkjflkj',

  status: 'ACTIVE',
  content: '測試一下，寫一些東西，這個東西為啥呢? 不能斷航?',
  createdAt: date,
  updatedAt: date,
}

export default {
  title: 'layout/Post Tile',
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

const Template: ComponentStory<typeof PostTile> = args => <PostTile {...args} />

export const Default = Template.bind({})
Default.args = {
  post: mockPost,
}
