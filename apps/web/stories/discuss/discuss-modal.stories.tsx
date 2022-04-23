import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussTile } from '../../components/discuss/layout-components/discuss-tile'
import { PostTileList } from '../../components/discuss/layout-components/post-tile-list'
import { DiscussModalPage } from '../../components/discuss/modal-page/modal-page'
import { CreatePostForm } from '../../components/discuss/post/create-post-form'
import { mockData, mockPostList } from './mock-discuss-data'

export default {
  component: DiscussModalPage,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussModalPage>

const Template: ComponentStory<typeof DiscussModalPage> = args => (
  <>
    <DiscussTile data={mockData} />
    <PostTileList postList={mockPostList} />
    <CreatePostForm discussId="fajioejf" isModal />
  </>
)

export const Default = Template.bind({})
Default.args = {
  id: 'ejfowejfoiwej',
}
