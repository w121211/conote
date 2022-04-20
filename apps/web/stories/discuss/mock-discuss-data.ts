import {
  DiscussFragment,
  DiscussPostFragment,
} from '../../apollo/query.graphql'
import { mockDate } from '../mock-data'

export const mockData: DiscussFragment = {
  __typename: 'Discuss',
  id: 'fjalsjoijfef',
  userId: '',
  status: 'ACTIVE',
  meta: {},
  title: '標題哈哈 測試',
  content: `測試一下，寫一些東西，這個東西為啥呢? 不能斷航?
  哈哈哈哈哈 給我 內容`,
  createdAt: mockDate,
  updatedAt: mockDate,
  count: {
    __typename: 'DiscussCount',
    nPosts: 10,
  },
}

export const mockPostList: DiscussPostFragment[] = [
  {
    __typename: 'DiscussPost',
    id: '1',
    userId: 'ajsdlkjflkj',

    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能斷航?',
    createdAt: mockDate,
    updatedAt: mockDate,
  },
  {
    __typename: 'DiscussPost',
    id: '2',
    userId: '我',

    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能斷航?',
    createdAt: mockDate,
    updatedAt: mockDate,
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
    createdAt: mockDate,
    updatedAt: mockDate,
  },
  {
    __typename: 'DiscussPost',
    id: '4',
    userId: 'ajsdlkjflkj',
    status: 'ACTIVE',
    content: '測試一下，寫一些東西，這個東西為啥呢? 不能餓不知道要怎麼弄?',
    createdAt: mockDate,
    updatedAt: mockDate,
  },
]
