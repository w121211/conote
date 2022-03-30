import { ComponentMeta, ComponentStory } from '@storybook/react'
import React from 'react'
import { DiscussPostFragment } from '../apollo/query.graphql'
import { PostTileList } from '../layout/post-tile-list'

const date = new Date()

const mockPostList: DiscussPostFragment[] = [
  {
    __typename: 'DiscussPost',
    id: '1',
    userId: 'ajsdlkjflkj',

    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能斷航?',
    createdAt: date,
    updatedAt: date,
  },
  {
    __typename: 'DiscussPost',
    id: '2',
    userId: '我',

    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能斷航?',
    createdAt: date,
    updatedAt: date,
  },
  {
    __typename: 'DiscussPost',
    id: '3',
    userId: 'ajsdlkjflkj',

    status: 'ACTIVE',
    content: `測試一下，寫一些東西，這個東西為啥呢? 不能斷航 這樣會有用嗎
    第二行
    第三行
    `,
    createdAt: date,
    updatedAt: date,
  },
  {
    __typename: 'DiscussPost',
    id: '4',
    userId: 'ajsdlkjflkj',
    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能餓不知道要怎麼弄?',
    createdAt: date,
    updatedAt: date,
  },
]

export default {
  title: 'component/Post Tile List',
  component: PostTileList,
  decorators: [
    Story => (
      <div className="bg-gray-200" style={{ padding: '3rem' }}>
        <Story />
      </div>
    ),
  ],
} as ComponentMeta<typeof PostTileList>

const Template: ComponentStory<typeof PostTileList> = args => <PostTileList {...args} />

export const Default = Template.bind({})
Default.args = {
  postList: mockPostList,
}
