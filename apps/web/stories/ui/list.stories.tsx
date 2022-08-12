import React from 'react'
import { ComponentMeta, ComponentStory } from '@storybook/react'
import { List, ListElement } from '../../frontend/components/ui/list'

const dummyList: ListElement[] = [
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
  {
    title: '原油 vs 天然氣，哪個比較適合投資？',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#討論', '#機會'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle'],
  },
  {
    title:
      '全球能源緊缺，能源價格攀升，若再碰到嚴冬對天然氣需求增加，天然氣概念股短線或可一搏？($WTI#多 @匿名)',
    href: '#',
    source: '[[原油]]',
    hashtags: ['#Battle', '#事件'],
  },
]

export default {
  component: List,
  argTypes: {
    currentTab: {
      options: ['#討論', '#機會', '#Battle', '#事件'],
      control: { type: 'radio' },
    },
    listData: { table: { disable: true } },
  },
} as ComponentMeta<typeof List>

const Template: ComponentStory<typeof List> = args => (
  <List {...args} listData={dummyList} />
)

export const Default = Template.bind({})
Default.args = {
  currentTab: '#討論',
}
