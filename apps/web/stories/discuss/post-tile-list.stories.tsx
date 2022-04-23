import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussPostFragment } from '../../apollo/query.graphql'
import { PostTileList } from '../../components/discuss/layout-components/post-tile-list'
import { mockPostList } from './mock-discuss-data'

// const date = new Date()

export default {
  // title: 'component/Post Tile List',
  component: PostTileList,
  decorators: [
    Story => (
      <div className="bg-gray-200" style={{ padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof PostTileList>

const Template: ComponentStory<typeof PostTileList> = args => (
  <PostTileList {...args} />
)

export const Default = Template.bind({})
Default.args = {
  postList: mockPostList,
}
