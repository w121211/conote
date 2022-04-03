import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import DiscussPage from '../../components/discuss/discuss-page'
import CreatePostForm from '../../components/discuss/post/create-post-form'
import { DiscussTile } from '../../components/discuss/layout-components/discuss-tile'
import { PostTileList } from '../../components/discuss/layout-components/post-tile-list'
import { mockData, mockPostList } from './mock-data'

export default {
  // title: 'pages/Discss Full Page',
  component: DiscussPage,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussPage>

const Template: ComponentStory<typeof DiscussPage> = args => {
  return (
    <div>
      <DiscussTile data={mockData} />
      <PostTileList postList={mockPostList} />
      <CreatePostForm discussId="fajioejf" />
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'ejfowejfoiwej',
}
