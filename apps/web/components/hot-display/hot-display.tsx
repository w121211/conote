import React, { useState } from 'react'
import HotListItem from '../_hot-list-item'
import { List } from '../ui-component/list'

type Hashtags = '#討論' | '#機會' | '#Battle' | '#事件'

interface ListElement {
  title: string
  href: string
  source: string
  hashtags: Array<Hashtags>
}

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

const orderOptions = [
  { label: '依熱門度', value: 'popularity' },
  { label: '最後更新時間(新->舊)', value: 'newToOld' },
]

function isHashtags(tag: string): tag is Hashtags {
  return ['#討論', '#機會', '#Battle', '#事件'].includes(tag)
}

const filtertags = ['全部', '#討論', '#機會', '#Battle', '#事件']

const HotDisplay = () => {
  const [listData, setListData] = useState<ListElement[]>(dummyList)
  const [currentTab, setCurrentHashtag] = useState(filtertags[0])

  const handleFilter = (tag: string) => {
    if (tag === '全部') {
      setListData(dummyList)
      setCurrentHashtag(tag)
    } else if (isHashtags(tag)) {
      const newList = JSON.parse(JSON.stringify(dummyList)) as ListElement[]
      setListData(newList.filter(e => e.hashtags.includes(tag)))
      setCurrentHashtag(tag)
    }
  }
  return (
    <div>
      <List listData={listData} currentTab={currentTab} />
    </div>
  )
}
export default HotDisplay
