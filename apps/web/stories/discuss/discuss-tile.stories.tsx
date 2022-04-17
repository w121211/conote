import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussFragment } from '../../apollo/query.graphql'
import { DiscussTile } from '../../components/discuss/layout-components/discuss-tile'
import { Default } from './post-tile-list.stories'

const date = new Date()

const mockData: DiscussFragment = {
  __typename: 'Discuss',
  id: 'fjalsjoijfef',
  userId: '',
  status: 'ACTIVE',
  meta: {},
  title: '標題哈哈 測試',
  content: `測試一下，寫一些東西，這個東西為啥呢? 不能斷航?
哈哈哈哈哈 給我 內容`,
  createdAt: date,
  updatedAt: date,
  count: {
    __typename: 'DiscussCount',
    nPosts: 10,
  },
}

export default {
  // title: 'layout/Discuss Tile',
  component: DiscussTile,
  decorators: [
    Story => (
      <div style={{ margin: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof DiscussTile>

const Template: ComponentStory<typeof DiscussTile> = args => <DiscussTile {...args} />

export const Origin = Template.bind({})
Origin.args = {
  data: mockData,
}
