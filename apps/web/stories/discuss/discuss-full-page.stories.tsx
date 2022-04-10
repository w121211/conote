import { ComponentMeta, ComponentStory } from '@storybook/react'
import { useParameter } from '@storybook/api'
import React from 'react'
import DiscussPage from '../../components/discuss/discuss-page'
import { CreatePostForm } from '../../components/discuss/post/create-post-form'
import { DiscussTile } from '../../components/discuss/layout-components/discuss-tile'
import { PostTileList } from '../../components/discuss/layout-components/post-tile-list'
import { mockData, mockPostList } from './mock-data'
import { Layout } from '../../layout/layout'

export default {
  // title: 'pages/Discss Full Page',
  component: DiscussPage,
  decorators: [
    Story => (
      <div>
        <Story />
      </div>
    ),
  ],
  parameters: {
    backgrounds: {
      values: [
        { name: 'gray', value: 'rgb(243 244 246)' },
        { name: 'white', value: '#fff' },
      ],
    },
  },
} as ComponentMeta<typeof DiscussPage>

const Template: ComponentStory<typeof DiscussPage> = args => {
  // const paramState = useParameter<string>('backgroundColor')
  return (
    <div>
      <Layout>
        <DiscussTile data={mockData} />
        <PostTileList postList={mockPostList} />
        <CreatePostForm discussId="fajioejf" />
      </Layout>
    </div>
  )
}

export const Default = Template.bind({})
Default.args = {
  id: 'ejfowejfoiwej',
}
// Default.parameters = {
//   backgrounds: {
//     values: [
//       { name: 'gray', value: 'rgb(243 244 246)' },
//       { name: 'white', value: '#fff' },
//     ],
//   },
// }
